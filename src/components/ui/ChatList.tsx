import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ChatItem from '../utils/ChatItem';
import { acceptNewFriend, cancelNewFriend, getChatID, getUserData, subscribeToRequests } from '@/functions/friends';
import SearchResult from './friends/SearchResult';

import auth from "@react-native-firebase/auth";
import { formatTime, getLatestMessage } from '@/functions/messages';

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
            onDataChange: async (data) => {
                if (filter === 'Incoming') {
                    setIncomingRequests(data);
                } else if (filter === 'Outgoing') {
                    setOutgoingRequests(data);
                } else {
                    const friendsWithMessages = await Promise.all(
                        data.map(async (user: any) => {
                            const chatID = await getChatID(user.uid);
                            if (!chatID) {
                                return { ...user, lastMessage: 'No messages' };
                            }
                            
                            const lastMessage: any = await getLatestMessage(chatID);
                            console.log(lastMessage);
                            return {
                                ...user,
                                chatID,
                                lastMessage: lastMessage ? lastMessage : 'No messages',
                                time: formatTime(lastMessage?.time),
                            };
                        })
                    );
                    setFriends(friendsWithMessages);
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
            lastMessage={item.lastMessage.text}
            time={item.time}
            unreadCount={item.unreadCount}
            senderName={item.lastMessage?.uid === auth().currentUser?.uid ? 'You' : item.fullName}
            onPress={() => router.push({
                pathname: '/chat/[id]',
                params: { id: item.chatID, name: item.fullName, avatar: item.avatarUrl },
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