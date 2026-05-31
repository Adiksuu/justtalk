import { Message } from "@/interfaces/Message";
import { getApp } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import { DataSnapshot, get, getDatabase, limitToLast, onValue, orderByKey, query, ref, update } from "@react-native-firebase/database";
import { decryptMessage, encryptMessage } from "./crypto";
import { getChatID, getUserData } from "./friends";
import { sendRemotePushNotification } from "./notifications";
import { heavyHaptic, lightHaptic } from "./preferences";

// Function to send messages
export const sendMessage = async (message: string, chatId: string, friendUID: string, replyTo?: Message, type: string = "text", media?: string) => {
    const currentUser = auth().currentUser;
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    const messageId = Date.now().toString();

    const encryptedText = encryptMessage(message, chatId);
    
    await update(ref(db, `chats/${chatId}/messages/`), {
        [messageId]: {
            id: messageId,
            type: type,
            text: encryptedText,
            time: Date.now(),
            uid: currentUser?.uid,
            replyingTo: replyTo ? { ...replyTo, text: encryptedText, replyingTo: null } : null,
            media: media ? encryptMessage(media, chatId) : null,
        },
    });

    await lightHaptic();
    const friend = await getUserData(friendUID);
    await sendRemotePushNotification(friendUID, message, friend.fullName);
}

// Function to send message about screenshot
export const sendScreenshotNotificationMessage = async (chatId: string) => {
    const currentUser = auth().currentUser;
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    const messageId = Date.now().toString();

    const fullName: string = (await getUserData(currentUser?.uid || '')).fullName;

    const encryptedText = encryptMessage(`${fullName} took a screenshot.`, chatId);
    
    await update(ref(db, `chats/${chatId}/messages/`), {
        [messageId]: {
            id: messageId,
            type: 'system',
            text: encryptedText,
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
            const latestMessage: any = Object.values(messagesObj)[0]; 
            const decryptedText = decryptMessage(latestMessage.text || '', chatId);
            return { ...latestMessage, text: decryptedText };
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

// Function to format time ago
export const timeAgo = (timestamp: number | any) => {
    if (!timestamp) return 'Offline';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return '1m ego';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return formatTime(timestamp);
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

export const initChatListener = async (uid: string, setChatState: any, unsubscribeChat: any) => {
    const id = await getChatID(uid);
    
    if (!id) {
        setChatState({ chatID: null, lastMessage: null, loading: false });
        return;
    }

    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    const chatRef = ref(db, `chats/${id}/messages`);

    let isFirstLoad = true;
    const currentUserId = auth().currentUser?.uid;

    unsubscribeChat = onValue(chatRef, async () => {
        const latest = await getLatestMessage(id);
        setChatState({
            chatID: id,
            lastMessage: latest,
            loading: false
        });

        if (!isFirstLoad && latest && latest.uid !== currentUserId) heavyHaptic();

        isFirstLoad = false;
    }, (error) => {
        console.error("Error listening to chat messages:", error);
    });
};

// Function to add reaction to message with emoji (toggle for add/remove)
export const reactToMessage = async (chatId: string, messageId: string, emoji: string) => {
    try {
        const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
        const messageRef = ref(db, `chats/${chatId}/messages/${messageId}/reactions/`);
        
        const snapshot = await get(messageRef);
        const reactions = snapshot.exists() ? snapshot.val() : {};
        const currentUser: any = auth().currentUser?.uid;
        if (reactions[currentUser] === emoji) {
            await update(messageRef, {
                [currentUser]: null
            });
        } else {
            await update(messageRef, {
                [currentUser]: emoji
            });
        }
    } catch (error) {
        console.error("Error reacting to message:", error);
    }
}