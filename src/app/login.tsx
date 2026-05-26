import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const animatedValue = useRef(new Animated.Value(0)).current;

  function handleTabChange(tab: string) {
    if (tab === 'email') router.push('/auth/email');
    if (tab === 'phone') router.push('/auth/phone');
  }

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <View style={styles.screen}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <Animated.View 
              style={[
                styles.brandContainer, 
                { transform: [{ scale }] }
              ]}
            >
                <Text style={styles.brandText}>Just Talk</Text>
                <View style={styles.brandDot} />
            </Animated.View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => handleTabChange('phone')}>
                    <Text style={styles.buttonText}>Continue with Phone</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonPrimary} activeOpacity={0.7} onPress={() => handleTabChange('email')}>
                    <Text style={styles.buttonText}>Continue with Email</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>By continuing, you agree to our Terms and Conditions</Text>
            </View>
        </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#0B0C0E',
    },
    safeArea: {
        flex: 1,
    },
    brandContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    brandText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 5,
    },
    brandDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#6366F1',
        marginTop: 8,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 10,
    },
    button: {
        width: '80%',
        backgroundColor: '#191C21',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPrimary: {
        width: '80%',
        backgroundColor: '#6366F1',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerContainer: {
        marginTop: 20,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 10,
    },
    footerText: {
        color: '#656A76', // Zmieniłem na lekko szary, żeby nie odciągał uwagi od dołu
        fontSize: 12,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});