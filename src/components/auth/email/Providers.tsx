import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { handleSignInWithGoogle, handleSignInWithGithub } from '@/functions/auth';
import { useRouter } from 'expo-router';

export default function Providers() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    interface Provider {
        name: string;
        icon: keyof typeof Ionicons.glyphMap;
        action: () => void | Promise<void>;
    }
    const providers: Provider[] = [
        {
            name: 'Google',
            icon: 'logo-google',
            action: async () => {
                setLoading(true);
                try {
                    await handleSignInWithGoogle(router);
                } catch (error) {
                    console.error('Google Sign-In error:', error);
                } finally {
                    setLoading(false);
                }
            }
        },
        {
            name: 'Github',
            icon: 'logo-github',
            action: async () => {
                setLoading(true);
                try {
                    await handleSignInWithGithub(router);
                } catch (error) {
                    console.error('Github Sign-In error:', error);
                } finally {
                    setLoading(false);
                }
            }
        }
    ]
  return (
    <View style={styles.providerContainer}>
        {providers.map((provider: Provider) => (
            <TouchableOpacity
                style={styles.alternativeButton}
                activeOpacity={0.7}
                onPress={provider.action}
                key={provider.name}
                disabled={loading}
                >
                {loading ? (
                    <ActivityIndicator color="#F9FAFB" size="small" />
                ) : (
                    <>
                        <Ionicons name={provider.icon} size={20} color="#F9FAFB" />
                        <Text style={styles.alternativeButtonText}>
                            Continue with {provider.name}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
    providerContainer: {
        marginTop: 8,
        gap: 8,
    },
    alternativeButton: {
        flexDirection: 'row',
        backgroundColor: '#191C21',
        height: 54,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: '#2D2F38',
    },
    alternativeButtonText: {
        color: '#F9FAFB',
        fontSize: 15,
        fontWeight: '600',
    },
})
