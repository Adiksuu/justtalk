import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, Clipboard } from 'react-native';
import React from 'react';
import { Message } from '@/interfaces/Message';
import { reactToMessage, removeMessage, pinMessage } from '@/functions/messages';
import { decryptMessage } from '@/functions/crypto';
import { Ionicons } from '@expo/vector-icons';

interface ReactionMenuProps {
    message: Message;
    chatId: string;
    setShowMenu: (show: boolean) => void;
    setReplyingToMessage?: (message: Message | null) => void;
}

export default function ReactionMenu({ message, chatId, setShowMenu, setReplyingToMessage }: ReactionMenuProps) {
  const actions = [
    {
        id: 'pin',
        label: message.isPinned ? 'Unpin Message' : 'Pin Message',
        icon: message.isPinned ? ('pin' as const) : ('pin-outline' as const),
        onPress: async () => {
            await pinMessage(chatId || '', message.id, !message.isPinned);
            setShowMenu(false);
        },
        show: !message.isRemoved && message.type !== 'typing',
    },
    {
      id: 'reply',
      label: 'Reply',
      icon: 'arrow-undo-outline' as const,
      onPress: () => {
        if (setReplyingToMessage) {
          const decrypted = message.text ? decryptMessage(message.text, chatId || '') : '';
          setReplyingToMessage({ ...message, text: decrypted });
        }
        setShowMenu(false);
      },
      show: !message.isRemoved && message.type !== 'typing',
    },
    {
      id: 'copy',
      label: 'Copy Text',
      icon: 'copy-outline' as const,
      onPress: () => {
        if (message.text) {
          const decrypted = decryptMessage(message.text, chatId || '');
          Clipboard.setString(decrypted);
        }
        setShowMenu(false);
      },
      show: !message.isRemoved && message.type !== 'image' && message.type !== 'video' && !!message.text,
    },
    {
      id: 'remove',
      label: 'Remove Message',
      icon: 'trash-outline' as const,
      iconColor: '#EF4444',
      textColor: '#EF4444',
      onPress: async () => {
        await removeMessage(chatId || '', message.id);
        setShowMenu(false);
      },
      show: message.isSent && !message.isRemoved,
    },
  ];

  return (
    <Modal
      transparent
      visible={true}
      animationType="slide"
      onRequestClose={() => setShowMenu(false)}
    >
      <View style={styles.container}>
        <Pressable style={styles.backdrop} onPress={() => setShowMenu(false)} />
        
        <View style={styles.sheet}>
          <View style={styles.handle} />
          
          {/* Reaction Emojis Row */}
          {!message.isRemoved && (
            <View style={styles.emojiRow}>
              {['❤️', '😂', '😮', '😢', '🙏', '👍', '🔥'].map((emoji) => (
                <TouchableOpacity 
                  key={emoji} 
                  style={styles.emojiButton}
                  activeOpacity={0.7}
                  onPress={async () => {
                    await reactToMessage(chatId || '', message.id, emoji);
                    setShowMenu(false); 
                  }}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {/* Actions List */}
          <View style={styles.actionList}>
            {actions
              .filter((action) => action.show)
              .map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.actionButton}
                  activeOpacity={0.6}
                  onPress={action.onPress}
                >
                  <View style={styles.actionIconContainer}>
                    <Ionicons 
                      name={action.icon} 
                      size={22} 
                      color={action.iconColor || '#E5E7EB'} 
                    />
                  </View>
                  <Text style={[styles.actionLabel, action.textColor ? { color: action.textColor } : null]}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheet: {
    backgroundColor: '#1E212A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 34,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4B5563',
    alignSelf: 'center',
    marginBottom: 20,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  emojiButton: {
    padding: 6,
  },
  emojiText: {
    fontSize: 28,
  },
  actionList: {
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  actionIconContainer: {
    width: 28,
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '500',
  },
});