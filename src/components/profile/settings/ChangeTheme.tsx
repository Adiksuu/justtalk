import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'

type ThemeOption = 'dark' | 'light' | 'system';

interface ThemeItemProps {
  id: ThemeOption;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: [string, string];
  previewBg: string;
  previewCard: string;
  previewText: string;
  selected: boolean;
  onSelect: (id: ThemeOption) => void;
}

function ThemeItem({ id, label, description, icon, colors, previewBg, previewCard, previewText, selected, onSelect }: ThemeItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onSelect(id)}
      style={[styles.themeItem, selected && styles.themeItemSelected]}
    >
      <View style={styles.themePreview}>
        <View style={[styles.previewWindow, { backgroundColor: previewBg }]}>
          <View style={[styles.previewHeader, { backgroundColor: previewCard }]}>
            <View style={[styles.previewDot, { backgroundColor: colors[0] }]} />
            <View style={[styles.previewLine, { backgroundColor: previewText, width: 20 }]} />
          </View>
          <View style={styles.previewBody}>
            <View style={[styles.previewLine, { backgroundColor: previewText, width: 28, marginBottom: 4 }]} />
            <View style={[styles.previewLine, { backgroundColor: previewText, width: 18, opacity: 0.5 }]} />
          </View>
        </View>
      </View>

      <View style={styles.themeInfo}>
        <View style={styles.themeInfoLeft}>
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.themeIconBg}
          >
            <Ionicons name={icon} size={18} color="#FFFFFF" />
          </LinearGradient>
          <View>
            <Text style={styles.themeLabel}>{label}</Text>
            <Text style={styles.themeDescription}>{description}</Text>
          </View>
        </View>

        <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
          {selected && <View style={styles.radioInner} />}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function ChangeTheme() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>('dark')

  const themes: Omit<ThemeItemProps, 'selected' | 'onSelect'>[] = [
    {
      id: 'dark',
      label: 'Dark',
      description: 'Easy on the eyes',
      icon: 'moon',
      colors: ['#6366F1', '#8B5CF6'],
      previewBg: '#0B0C0E',
      previewCard: '#16181D',
      previewText: '#4B5060',
    },
    {
      id: 'light',
      label: 'Light',
      description: 'Classic brightness',
      icon: 'sunny',
      colors: ['#F59E0B', '#F97316'],
      previewBg: '#F3F4F6',
      previewCard: '#FFFFFF',
      previewText: '#D1D5DB',
    },
    {
      id: 'system',
      label: 'System',
      description: 'Match device theme',
      icon: 'phone-portrait',
      colors: ['#10B981', '#06B6D4'],
      previewBg: '#1A1B1F',
      previewCard: '#252730',
      previewText: '#3D4250',
    },
  ]

  return (
    <>
      <Text style={styles.sectionTitle}>Appearance</Text>
      <View style={styles.card}>
        {themes.map((theme, index) => (
          <View key={theme.id}>
            <ThemeItem
              {...theme}
              selected={selectedTheme === theme.id}
              onSelect={setSelectedTheme}
            />
            {index < themes.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
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
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  themeItem: {
    paddingVertical: 14,
  },
  themeItemSelected: {},
  themePreview: {
    marginBottom: 12,
  },
  previewWindow: {
    height: 64,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    overflow: 'hidden',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 18,
    borderRadius: 4,
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  previewDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  previewLine: {
    height: 4,
    borderRadius: 2,
  },
  previewBody: {
    paddingHorizontal: 4,
    paddingTop: 2,
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeLabel: {
    fontSize: 15,
    color: '#F9FAFB',
    fontWeight: '600',
  },
  themeDescription: {
    fontSize: 11,
    color: '#656A76',
    marginTop: 1,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#3D4048',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#6366F1',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6366F1',
  },
})
