import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StoryCircleProps {
  imageUrl: string;
  name: string;
  isYourStory?: boolean;
  borderColor?: string;
}

export default function StoryCircle({
  imageUrl,
  name,
  isYourStory = false,
  borderColor = '#6366F1', // default purple border
}: StoryCircleProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.container}>
      <View style={styles.avatarContainer}>
        {isYourStory ? (
          // "Your story" style
          <View style={styles.yourStoryWrapper}>
            <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
            <View style={styles.plusBadge}>
              <Ionicons name="add" size={12} color="#FFFFFF" />
            </View>
          </View>
        ) : (
          // Regular story with beautiful ring border
          <View style={[styles.borderRing, { borderColor: borderColor }]}>
            <View style={styles.innerGap}>
              <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
            </View>
          </View>
        )}
      </View>
      <Text style={styles.nameText} numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
    width: 68,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  borderRing: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerGap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#0B0C0E', // matches dark screen background
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2A2D35',
  },
  yourStoryWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#A3E635', // Lime/green background style from image
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  plusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#6366F1', // Purple plus badge
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0B0C0E', // matching background to separate badge
  },
  nameText: {
    color: '#E5E7EB',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 2,
  },
});
