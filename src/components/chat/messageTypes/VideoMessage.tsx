import { formatTime } from '@/functions/messages';
import { Message } from '@/interfaces/Message';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import ReadReceipt from '../ReadReceipt';
import RenderReactions from '../RenderReactions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = SCREEN_WIDTH * 0.72;

export default function VideoMessage({ message }: { message: Message }) {
  const { media = '', time = 0, isSent, isRead, reactions } = message;
  const hasReactions = reactions && Object.keys(reactions).length > 0;

  const player = useVideoPlayer(media, (playerInstance) => {
    playerInstance.loop = false;
  });

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  return (
    <View style={[bubbleStyles.row, isSent && bubbleStyles.rowSent, { transform: [{ scaleY: -1 }] }]}>
      <View
        style={[
          bubbleStyles.videoBubble,
          isSent ? bubbleStyles.videoBubbleSent : bubbleStyles.videoBubbleReceived,
          hasReactions && bubbleStyles.containerWithReactions,
        ]}
      >
        <View style={bubbleStyles.videoInner}>
          <View style={bubbleStyles.videoContainer}>
            <VideoView
              player={player}
              style={bubbleStyles.video}
              contentFit='cover'
              nativeControls={true}
            />
            {!isPlaying && (
              <View style={bubbleStyles.playButtonOverlay} pointerEvents="none">
                <Ionicons name="play" size={32} color="#FFFFFF" style={{ marginLeft: 3 }} />
              </View>
            )}
          </View>

          <View style={bubbleStyles.videoTimeOverlay} pointerEvents="none">
            <Text style={bubbleStyles.videoTime}>{formatTime(time)}</Text>
            {isSent && <ReadReceipt isRead={isRead} />}
          </View>
        </View>
        <RenderReactions reactions={reactions} isSent={isSent || false} />
      </View>
    </View>
  );
}

const bubbleStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingHorizontal: 14,
  },
  rowSent: {
    justifyContent: 'flex-end',
  },
  videoBubble: {
    position: 'relative',
    maxWidth: MAX_BUBBLE_WIDTH * 0.85,
  },
  containerWithReactions: {
    marginBottom: 10,
  },
  videoInner: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  videoBubbleSent: {
  },
  videoBubbleReceived: {
  },
  videoContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: MAX_BUBBLE_WIDTH * 0.85,
    height: 180,
  },
  playButtonOverlay: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTimeOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  videoTime: {
    fontSize: 11,
    color: '#FFFFFF',
  },
});