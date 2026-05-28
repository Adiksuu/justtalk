import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

export default function Filters({ activeFilter, setActiveFilter }: { activeFilter: string; setActiveFilter: (filter: string) => void }) {
    const FILTER_CHIPS = ['All', 'Personal', 'Family', 'Office', 'Book Club'];

  return (
    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
        style={styles.chipsScroll}
    >
        {FILTER_CHIPS.map((chip) => {
        const isActive = activeFilter === chip;
        return (
            <TouchableOpacity
            key={chip}
            onPress={() => setActiveFilter(chip)}
            activeOpacity={0.75}
            style={[styles.chip, isActive && styles.chipActive]}
            >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {chip}
            </Text>
            </TouchableOpacity>
        );
        })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    chipsScroll: {
      flexGrow: 0,
      marginTop: 16,
  },
  chipsContainer: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 18,
    height: 32,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1E24',
  },
  chipActive: {
    backgroundColor: '#2D2F38',
  },
  chipText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#F9FAFB',
    fontWeight: '600',
  },
})