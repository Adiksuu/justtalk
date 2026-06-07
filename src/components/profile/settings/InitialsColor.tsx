import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { THEMES } from '@/constants/THEMES';

interface InitialsColorProps {
  currentColors: [string, string];
}

export default function InitialsColor({ currentColors }: InitialsColorProps) {
  const [selectedId, setSelectedId] = useState(
    THEMES.find(p => p.colors[0] === currentColors[0])?.name || 'Classic'
  )

  return (
    <>
      <Text style={styles.sectionTitle}>Initials Color</Text>
      <View style={styles.card}>
        <View style={styles.previewRow}>
          <View style={styles.rowLeft}>
            <View style={styles.iconBg}>
              <Ionicons name="color-palette-outline" size={20} color="#6366F1" />
            </View>
            <View>
              <Text style={styles.rowLabel}>Avatar Gradient</Text>
              <Text style={styles.rowSubLabel}>Shown when no profile photo is set</Text>
            </View>
          </View>
          <LinearGradient
            colors={THEMES.find(p => p.name === selectedId)?.colors || currentColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.previewBubble}
          >
            <Text style={styles.previewText}>JT</Text>
          </LinearGradient>
        </View>

        <View style={styles.separator} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.colorGrid}
          style={styles.colorScroll}
        >
          {THEMES.map((preset) => (
            <TouchableOpacity
              key={preset.name}
              activeOpacity={0.7}
              onPress={() => setSelectedId(preset.name)}
              style={[
                styles.colorOption,
                selectedId === preset.name && styles.colorOptionSelected,
              ]}
            >
              <LinearGradient
                colors={preset.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.colorSwatch}
              >
                {selectedId === preset.name && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </LinearGradient>
              <Text style={[
                styles.colorLabel,
                selectedId === preset.name && styles.colorLabelSelected,
              ]}>
                {preset.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
  previewRow: {
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
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  rowSubLabel: {
    fontSize: 11,
    color: '#656A76',
  },
  previewBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  colorScroll: {
    marginVertical: 14,
  },
  colorGrid: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 8,
  },
  colorOption: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  colorOptionSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  colorLabel: {
    fontSize: 10,
    color: '#656A76',
    fontWeight: '600',
  },
  colorLabelSelected: {
    color: '#F9FAFB',
  },
})
