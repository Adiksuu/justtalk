import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '@/interfaces/Message';
import { formatTime } from '@/functions/messages';
import { getInitials } from '@/functions/profile';
import { getAuth } from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import Avatar from '../Avatar';

interface SearchResultItem {
  message: Message;
  decryptedText: string;
}

interface SearchResultsModalProps {
  visible: boolean;
  onClose: () => void;
  query: string;
  results: SearchResultItem[];
  friendName: string;
  chatTheme: string[];
  onSelectMessage: (messageId: string) => void;
}

export default function SearchResultsModal({
  visible,
  onClose,
  query,
  results,
  friendName,
  chatTheme,
  onSelectMessage,
}: SearchResultsModalProps) {
  const currentUser = getAuth().currentUser;

  const highlightText = (text: string, searchPhrase: string) => {
    if (!searchPhrase) return <Text style={styles.messageText}>{text}</Text>;
    const parts = text.split(new RegExp(`(${escapeRegExp(searchPhrase)})`, 'gi'));
    return (
      <Text style={styles.messageText}>
        {parts.map((part, i) =>
          part.toLowerCase() === searchPhrase.toLowerCase() ? (
            <Text key={i} style={{...styles.highlight, backgroundColor: chatTheme[0]}}>
              {part}
            </Text>
          ) : (
            <Text key={i}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const renderItem = ({ item }: { item: SearchResultItem }) => {
    const isMe = item.message.uid === currentUser?.uid;
    const senderName = isMe ? 'You' : friendName;
    const formattedDate = formatTime(item.message.time);
    const friendUID = item.message.uid;

    return (
      <TouchableOpacity
        style={styles.resultItem}
        activeOpacity={0.8}
        onPress={() => onSelectMessage(item.message.id)}
      >
        <View style={styles.avatarContainer}>
          <Avatar friendUID={isMe ? currentUser?.uid : friendUID} fullName={senderName} />
        </View>
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={{ ...styles.senderName, color: chatTheme[0] }}>
              {senderName}
            </Text>
            <Text style={styles.messageTime}>{formattedDate}</Text>
          </View>
          <View style={styles.textContainer}>
            {highlightText(item.decryptedText, query)}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search Results</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Found <Text style={{...styles.highlightCount, color: chatTheme[0]}}>{results.length}</Text> {results.length === 1 ? 'match' : 'matches'} for "{query}"
          </Text>
        </View>

        <FlashList
          data={results}
          keyExtractor={(item) => item.message.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#4B5563" />
              <Text style={styles.emptyText}>No matches found</Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16181D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#16181D',
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 36,
  },
  banner: {
    backgroundColor: '#1E2028',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  bannerText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  highlightCount: {
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: '#1E2028',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myAvatar: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  friendAvatar: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  avatarText: {
    color: '#F3F4F6',
    fontSize: 14,
    fontWeight: '700',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '700',
  },
  messageTime: {
    color: '#6B7280',
    fontSize: 12,
  },
  textContainer: {
    marginTop: 2,
  },
  messageText: {
    color: '#E5E7EB',
    fontSize: 14,
    lineHeight: 20,
  },
  highlight: {
    color: '#FFFFFF',
    fontWeight: '600',
    borderRadius: 2,
    paddingHorizontal: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
});
