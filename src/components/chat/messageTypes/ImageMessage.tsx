import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ReadReceipt from '../ReadReceipt';
import { Message } from '@/interfaces/Message';
import ImagePreview from '@/components/utils/ImagePreview';
import { formatTime } from '@/functions/messages';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = SCREEN_WIDTH * 0.72;

export default function ImageMessage({message}: {message: Message}) {
  const { imageUrl = '', time = 0, isSent, isRead } = message;
  const [visible, setIsVisible] = useState(false);
  
  return (
        <View style={[bubbleStyles.row, isSent && bubbleStyles.rowSent, {transform: [{ scaleY: -1 }]}]}>
          <View
            style={[
              bubbleStyles.imageBubble,
              isSent ? bubbleStyles.imageBubbleSent : bubbleStyles.imageBubbleReceived,
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsVisible(true)}
            >
              <Image
                source={{ uri: imageUrl }}
                style={bubbleStyles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <ImagePreview images={[{uri: imageUrl}]} visible={visible} setIsVisible={setIsVisible} />
            <View style={bubbleStyles.imageTimeOverlay}>
              <Text style={bubbleStyles.imageTime}>{formatTime(time)}</Text>
              {isSent && <ReadReceipt isRead={isRead} />}
            </View>
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
  // Image bubble
  imageBubble: {
    borderRadius: 18,
    overflow: 'hidden',
    maxWidth: MAX_BUBBLE_WIDTH * 0.85,
  },
  imageBubbleSent: {
    borderBottomRightRadius: 4,
  },
  imageBubbleReceived: {
    borderBottomLeftRadius: 4,
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