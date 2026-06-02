import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Message } from '@/interfaces/Message';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = SCREEN_WIDTH * 0.72;

export default function TypingMessage({message, chatTheme}: {message: Message, chatTheme: string}) {
    const { text } = message;

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(15)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.spring(translateYAnim, {
                toValue: 0,
                friction: 7,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View 
            style={[
                bubbleStyles.row, 
                { 
                    opacity: fadeAnim,
                    transform: [
                        { translateY: translateYAnim },
                        { scaleY: -1 }
                    ]
                }
            ]}
        >
            <LinearGradient
                colors={[chatTheme[0], chatTheme[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[bubbleStyles.bubble]}
            >
                <Text style={[bubbleStyles.messageTextReceived]}>
                    {text}
                </Text>
            </LinearGradient>
        </Animated.View>
    );
}

const bubbleStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingHorizontal: 14,
    marginTop: 12
  },
  bubble: {
    maxWidth: MAX_BUBBLE_WIDTH,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4, 
  },
  bubbleReceived: {
    backgroundColor: '#1E2028',
    borderBottomLeftRadius: 4,
  },
  messageTextReceived: {
    color: '#E5E7EB',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500'
  },
});