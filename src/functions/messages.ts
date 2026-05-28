import { getApp } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import { get, getDatabase, limitToLast, orderByKey, query, ref, update } from "@react-native-firebase/database";

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

// Function to fast load last few messages
export const fastLoadMessages = async (chatId: string, limit: number = 20) => {
    try {
        const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
        const snapshot = await get(ref(db, `chats/${chatId}/messages/`));
        if (snapshot.exists()) {
            const messages = snapshot.val();
            const lastFewMessages = Object.values(messages).slice(-limit);
            return lastFewMessages;
        } else {
            return [];
        }
    } catch (error) {
        console.error(error);
        return [];
    }
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
export const formatTime = (milliseconds: number) => {
    const date = new Date(milliseconds);
    const now = new Date();
    const diff = now.getTime() - milliseconds;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
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