import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

interface ChangeUsernameProps {
  currentName: string;
}

export default function ChangeUsername({ currentName }: ChangeUsernameProps) {
  const [username, setUsername] = useState(currentName)
  const [isFocused, setIsFocused] = useState(false)

  const hasChanged = username !== currentName && username.trim().length > 0

  return (
    <>
      <Text style={styles.sectionTitle}>Username</Text>
      <View style={[styles.card, isFocused && styles.cardFocused]}>
        <View style={styles.inputRow}>
          <View style={styles.rowLeft}>
            <View style={styles.iconBg}>
              <Ionicons name="at-outline" size={20} color="#6366F1" />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.rowLabel}>Display Name</Text>
              <TextInput
                style={styles.textInput}
                value={username}
                onChangeText={setUsername}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter new username"
                placeholderTextColor="#3D4048"
                selectionColor="#6366F1"
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={30}
              />
            </View>
          </View>
        </View>

        {hasChanged && (
          <>
            <View style={styles.separator} />
            <View style={styles.actionRow}>
              <Text style={styles.charCount}>{username.length}/30</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.saveButton}
              >
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 16,
    marginBottom: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardFocused: {
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  textInput: {
    fontSize: 15,
    color: '#F9FAFB',
    fontWeight: '600',
    padding: 0,
    margin: 0,
    height: 22,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#656A76',
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
})
