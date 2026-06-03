import { getAuth } from "@react-native-firebase/auth";
import { getApp } from "@react-native-firebase/app";
import { DataSnapshot, get, getDatabase, onDisconnect, onValue, ref, serverTimestamp } from "@react-native-firebase/database";

// Function to set last seen activity and disconnect
export const subscribeToActivity = (uid: string) => {
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    const userPresenceRef = ref(db, `presence/${uid}`);
    const connectedRef = ref(db, ".info/connected");

    onValue(connectedRef, (snapshot: DataSnapshot) => {
        if (snapshot.val() === true) {
            onDisconnect(userPresenceRef).set({
                state: 'offline',
                lastSeen: serverTimestamp(),
            }).then(() => {
                userPresenceRef.set({
                    state: 'online',
                    lastSeen: serverTimestamp(),
                });
            });
        }
    });
}

// Add the callback parameter here 
export const subscribeToUserActivity = (uid: string, callback: (data: any) => void) => {
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    const userPresenceRef = ref(db, `presence/${uid}`);

    return onValue(userPresenceRef, (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        } else {
            callback(null);
        }
    });
}

// Function to get user typing subscribe in chatID
export const subscribeToTypingStatus = (chatId: string, uid: string, callback: (isTyping: boolean) => void) => {
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    const typingRef = ref(db, `typing/${chatId}/${uid}`);

    return onValue(typingRef, (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        } else {
            callback(false);
        }
    });
}

// Function to set user typing in chatID with onDisconnect
export const setUserTyping = (chatId: string, text: string) => {
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    const uid = getAuth().currentUser?.uid;
    const typingRef = ref(db, `typing/${chatId}/${uid}`);

    onValue(typingRef, (snapshot: DataSnapshot) => {
        if (snapshot.val() === true) {
            onDisconnect(typingRef).set(false);
        }
    });

    // setIsFriendTyping(true)
    return typingRef.set(text.length > 0);
}

// Function to set user read messages in milliseconds
export const setUserReadMessages = (chatId: string) => {
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    const uid = getAuth().currentUser?.uid;

    const readRef = ref(db, `chats/${chatId}/read/${uid}`);
    readRef.set(serverTimestamp());
}

// Function to get user read messages in milliseconds (one-shot)
export const getUserReadMessagesTime = async (chatId: string, uid: string): Promise<number | null> => {
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    const readRef = ref(db, `chats/${chatId}/read/${uid}`);

    const snapshot = await get(readRef);
    return snapshot.exists() ? snapshot.val() : null;
}

// Function to subscribe to a user's read messages time in milliseconds
export const subscribeToUserReadTime = (chatId: string, uid: string, callback: (timestamp: number | null) => void) => {
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    const readRef = ref(db, `chats/${chatId}/read/${uid}`);

    return onValue(readRef, (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        } else {
            callback(null);
        }
    });
}


// Function to count how many messages have .time higher than the user's last read timestamp
export const getUnreadMessagesCount = async (chatId: string, uid: string): Promise<number> => {
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");

    const lastReadTime = await getUserReadMessagesTime(chatId, uid);

    const messagesRef = ref(db, `chats/${chatId}/messages`);
    const snapshot: DataSnapshot | any = await get(messagesRef);

    if (!snapshot.exists()) return 0;

    let count = 0;
    snapshot.forEach((childSnapshot: DataSnapshot) => {
        const message = childSnapshot.val();
        if (message.uid !== uid && (!lastReadTime || message.time > lastReadTime)) {
            count++;
        }
    });

    return count;
}
