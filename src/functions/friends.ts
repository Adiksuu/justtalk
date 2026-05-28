import { getApp } from "@react-native-firebase/app";
import { get, getDatabase, ref, update } from "@react-native-firebase/database";

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

            await update(ref(db, `friends/${currentUser.uid}/`), {
                [targetUID]: true
            })
            await update(ref(db, `friends/${targetUID}/`), {
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