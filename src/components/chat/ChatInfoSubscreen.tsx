import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserData, removeFriend } from '@/functions/friends';
import ImagePreview from '@/components/utils/ImagePreview';
import Header from './details/Header';
import ProfileInfo from './details/ProfileInfo';
import Informations from './details/Informations';
import Medias from './details/Medias';
import ChatThemes from './details/ChatThemes';
import VideoPlayerModal from './details/VideoPlayer';
import RemoveFriendModal from './details/RemoveFriendModal';
import { SharedMediaItem } from '@/interfaces/SharedMediaItem';
import { getMediaThumbnail, handleMediaPress, subscribeToChatMedia } from '@/functions/media';
import { ifBiometricsEnabled } from '@/functions/preferences';
import { handleBiometricAuth } from '@/functions/auth';
import { Message } from '@/interfaces/Message';
import SearchMessages from './details/SearchMessages';
import SearchResultsModal from './details/SearchResultsModal';

interface ChatInfoSubscreenProps {
  visible: boolean;
  onClose: () => void;
  friendUID: string;
  name: string;
  chatId: string;
  activeStatus: { state: string; lastSeen: number } | null;
  onFriendRemoved?: () => void;
  messages: Message[];
  chatTheme: string[];
  onSelectMessage?: (messageId: string) => void;
}

export default function ChatInfoSubscreen({
  visible,
  onClose,
  friendUID,
  name,
  chatId,
  activeStatus,
  onFriendRemoved,
  messages,
  chatTheme,
  onSelectMessage,
}: ChatInfoSubscreenProps) {
  const [friendProfile, setFriendProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [sharedMedia, setSharedMedia] = useState<SharedMediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);

  const [previewImages, setPreviewImages] = useState<{ uri: string }[]>([]);
  const [imagePreviewIndex, setImagePreviewIndex] = useState<number>(-1);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(300)).current;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchResultsVisible, setSearchResultsVisible] = useState(false);

  useEffect(() => {
    if (!friendUID || !visible) return;
    setLoadingProfile(true);
    getUserData(friendUID)
      .then((data) => {
        setFriendProfile(data);
        setLoadingProfile(false);
      })
      .catch((err) => {
        console.error('Error fetching user data in info subscreen:', err);
        setLoadingProfile(false);
      });
  }, [friendUID, visible]);

  useEffect(() => {
    if (!chatId || !visible) return;
    setLoadingMedia(true);

    subscribeToChatMedia(chatId, setSharedMedia, setLoadingMedia);
  }, [chatId, visible]);

  const openRemoveConfirm = async () => {
    const biometricsEnabled = await ifBiometricsEnabled();
    let success: boolean = false;
    if (biometricsEnabled) {
      const result = await handleBiometricAuth();
      success = result?.success || false;
    } else success = true;

    if (success === false) return;
    setShowRemoveConfirm(true);
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeRemoveConfirm = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowRemoveConfirm(false);
    });
  };

  const handleConfirmRemove = async () => {
    const success = await removeFriend(friendUID);
    if (success) {
      closeRemoveConfirm();
      if (onFriendRemoved) {
        onFriendRemoved();
      }
    } else {
      Alert.alert('Error', 'Unable to remove friend. Please try again.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <Header onClose={onClose} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ProfileInfo name={name} activeStatus={activeStatus} friendId={friendUID} chatId={chatId} />
          <Informations friendProfile={friendProfile} loadingProfile={loadingProfile} />
          <SearchMessages
            messages={messages}
            chatId={chatId}
            onSearch={(query, results) => {
              setSearchQuery(query);
              setSearchResults(results);
              setSearchResultsVisible(true);
            }}
          />
          <Medias sharedMedia={sharedMedia} loadingMedia={loadingMedia} getMediaThumbnail={getMediaThumbnail} handleMediaPress={(item, index) => handleMediaPress(item, index, sharedMedia, setPreviewImages, setImagePreviewIndex, setImagePreviewVisible, setSelectedVideoUrl)} />
          <ChatThemes chatId={chatId} />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.unfriendBtn}
            onPress={openRemoveConfirm}
          >
            <Ionicons name="person-remove-outline" size={20} color="#EF4444" />
            <Text style={styles.unfriendText}>Remove Friend</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {previewImages.length > 0 && (
        <ImagePreview
          images={previewImages}
          visible={imagePreviewVisible}
          setIsVisible={setImagePreviewVisible}
        />
      )}

      {selectedVideoUrl && (
        <VideoPlayerModal
          url={selectedVideoUrl}
          visible={!!selectedVideoUrl}
          onClose={() => setSelectedVideoUrl(null)}
        />
      )}

      {showRemoveConfirm && (
        <RemoveFriendModal
          backdropAnim={backdropAnim}
          modalAnim={modalAnim}
          closeConfirm={closeRemoveConfirm}
          handleRemove={handleConfirmRemove}
          name={name}
        />
      )}

      <SearchResultsModal
        visible={searchResultsVisible}
        onClose={() => setSearchResultsVisible(false)}
        query={searchQuery}
        results={searchResults}
        friendName={name}
        chatTheme={chatTheme}
        onSelectMessage={(messageId) => {
          setSearchResultsVisible(false);
          if (onSelectMessage) {
            onSelectMessage(messageId);
          }
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16181D',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  unfriendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    gap: 8,
    marginTop: 12,
  },
  unfriendText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
  },
});