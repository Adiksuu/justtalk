import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ReadReceipt from '../ReadReceipt';
import { Message } from '@/interfaces/Message';
import { formatTime } from '@/functions/messages';
import RenderReactions from '../RenderReactions';
// @ts-ignore
import RNUrlPreview from 'react-native-url-preview';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = SCREEN_WIDTH * 0.72;

export default function LinkPreviewMessage({ message }: { message: Message }) {
  const { text = '', time = 0, isSent, isRead, reactions } = message;
  const hasReactions = reactions && Object.keys(reactions).length > 0;

  const renderUrlPreview = () => (
    <View style={bubbleStyles.previewContainer}>
      <RNUrlPreview
        text={text}
        containerStyle={[
          previewStyles.previewContainer,
          {
            backgroundColor: isSent ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
            borderColor: isSent ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
          },
        ]}
        imageStyle={previewStyles.imageStyle}
        faviconStyle={previewStyles.faviconStyle}
        textContainerStyle={previewStyles.textContainerStyle}
        titleStyle={previewStyles.titleStyle}
        descriptionStyle={{
          fontSize: 10,
          color: isSent ? 'rgba(255, 255, 255, 0.7)' : '#9CA3AF',
        }}
        titleNumberOfLines={1}
        descriptionNumberOfLines={2}
        imageProps={{ resizeMode: 'cover' }}
      />
    </View>
  );

  return (
    <View style={[bubbleStyles.row, isSent && bubbleStyles.rowSent, { transform: [{ scaleY: -1 }] }]}>
      {isSent ? (
        <View style={[bubbleStyles.bubbleWrapper, hasReactions && bubbleStyles.containerWithReactions]}>
          <LinearGradient
            colors={['#7C3AED', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[bubbleStyles.bubble, bubbleStyles.bubbleSent]}
          >
            <Text style={[bubbleStyles.messageText, bubbleStyles.messageTextSent]}>
              {text}
            </Text>
            {renderUrlPreview()}
            <View style={bubbleStyles.metaRow}>
              <Text style={[bubbleStyles.timeText, { color: 'rgba(255,255,255,0.6)' }]}>{formatTime(time)}</Text>
              <ReadReceipt isRead={isRead} />
            </View>
          </LinearGradient>
          <RenderReactions reactions={reactions} isSent={isSent} />
        </View>
      ) : (
        <View style={[bubbleStyles.bubbleWrapper, hasReactions && bubbleStyles.containerWithReactions]}>
          <View style={[bubbleStyles.bubble, bubbleStyles.bubbleReceived]}>
            <Text style={[bubbleStyles.messageText, bubbleStyles.messageTextReceived]}>
              {text}
            </Text>
            {renderUrlPreview()}
            <View style={bubbleStyles.metaRow}>
              <Text style={bubbleStyles.timeText}>{formatTime(time)}</Text>
            </View>
          </View>
          <RenderReactions reactions={reactions} isSent={false} />
        </View>
      )}
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
  bubbleWrapper: {
    position: 'relative',
    maxWidth: MAX_BUBBLE_WIDTH,
  },
  containerWithReactions: {
    marginBottom: 10,
  },
  bubble: {
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
  previewContainer: {
    width: '100%',
    overflow: 'hidden',
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
});

const previewStyles = StyleSheet.create({
  previewContainer: {
    padding: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    borderWidth: 1,
  },
  imageStyle: {
    width: 56,
    height: 56,
    borderRadius: 6,
  },
  faviconStyle: {
    width: 16,
    height: 16,
    borderRadius: 3,
  },
  textContainerStyle: {
    flex: 1,
    marginLeft: 8,
    marginRight: 4,
    justifyContent: 'center',
  },
  titleStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
});