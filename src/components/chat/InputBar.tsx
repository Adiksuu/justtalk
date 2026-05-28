import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardStickyView, useKeyboardHandler } from 'react-native-keyboard-controller';
import { runOnJS } from 'react-native-reanimated';
import { sendMessage } from '@/functions/messages';

export default function InputBar({ chatId }: { chatId: string }) {
  const [text, setText] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const insets = useSafeAreaInsets();

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

  const handleSendMessage = () => {
    if (text.trim() !== '') {
      sendMessage(text, chatId);
      setText('');
    }
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
      <TouchableOpacity activeOpacity={0.7} style={inputStyles.iconBtn}>
        <Ionicons name="attach-outline" size={22} color="#6B7280" style={{ transform: [{ rotate: '-45deg' }] }} />
      </TouchableOpacity>

      <View style={inputStyles.inputWrapper}>
        <TextInput
          placeholder="Message"
          placeholderTextColor="#6B7280"
          style={inputStyles.input}
          value={text}
          onChangeText={setText}
          onSubmitEditing={() => handleSendMessage()}
        />
      </View>

      <TouchableOpacity activeOpacity={0.7} style={inputStyles.iconBtn}>
        <Ionicons name="camera-outline" size={22} color="#6B7280" />
      </TouchableOpacity>
    </KeyboardStickyView>
  );
}

const inputStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
    backgroundColor: '#16181D',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
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
});