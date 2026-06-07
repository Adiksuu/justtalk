import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { removeUserAvatar } from '@/functions/profile'
import { useState } from 'react';

export default function RemoveAvatar() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      <Text style={styles.sectionTitle}>Avatar</Text>
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.row}
          onPress={() => removeUserAvatar(setIsLoading)}
        >
          <View style={styles.rowLeft}>
            <View style={styles.iconBg}>
              <Ionicons name="image-outline" size={20} color="#F59E0B" />
            </View>
            <View>
              <Text style={styles.rowLabel}>Remove Avatar</Text>
              <Text style={styles.rowSubLabel}>Reset to default initials avatar</Text>
            </View>
          </View>
          <View style={styles.actionBadge}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#F59E0B" />
            ) : (
              <Ionicons name="trash-outline" size={16} color="#F59E0B" />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#656A76',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 6,
  },
  card: {
    backgroundColor: '#16181D',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 16,
    marginBottom: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 15,
    color: '#F59E0B',
    fontWeight: '600',
  },
  rowSubLabel: {
    fontSize: 11,
    color: '#656A76',
    marginTop: 2,
  },
  actionBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.12)',
  },
})
