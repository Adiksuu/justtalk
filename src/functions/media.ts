import * as ImagePicker from 'expo-image-picker';

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