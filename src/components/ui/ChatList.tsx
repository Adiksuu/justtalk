import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import ChatItem from '../utils/ChatItem';
import { acceptNewFriend, cancelNewFriend, getChatID, getUserData, subscribeToRequests } from '@/functions/friends';
import SearchResult from './friends/SearchResult';

import auth from "@react-native-firebase/auth";
import { formatTime, getLatestMessage, initChatListener } from '@/functions/messages';
import { getDatabase, onValue, ref } from '@react-native-firebase/database';
import { getApp } from '@react-native-firebase/app';

interface ChatListProps {
    filter: string;
}

export default function ChatList({ filter }: ChatListProps) {
    const router = useRouter();

    const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
    const [outgoingRequests, setOutgoingRequests] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);

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

  return filter === 'Friends' ? (
    <FlatList
        data={friends}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
            <LiveChatItem friend={item} router={router} />
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

function LiveChatItem({ friend, router }: { friend: any; router: any }) {
    const [chatState, setChatState] = useState<{
        chatID: string | null;
        lastMessage: any;
        loading: boolean;
    }>({
        chatID: null,
        lastMessage: null,
        loading: true,
    });

    useEffect(() => {
        let unsubscribeChat: (() => void) | null = null;

        initChatListener(friend.uid, setChatState, (unsubscribe: () => void) => unsubscribeChat = unsubscribe);

        return () => {
            if (unsubscribeChat) unsubscribeChat();
        };
    }, [friend.uid]);

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