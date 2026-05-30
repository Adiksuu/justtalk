import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Message } from '@/interfaces/Message';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = SCREEN_WIDTH * 0.72;

export default function TypingMessage({message}: {message: Message}) {
    const { text } = message;

    // 1. Inicjalizacja wartości animacji
    const fadeAnim = useRef(new Animated.Value(0)).current;      // Przezroczystość od 0 do 1
    const translateYAnim = useRef(new Animated.Value(15)).current; // Przesunięcie z dołu o 15px

    useEffect(() => {
        // 2. Odpalenie animacji przy montowaniu komponentu
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.spring(translateYAnim, {
                toValue: 0,
                friction: 7,    // Odpowiada za opór (mniejsza wartość = większa elastyczność)
                tension: 40,    // Odpowiada za prędkość początkową
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        // 3. Zamiana zwykłego View na Animated.View i przekazanie stylów animacji
        <Animated.View 
            style={[
                bubbleStyles.row, 
                { 
                    opacity: fadeAnim,
                    transform: [
                        { translateY: translateYAnim },
                    ]
                }
            ]}
        >
            <LinearGradient
                colors={['#7C3AED', '#6366F1']}
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
    // Dodano delikatny transform-origin dla ładniejszego efektu "wyskakiwania"
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