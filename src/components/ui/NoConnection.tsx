import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NoConnection() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const translateYAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, translateYAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.glowSphere1} />
      <View style={styles.glowSphere2} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim }
            ],
          },
        ]}
      >
        <View style={styles.iconGroup}>
          <View style={styles.outerCircle}>
            <View style={styles.middleCircle}>
              <View style={styles.innerCircle}>
                <Ionicons name="wifi-outline" size={42} color="#EF4444" />
              </View>
            </View>
          </View>
          <View style={[styles.badge, styles.badgeLeft]}>
            <Ionicons name="cloud-offline-outline" size={13} color="#9CA3AF" />
          </View>
          <View style={[styles.badge, styles.badgeRight]}>
            <Ionicons name="alert-circle-outline" size={13} color="#F59E0B" />
          </View>
        </View>
        
        <Text style={styles.title}>You are Offline</Text>
        <Text style={styles.subtitle}>
          No internet connection found. Please check your cellular data or Wi-Fi network and try again to stay connected with JustTalk.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
    backgroundColor: 'transparent',
  },
  glowSphere1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(239, 68, 68, 0.04)',
    top: '15%',
    left: '10%',
    zIndex: -1,
  },
  glowSphere2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(245, 158, 11, 0.02)',
    bottom: '20%',
    right: '5%',
    zIndex: -1,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconGroup: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  outerCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.15)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    backgroundColor: '#15171C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  innerCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#191C21',
    borderWidth: 1,
    borderColor: '#2D2F38',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  badgeLeft: {
    left: -6,
    bottom: 12,
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  badgeRight: {
    right: -6,
    top: 12,
    backgroundColor: '#2E200F',
    borderColor: '#5C3E16',
  },
  title: {
    color: '#F9FAFB',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
});