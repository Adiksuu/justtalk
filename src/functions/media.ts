import { SharedMediaItem } from '@/interfaces/SharedMediaItem';
import { getApp } from '@react-native-firebase/app';
import { getDatabase, onValue, ref } from '@react-native-firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { decryptMessage } from './crypto';

const CLOUD_NAME = "dd3ppv7km"
const UPLOAD_PRESET = "justtalk_app"

export const pickAndUploadMedia = async (setUploading: any) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (permissionResult.granted === false) return;

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.8,
        videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium
    })

    if (result.canceled) return;

    const asset = result.assets[0];
    const localUri: string = asset.uri;
    const filename: string = localUri.split('/').pop()!;
    
    const match: string[] | null = /\.(\w+)$/.exec(filename);
    const ext: string = match ? match[1] : "";
    const isVideo: boolean = asset.type === 'video';

    const type: string = isVideo ? `video/${ext || 'mp4'}` : `image/${ext || 'jpeg'}`;

    setUploading(true);

    const data = new FormData();
    data.append("file", {
        uri: localUri,
        name: filename,
        type: type,
    } as any);
    data.append("upload_preset", UPLOAD_PRESET);

    const resourceType: string = isVideo ? "video" : "image";

    const resourceApi: string = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

    try {
        const uploadResponse: Response = await fetch(resourceApi, {
            method: 'POST',
            body: data,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        const uploadData = await uploadResponse.json();

        if (uploadData.secure_url) {
            const directUrl: string = uploadData.secure_url;
            setUploading(false);
            return {
                url: directUrl,
                type: resourceType
            };
            
        } else {
            console.error("Upload failed", uploadData);
            setUploading(false);
            return;
        }

    } catch (err) {
        console.log(err);
        setUploading(false);
        return;
    }
}

export const getMediaThumbnail = (item: SharedMediaItem) => {
    if (item.type === 'image') return item.url;
    if (item.url.includes('cloudinary.com')) {
      return item.url.replace(/\.[^/.]+$/, '.jpg');
    }
    return null;
};

export const handleMediaPress = (item: SharedMediaItem, index: number, sharedMedia: SharedMediaItem[], setPreviewImages: any, setImagePreviewIndex: any, setImagePreviewVisible: any, setSelectedVideoUrl: any) => {
    if (item.type === 'image') {
      const imagesOnly = sharedMedia
        .filter((media: SharedMediaItem) => media.type === 'image')
        .map((media: SharedMediaItem) => ({ uri: media.url }));
      
      const targetIndex = sharedMedia
        .filter((media, idx) => idx <= index && media.type === 'image')
        .length - 1;

      setPreviewImages(imagesOnly);
      setImagePreviewIndex(targetIndex >= 0 ? targetIndex : 0);
      setImagePreviewVisible(true);
    } else if (item.type === 'video') {
      setSelectedVideoUrl(item.url);
    }
};

export const subscribeToChatMedia = (chatId: string, setSharedMedia: any, setLoadingMedia: any) => {
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    const messagesRef = ref(db, `chats/${chatId}/messages/`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
            const allMsgs = snapshot.val();
            const mediaList: SharedMediaItem[] = [];

            Object.values(allMsgs).forEach((msg: any) => {
                if (msg.isRemoved) return;
                if (msg.type === 'image' || msg.type === 'video') {
                const decryptedMedia = decryptMessage(msg.media || '', chatId);
                if (decryptedMedia) {
                    mediaList.push({
                    id: msg.id,
                    type: msg.type,
                    url: decryptedMedia,
                    time: msg.time || 0,
                    });
                }
                }
            });

            mediaList.sort((a, b) => b.time - a.time);
            setSharedMedia(mediaList);
        } else {
            setSharedMedia([]);
        }
        setLoadingMedia(false);
        }, (error) => {
        console.error('Error listening to chat media:', error);
        setLoadingMedia(false);
    });
    
    return () => unsubscribe();
}