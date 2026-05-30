import { Message } from "@/interfaces/Message";
import { getApp } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import { DataSnapshot, get, getDatabase, limitToLast, onValue, orderByKey, query, ref, update } from "@react-native-firebase/database";

// Function to send messages
export const sendMessage = async (message: string, chatId: string) => {
    const currentUser = auth().currentUser;
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    const messageId = Date.now().toString();
    
    await update(ref(db, `chats/${chatId}/messages/`), {
        [messageId]: {
            id: messageId,
            type: 'text',
            text: message,
            time: Date.now(),
            uid: currentUser?.uid,
        },
    });
}

// Function to get latest message in chat
export const getLatestMessage = async (chatId: string) => {
    try {
        const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
        const messagesRef = ref(db, `chats/${chatId}/messages/`);
        const latestMessageQuery = query(messagesRef, orderByKey(), limitToLast(1));
        
        const snapshot = await get(latestMessageQuery);
        
        if (snapshot.exists()) {
            const messagesObj = snapshot.val();
            const latestMessage = Object.values(messagesObj)[0]; 
            return latestMessage;
        } else {
            return { text: 'No messages' };
        }
    } catch (error) {
        console.error("Error fetching latest message:", error);
        return { text: 'No messages' };
    }
}

// Function to change milliseconds to time format HH:MM or Yesterday, Mon or Week ago etc.
export const formatTime = (milliseconds: number | any) => {
    const date = new Date(milliseconds);
    const now = new Date();
    const diff = now.getTime() - milliseconds;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (!milliseconds) return '';
    if (days === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
        return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
    } else {
        return date.toLocaleDateString();
    }
}

export const subscribeToMessages = (
    chatId: string, 
    limitCount: number, 
    onDataChange: (messages: Message[]) => void
) => {
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    const messagesRef = ref(db, `chats/${chatId}/messages/`);

    const q = query(messagesRef, orderByKey(), limitToLast(limitCount));

    return onValue(q, (snapshot: any) => {
        if (snapshot.exists()) {
            const formattedMessages: Message[] = [];
            const currentUser = auth().currentUser;

            snapshot.forEach((childSnapshot: DataSnapshot) => {
                const messageValue = childSnapshot.val();
                formattedMessages.push({
                    id: childSnapshot.key || '',
                    ...messageValue,
                    isSent: messageValue.uid === currentUser?.uid,
                });
            });
            onDataChange(formattedMessages.reverse());
        } else {
            onDataChange([]);
        }
    });
}

// Load more messages when user scrolls to top
export const loadMoreMessages = async (chatId: string, limit: number) => {
    try {
        const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
        const messagesRef = ref(db, `chats/${chatId}/messages/`);
        const latestMessageQuery = query(messagesRef, orderByKey(), limitToLast(limit));
        
        const snapshot = await get(latestMessageQuery);
        
        if (snapshot.exists()) {
            const messages = snapshot.val();
            const lastFewMessages: any = Object.values(messages).slice(-limit);
            const currentUser = auth().currentUser;
            const formattedMessages = lastFewMessages.map((message: Message) => {
                return {
                    ...message,
                    isSent: message.uid === currentUser?.uid,
                };
            });
            return formattedMessages;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching more messages:", error);
        return [];
    }
}
