import auth from "@react-native-firebase/auth";
import { getApp } from "@react-native-firebase/app";
import { DataSnapshot, getDatabase, onDisconnect, onValue, ref, serverTimestamp } from "@react-native-firebase/database";

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

    // onValue returns the unsubscribe function, which we pass right through
    return onValue(userPresenceRef, (snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val()); // Pass data to your component
        } else {
            callback(null); // Pass null if no data exists
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
    // console.log("setUserTyping", chatId, uid, isTyping)
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    const uid = auth().currentUser?.uid;
    const typingRef = ref(db, `typing/${chatId}/${uid}`);

    onValue(typingRef, (snapshot: DataSnapshot) => {
        if (snapshot.val() === true) {
            onDisconnect(typingRef).set(false);
        }
    });

    // setIsFriendTyping(true)
    return typingRef.set(text.length > 0);
}
