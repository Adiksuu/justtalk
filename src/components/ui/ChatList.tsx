import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ChatItem from '../utils/ChatItem';
import { acceptNewFriend, cancelNewFriend, getUserData, subscribeToRequests } from '@/functions/friends';
import SearchResult from './friends/SearchResult';

import auth from "@react-native-firebase/auth";

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
        <ChatItem
            name={item.fullName}
            lastMessage={item.lastMessage}
            time={item.time}
            unreadCount={item.unreadCount}
            senderName={item.senderName}
            onPress={() => router.push({
                pathname: '/chat/[id]',
                params: { id: item.uid, name: item.fullName, avatar: item.avatarUrl },
            })}
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


const styles = StyleSheet.create({
    chatList: {
        paddingTop: 12,
        paddingBottom: 120,
    },
})