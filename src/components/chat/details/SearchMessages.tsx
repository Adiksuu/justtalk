import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '@/interfaces/Message';
import { decryptMessage } from '@/functions/crypto';

interface SearchResultItem {
  message: Message;
  decryptedText: string;
}

interface SearchMessagesProps {
  messages: Message[];
  chatId: string;
  onSearch: (query: string, results: SearchResultItem[]) => void;
}

export default function SearchMessages({ messages, chatId, onSearch }: SearchMessagesProps) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    const trimmed = searchText.trim();
    if (!trimmed) return;
    
    const query = trimmed.toLowerCase();
    const results: SearchResultItem[] = [];

    messages.forEach((m) => {
      if (m.text && !m.isRemoved && m.type !== 'system' && m.type !== 'typing') {
        const decrypted = decryptMessage(m.text, chatId);
        if (decrypted.toLowerCase().includes(query)) {
          results.push({
            message: m,
            decryptedText: decrypted,
          });
        }
      }
    });

    onSearch(trimmed, results);
  };

  const handleClear = () => {
    setSearchText('');
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Search Messages</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="search-outline" size={20} color="#8F94A3" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search in conversation..."
          placeholderTextColor="#6B7280"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear} activeOpacity={0.7} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color="#8F94A3" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E2028',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24,
  },
  cardTitle: {
    color: '#F3F4F6',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262A34',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#F9FAFB',
    fontSize: 14,
    paddingVertical: 12,
    paddingRight: 8,
  },
  clearBtn: {
    padding: 4,
  },
});
