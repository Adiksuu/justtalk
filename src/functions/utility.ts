import AsyncStorage from "@react-native-async-storage/async-storage";

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