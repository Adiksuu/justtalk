import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { formatJoinedDate } from '@/functions/profile';

export default function Informations({ friendProfile, loadingProfile }: { friendProfile: any, loadingProfile: boolean }) {
  return (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>Information</Text>
        {loadingProfile ? (
            <ActivityIndicator color="#6366F1" style={{ marginVertical: 20 }} />
        ) : (
            <View style={styles.cardContent}>
            <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#8F94A3" style={styles.infoIcon} />
                <View>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>
                    {formatJoinedDate(friendProfile?.createdAt)}
                </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color="#8F94A3" style={styles.infoIcon} />
                <View>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                    {friendProfile?.email || 'No email provided'}
                </Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color="#8F94A3" style={styles.infoIcon} />
                <View>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>
                    {friendProfile?.phoneNumber || 'No phone linked'}
                </Text>
                </View>
            </View>
        </View>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1E2028',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 24,
    },
    cardTitle: {
        color: '#F3F4F6',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 16,
    },
    cardContent: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        marginRight: 14,
    },
    infoLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        color: '#F9FAFB',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.06)',
        marginVertical: 4,
    },
})