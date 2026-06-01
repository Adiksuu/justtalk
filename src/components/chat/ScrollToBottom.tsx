import { Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { scrollToBottom } from '@/functions/utility'
import IoIcons from '@expo/vector-icons/Ionicons';

interface ScrollToBottomProps {
  showButton: boolean;
  scrollViewRef: React.RefObject<any>;
}

export default function ScrollToBottom({ showButton, scrollViewRef }: ScrollToBottomProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: showButton ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showButton, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View 
      style={[
        styles.scrollButton, 
        { 
          opacity, 
          transform: [{ translateX }] 
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.touchableArea} 
        onPress={() => scrollToBottom(scrollViewRef)}
      >
        <Text style={styles.buttonText}>
          <IoIcons name="chevron-down" size={24} />
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrollButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    zIndex: 10,
  },
  touchableArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});