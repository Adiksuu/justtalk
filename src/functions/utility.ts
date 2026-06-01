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