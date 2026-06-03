import { UserProfileData } from "@/interfaces/UserProfileData";
import auth, { getAuth } from "@react-native-firebase/auth";
import { getApp } from "@react-native-firebase/app";
import { get, getDatabase, ref } from "@react-native-firebase/database";

export const formatJoinedDate = (isoString?: string) => {
    if (!isoString) return 'May 2026';
    try {
      const date = new Date(isoString);
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch (e) {
      return 'May 2026';
    }
};

export const getInitials = (name: string) => {
    if (!name) return 'JT';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
};

export const copyUserId = (profile: UserProfileData, setCopiedId: React.Dispatch<React.SetStateAction<boolean>>, triggerToast: () => void, Clipboard: any) => {
    if (!profile.uid) return;
    try {
      Clipboard.setString(profile.uid);
      setCopiedId(true);
      triggerToast();
      setTimeout(() => setCopiedId(false), 2500);
    } catch (e) {
      console.log("Clipboard write failed:", e);
    }
};

export const fetchUserProfile = (router: any, setProfile: React.Dispatch<React.SetStateAction<UserProfileData>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    const user = getAuth().currentUser;
    if (!user) {
      router.replace('/login');
      return;
    }

    console.log(user)

    setProfile({
      uid: user.uid,
      fullName: user.displayName || 'JustTalk User',
      email: user.email || 'No email provided',
      emailVerified: user.emailVerified || false,
      phoneNumber: user.phoneNumber || 'No phone linked',
      avatar: null,
    });

    try {
        const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
        const userRef = ref(db, `users/${user.uid}`);
        
        get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
            const data = snapshot.val();
            setProfile({
                uid: user.uid,
                fullName: data.fullName || user.displayName || 'JustTalk User',
                email: data.email || user.email || 'No email provided',
                emailVerified: user.emailVerified || false,
                phoneNumber: data.phoneNumber || user.phoneNumber || 'No phone linked',
                createdAt: data.createdAt,
                avatar: data.avatar || null,
            });
            }
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error reading profile RTDB details:", err);
            setLoading(false);
        });
    } catch (e) {
        console.error("RTDB access error:", e);
        setLoading(false);
    }
}