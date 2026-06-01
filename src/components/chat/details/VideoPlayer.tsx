import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function VideoPlayerModal({ url, visible, onClose }: { url: string; visible: boolean; onClose: () => void }) {
  const player = useVideoPlayer(url, (playerInstance) => {
    playerInstance.loop = false;
    playerInstance.play();
  });

  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={videoStyles.container}>
        <TouchableOpacity style={videoStyles.closeButton} onPress={onClose} activeOpacity={0.7}>
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <VideoView
          player={player}
          style={videoStyles.video}
          contentFit="contain"
          nativeControls={true}
        />
      </View>
    </Modal>
  );
}

const videoStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});