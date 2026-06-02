import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Platform, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardStickyView, useKeyboardHandler } from 'react-native-keyboard-controller';
import { runOnJS } from 'react-native-reanimated';
import { sendMessage } from '@/functions/messages';
import { setUserTyping } from '@/functions/activity';
import { Message } from '@/interfaces/Message';
import ReplyBox from './ReplyBox';
import { pickAndUploadMedia } from '@/functions/media';
import { getMessageDraft, setMessageDraft } from '@/functions/utility';

export default function InputBar({ 
  chatId, 
  friendUID, 
  replyingTo, 
  onCancelReply,
  chatTheme
}: { 
  chatId: string, 
  friendUID: string, 
  replyingTo: Message | null, 
  onCancelReply: () => void,
  chatTheme: any
}) {
  const [text, setText] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const [uploading, setUploading]: any = useState(false);

  useKeyboardHandler({
    onStart: (e) => {
      'worklet';
      runOnJS(setIsKeyboardOpen)(e.height > 0);
    },
    onEnd: (e) => {
      'worklet';
      runOnJS(setIsKeyboardOpen)(e.height > 0);
    },
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const draft = await getMessageDraft(chatId || '');
      if (draft) setText(draft);
    }
    fetch();
  }, [chatId]);

  const handleSendMessage = () => {
    if (text.trim() !== '') {
      sendMessage(text, chatId, friendUID, replyingTo || undefined, 'text');
      setUserTyping(chatId, "");
      setText('');
      onCancelReply();
      setMessageDraft('', chatId)
    }
  }

  const handleSendMedia = async () => {
    const result = await pickAndUploadMedia(setUploading)
    if (result) sendMessage('', chatId, friendUID, replyingTo || undefined, result.type, result.url);
    onCancelReply();
    setMessageDraft('', chatId)
  }

  const getBottomPadding = () => {
    if (Platform.OS === 'android') return 12;
    if (isKeyboardOpen) return 10;
    return insets.bottom > 0 ? insets.bottom - 10 : 8;
  };

  return (
    <KeyboardStickyView 
      style={[
        inputStyles.container, 
        { paddingBottom: getBottomPadding() }
      ]}
    >
      {replyingTo && (
        <ReplyBox replyingTo={replyingTo} onCancelReply={onCancelReply} chatId={chatId || ''} chatTheme={chatTheme} />
      )}

      <View style={inputStyles.bottomRow}>
        <TouchableOpacity activeOpacity={0.7} style={inputStyles.iconBtn} onPress={async () => handleSendMedia()}>
          <Ionicons name="attach-outline" size={22} color="#6B7280" style={{ transform: [{ rotate: '-45deg' }] }} />
        </TouchableOpacity>

        <View style={inputStyles.inputWrapper}>
          <TextInput
            placeholder={uploading ? 'Uploading media...' : 'Message'}
            placeholderTextColor={uploading ? '#6B7280' : '#9CA3AF'}
            style={[inputStyles.input, uploading && inputStyles.disabled]}
            value={text}
            editable={!uploading}
            onChangeText={(value) => {
              setText(value);
              setUserTyping(chatId, value);
              setMessageDraft(value, chatId);
            }}
            onSubmitEditing={() => handleSendMessage()}
          />
        </View>

        <TouchableOpacity activeOpacity={0.7} style={inputStyles.iconBtn}>
          <Ionicons name="camera-outline" size={22} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </KeyboardStickyView>
  );
}

const inputStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 8,
    backgroundColor: '#16181D',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    width: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  iconBtn: {
    padding: 6,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#1E2028',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  input: {
    color: '#F9FAFB',
    fontSize: 15,
    padding: 0,
  },
  disabled: {
    opacity: 0.6,
  }
});