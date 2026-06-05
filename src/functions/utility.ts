import { THEMES } from "@/constants/THEMES";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp } from "@react-native-firebase/app";
import { get, getDatabase, onValue, ref, update } from "@react-native-firebase/database";
import { Linking } from "react-native";
import { Message } from "@/interfaces/Message";
import { decryptMessage } from "./crypto";

export const scrollToBottom = (scrollViewRef: React.RefObject<any>) => {
    scrollViewRef.current?.scrollToOffset({ animated: true });
};

export const handleScroll = (event: any, setShowButton: (value: boolean) => void) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    
    if (scrollY > 200) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
};

export const setMessageDraft = async (text: string, chatID: string) => {
  try {
      const jsonData = JSON.stringify(text)
      await AsyncStorage.setItem(`@justtalk_draft_${chatID}`, jsonData)
    } catch (error) {
      console.log('Error saving preferences:', error)
    }
}

export const getMessageDraft = async (chatID: string) => {
  try {
      const jsonData: any = await AsyncStorage.getItem(`@justtalk_draft_${chatID}`)
      if (jsonData !== null) {
          return JSON.parse(jsonData)
      }
    } catch (error) {
      console.log('Error getting preferences:', error)
    }
    return "";
}

export const setChatTheme = async (theme: string, chatID: string) => {
  const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
  await update(ref(db, `chats/${chatID}/theme`), {theme})
  return true;
}

export const getChatTheme = async (chatID: string) => {
  const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
  const snapshot = await get(ref(db, `chats/${chatID}/theme`));
  return snapshot.val();
}

export const subscribeToChatTheme = (chatID: string, callback: (theme: string) => void) => {
  const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
  const subscription = onValue(ref(db, `chats/${chatID}/theme`), (snapshot) => {
    callback(snapshot.val() || "Classic");
  });
  return subscription;
}

export const getChatThemeColors = (theme: string | any) => {
  return THEMES.find((t) => t.name === theme)?.colors;
}

export const handleOpenExternalBrowser = async (url: string) => {
  Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
};

export interface SearchResultItem {
  message: Message;
  decryptedText: string;
}

export const searchMessages = (messages: Message[] | any[], query: string, chatId: string): SearchResultItem[] => {
    const results: SearchResultItem[] = [];
    const lowerQuery = query.toLowerCase();

    if (!Array.isArray(messages)) return results;

    messages.filter((m: any) => m.type === 'text' && !m.isRemoved).forEach((m: any) => {
        const decrypted = decryptMessage(m.text || '', chatId);
        if (decrypted.toLowerCase().includes(lowerQuery)) {
          results.push({
            message: m,
            decryptedText: decrypted,
          });
        }
    });

    return results;
}

export const getPinnedMessages = (messages: Message[] | any[], chatId: string): SearchResultItem[] => {
    const results: SearchResultItem[] = [];

    if (!Array.isArray(messages)) return results;

    messages.filter((m: any) => m.isPinned && !m.isRemoved).forEach((m: any) => {
        let decrypted = '';
        if (m.type === 'image') {
          decrypted = '[Photo]';
        } else if (m.type === 'video') {
          decrypted = '[Video]';
        } else if (m.text) {
          decrypted = decryptMessage(m.text, chatId);
        }
        results.push({
          message: m,
          decryptedText: decrypted,
        });
    });

    return results;
}