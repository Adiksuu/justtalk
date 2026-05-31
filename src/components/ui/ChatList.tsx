import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ChatItem from '../utils/ChatItem';
import { acceptNewFriend, cancelNewFriend, getUserData, subscribeToRequests } from '@/functions/friends';
import SearchResult from './friends/SearchResult';

import auth from "@react-native-firebase/auth";
import { formatTime, initChatListener } from '@/functions/messages';

interface ChatListProps {
    filter: string;
}

export default function ChatList({ filter }: ChatListProps) {
    const router = useRouter();

    const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
    const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [chatsState, setChatsState] = useState<Record<string, { chatID: string | null; lastMessage: any; loading: boolean }>>({});

    useEffect(() => {
        const currentUser = auth().currentUser;
        if (!currentUser) return;

        const unsubscribe = subscribeToRequests({
            filter,
            currentUserId: currentUser.uid,
            getUserData,
            onDataChange: (data) => {
                if (filter === 'Incoming') {
                    setIncomingRequests(data);
                } else if (filter === 'Outgoing') {
                    setOutgoingRequests(data);
                } else {
                    setFriends(data);
                }
            }
        });
        return () => unsubscribe();
    }, [filter]);

    useEffect(() => {
        if (filter !== 'Friends' || friends.length === 0) return;

        const unsubscribes: (() => void)[] = [];

        friends.forEach((friend) => {
            initChatListener(
                friend.uid, 
                (updatedChatState: any) => {
                    setChatsState((prevState) => ({
                        ...prevState,
                        [friend.uid]: typeof updatedChatState === 'function' 
                            ? updatedChatState(prevState[friend.uid] || { chatID: null, lastMessage: null, loading: true })
                            : updatedChatState
                    }));
                }, 
                (unsubscribe: any) => {
                    unsubscribes.push(unsubscribe);
                }
            );
        });

        return () => {
            unsubscribes.forEach((unsub) => unsub());
        };
    }, [friends, filter]);

    const sortedFriends = useMemo(() => {
        if (filter !== 'Friends') return [];

        return [...friends].sort((a, b) => {
            const chatA = chatsState[a.uid]?.lastMessage;
            const chatB = chatsState[b.uid]?.lastMessage;

            // Pobieramy timestamp (zakładam, że time to obiekt Date, timestamp z Firebase lub liczba ms)
            // Jeśli nie ma wiadomości, ustawiamy 0, żeby pchać te czaty na sam dół
            const timeA = chatA?.time ? new Date(chatA.time).getTime() : 0;
            const timeB = chatB?.time ? new Date(chatB.time).getTime() : 0;

            // Sortowanie malejąco (najnowsze wiadomości na górze)
            return timeB - timeA;
        });
    }, [friends, chatsState, filter]);

  return filter === 'Friends' ? (
    <FlatList
        data={sortedFriends}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
            <LiveChatItem 
                friend={item} 
                router={router} 
                chatState={chatsState[item.uid] || { chatID: null, lastMessage: null, loading: true }} 
            />
        )}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
    />
  ) : (
    <FlatList
        data={filter === 'Incoming' ? incomingRequests : outgoingRequests}
        keyExtractor={(item: any) => item.uid} 
        renderItem={({ item }: any) => (
            <SearchResult  
                uid={item.uid} 
                data={item} 
                isSent={filter === 'Outgoing'} 
                handleAddFriend={(uid: string) => filter === 'Incoming' ? acceptNewFriend(uid) : cancelNewFriend(uid)} 
            />
        )}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
    />
  )
}

function LiveChatItem({ friend, router, chatState }: { friend: any; router: any; chatState: any }) {
    
    const displayDetails = useMemo(() => {
        if (chatState.loading) {
            return { text: 'Loading...', time: '', sender: '' };
        }
        if (!chatState.lastMessage) {
            return { text: 'No messages', time: '', sender: '' };
        }
        return {
            text: chatState.lastMessage.text || 'Sent an attachment',
            time: formatTime(chatState.lastMessage.time),
            sender: chatState.lastMessage.uid === auth().currentUser?.uid ? 'You' : friend.fullName
        };
    }, [chatState.lastMessage, chatState.loading, friend.fullName]);

    return (
        <ChatItem
            name={friend.fullName}
            lastMessage={displayDetails.text}
            time={displayDetails.time}
            unreadCount={friend.unreadCount}
            senderName={displayDetails.sender}
            onPress={() => {
                if (chatState.chatID) {
                    router.push({
                        pathname: '/chat/[id]',
                        params: { id: chatState.chatID, name: friend.fullName, avatar: friend.avatarUrl, friendUID: friend.uid },
                    });
                }
            }}
        />
    );
}

const styles = StyleSheet.create({
    chatList: {
        paddingTop: 12,
        paddingBottom: 120,
    },
});