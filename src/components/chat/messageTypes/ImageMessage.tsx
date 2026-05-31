import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReadReceipt from '../ReadReceipt';
import { Message } from '@/interfaces/Message';
import ImagePreview from '@/components/utils/ImagePreview';
import { formatTime } from '@/functions/messages';
import RenderReactions from '../RenderReactions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = SCREEN_WIDTH * 0.72;

export default function ImageMessage({message}: {message: Message}) {
  const { media = '', time = 0, isSent, isRead, reactions } = message;
  const hasReactions = reactions && Object.keys(reactions).length > 0;
  const [visible, setIsVisible] = useState(false);
  
  return (
        <>
        <View style={[bubbleStyles.row, isSent && bubbleStyles.rowSent, {transform: [{ scaleY: -1 }]}]}>
          <View
            style={[
              bubbleStyles.imageBubble,
              isSent ? bubbleStyles.imageBubbleSent : bubbleStyles.imageBubbleReceived,
              hasReactions && bubbleStyles.containerWithReactions,
            ]}
          >
            <View style={bubbleStyles.imageInner}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsVisible(true)}
              >
                <Image
                  source={{ uri: media }}
                  style={bubbleStyles.image}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <View style={bubbleStyles.imageTimeOverlay}>
                <Text style={bubbleStyles.imageTime}>{formatTime(time)}</Text>
                {isSent && <ReadReceipt isRead={isRead} />}
              </View>
            </View>
            <RenderReactions reactions={reactions} isSent={isSent || false} />
          </View>
        </View>
        <ImagePreview images={[{uri: media}]} visible={visible} setIsVisible={setIsVisible} />
        </>
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
  bubble: {
    maxWidth: MAX_BUBBLE_WIDTH,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  bubbleSent: {
    borderBottomRightRadius: 4,
  },
  bubbleReceived: {
    backgroundColor: '#1E2028',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  messageTextSent: {
    color: '#FFFFFF',
  },
  messageTextReceived: {
    color: '#E5E7EB',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 3,
    gap: 2,
  },
  timeText: {
    fontSize: 11,
    color: '#6B7280',
  },
  imageBubble: {
    position: 'relative',
    maxWidth: MAX_BUBBLE_WIDTH * 0.85,
  },
  containerWithReactions: {
    marginBottom: 10,
  },
  imageInner: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  imageBubbleSent: {
  },
  imageBubbleReceived: {
  },
  image: {
    width: MAX_BUBBLE_WIDTH * 0.85,
    height: 180,
  },
  imageTimeOverlay: {
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
  imageTime: {
    fontSize: 11,
    color: '#FFFFFF',
  },
});