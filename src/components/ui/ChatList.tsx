import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ChatItem from '../utils/ChatItem';
import { acceptNewFriend, cancelNewFriend, getUserData, subscribeToRequests } from '@/functions/friends';
import SearchResult from './friends/SearchResult';

import auth from "@react-native-firebase/auth";
import { formatTime, initChatListener } from '@/functions/messages';
import NoFriends from './friends/NoFriends';

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
            const timeA = chatA?.time ? new Date(chatA.time).getTime() : 0;
            const timeB = chatB?.time ? new Date(chatB.time).getTime() : 0;
            return timeB - timeA;
        });
    }, [friends, chatsState, filter]);

    const currentData = filter === 'Friends' ? sortedFriends : filter === 'Incoming' ? incomingRequests : filter === 'Outgoing' ? outgoingRequests : [];

    if (currentData.length === 0) return <NoFriends />;

  return filter === 'Friends' ? (
  <FlatList
    data={currentData}
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
    data={currentData}
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
);
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
            text: chatState.lastMessage.isRemoved ? 'Message removed' : chatState.lastMessage.type === 'text' ? chatState.lastMessage.text : "Sent an attachment",
            time: formatTime(chatState.lastMessage.time),
            sender: chatState.lastMessage.uid === auth().currentUser?.uid ? 'You' : friend.fullName,
            unreadCount: chatState.unreadCount || 0
        };
    }, [chatState.lastMessage, chatState.loading, chatState.unreadCount, friend.fullName]);

    return (
        <ChatItem
            name={friend.fullName}
            lastMessage={displayDetails.text}
            time={displayDetails.time}
            unreadCount={displayDetails.unreadCount}
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