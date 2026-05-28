import { getApp } from "@react-native-firebase/app";
import { DatabaseReference, get, getDatabase, onValue, ref, update } from "@react-native-firebase/database";

import auth from "@react-native-firebase/auth";

// Add new friend request function
export const addNewFriend = async (targetUID: string) => {
    try {
        const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
        const currentUser = auth().currentUser;

        if (currentUser && targetUID) {
            await update(ref(db, `friends_requests/${currentUser.uid}/outgoing/`), {
                [targetUID]: true
            })
            await update(ref(db, `friends_requests/${targetUID}/incoming/`), {
                [currentUser.uid]: true
            })
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Cancel new friend request function
export const cancelNewFriend = async (targetUID: string) => {
    try {
       const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
        const currentUser = auth().currentUser;

        if (currentUser && targetUID) {
            await update(ref(db, `friends_requests/${currentUser.uid}/outgoing/`), {
                [targetUID]: null
            })
            await update(ref(db, `friends_requests/${targetUID}/incoming/`), {
                [currentUser.uid]: null
            })
            
            return true;
        } else {
            return false;
        } 
        
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Accept new friend request function
export const acceptNewFriend = async (targetUID: string) => {
    try {
       const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
        const currentUser = auth().currentUser;

        if (currentUser && targetUID) {
            await update(ref(db, `friends_requests/${currentUser.uid}/incoming/`), {
                [targetUID]: null
            })
            await update(ref(db, `friends_requests/${targetUID}/outgoing/`), {
                [currentUser.uid]: null
            })

            const chatId = currentUser.uid > targetUID ? `${currentUser.uid}_${targetUID}` : `${targetUID}_${currentUser.uid}`;

            await update(ref(db, `friends/${currentUser.uid}/`), {
                [targetUID]: chatId
            })
            await update(ref(db, `friends/${targetUID}/`), {
                [currentUser.uid]: chatId
            })
            
            return true;
        } else {
            return false;
        } 
        
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Decline new friend request function
export const declineNewFriend = async (targetUID: string) => {
    try {
       const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
        const currentUser = auth().currentUser;

        if (currentUser && targetUID) {
            await update(ref(db, `friends_requests/${currentUser.uid}/incoming/`), {
                [targetUID]: null
            })
            await update(ref(db, `friends_requests/${targetUID}/outgoing/`), {
                [currentUser.uid]: null
            })
            
            return true;
        } else {
            return false;
        } 
        
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Remove friend function
export const removeFriend = async (targetUID: string) => {
    try {
       const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
        const currentUser = auth().currentUser;

        if (currentUser && targetUID) {
            await update(ref(db, `friends/${currentUser.uid}/`), {
                [targetUID]: null
            })
            await update(ref(db, `friends/${targetUID}/`), {
                [currentUser.uid]: null
            })
            
            return true;
        } else {
            return false;
        } 
        
    } catch (error) {
        console.error(error);
        return false;
    }
}

// Search user function by username (even if username is not full just similiar)
export const searchUser = async (username: string) => {
    try {
       const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
        const currentUser = auth().currentUser;

        if (currentUser && username) {
            const snapshot = await get(ref(db, `users/`));
            if (snapshot.exists()) {
                const users = snapshot.val();
                console.log(users);
                const filteredUsers = Object.entries(users).filter(([key, value]: [string, any]) => {
                    return value.fullName.toLowerCase().includes(username.toLowerCase()) && value.uid !== currentUser.uid;
                });
                return filteredUsers;
            } else {
                return [];
            }
        } else {
            return [];
        } 
        
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Get friends function
export const getFriends = async () => {
    try {
       const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
        const currentUser = auth().currentUser;

        if (currentUser) {
            const snapshot = await get(ref(db, `friends/${currentUser.uid}/`));
            if (snapshot.exists()) {
                const friends = snapshot.val();
                console.log(friends);
                return friends;
            } else {
                return [];
            }
        } else {
            return [];
        } 
        
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Get user data function
export const getUserData = async (uid: string) => {
    try {
       const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");

       if (uid) {
        const snapshot = await get(ref(db, `users/${uid}/`));
        if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log(userData);
            return userData;
        } else {
            return null;
        }
       } else {
        return null;
       }
    } catch (error) {
        console.error(error);
        return null;
    }
}


interface SubscribeOptions {
    filter: 'Incoming' | 'Outgoing' | 'Friends' | string;
    currentUserId: string;
    onDataChange: (data: any[]) => void;
    getUserData: (uid: string) => Promise<any>;
}

export const subscribeToRequests = ({ filter, currentUserId, onDataChange, getUserData }: SubscribeOptions) => {
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    
    let requestsRef: DatabaseReference;
    let subPath: string;

    if (filter === 'Friends') {
        requestsRef = ref(db, `friends/${currentUserId}/`);
    } else {
        subPath = filter === 'Incoming' ? 'incoming' : 'outgoing';
        requestsRef = ref(db, `friends_requests/${currentUserId}/${subPath}/`);
    }

    return onValue(requestsRef, async (snapshot) => {
        if (snapshot.exists()) {
            const requests = snapshot.val();
            
            let uids: string[] = [];
            if (requests && typeof requests === 'object' && !Array.isArray(requests)) {
                uids = Object.keys(requests);
            } else if (Array.isArray(requests)) {
                uids = requests.filter(Boolean);
            }

            const fullDataPromises = uids.map(async (uid: string) => {
                const userData = await getUserData(uid);
                return { uid, ...userData };
            });
            
            const resolvedRequests = await Promise.all(fullDataPromises);
            onDataChange(resolvedRequests);
        } else {
            onDataChange([]);
        }
    }, (error) => {
        console.error(`Error while listening to ${subPath}:`, error);
    });
};

// Get chatID function
export const getChatID = async (targetUID: string) => {
    try {
       const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
        const currentUser = auth().currentUser;

        if (currentUser && targetUID) {
            const snapshot = await get(ref(db, `friends/${currentUser.uid}/${targetUID}/`));
            if (snapshot.exists()) {
                const chatId = snapshot.val();
                return chatId;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}