import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NoFriends() {
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
                <Ionicons name="people-outline" size={42} color="#6366F1" />
              </View>
            </View>
          </View>
          <View style={[styles.badge, styles.badgeLeft]}>
            <Ionicons name="chatbubble-ellipses-outline" size={13} color="#34D399" />
          </View>
          <View style={[styles.badge, styles.badgeRight]}>
            <Ionicons name="sparkles-outline" size={13} color="#FBBF24" />
          </View>
        </View>
        <Text style={styles.title}>Your List is Empty</Text>
        <Text style={styles.subtitle}>
          JustTalk is much better together! Tap the search button on top to find and add your friends using their username.
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
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    top: '15%',
    left: '10%',
    zIndex: -1,
  },
  glowSphere2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(52, 211, 153, 0.03)',
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
    borderColor: 'rgba(99, 102, 241, 0.15)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    backgroundColor: '#15171C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
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
    backgroundColor: '#112D21',
    borderColor: '#1F573C',
  },
  badgeRight: {
    right: -6,
    top: 12,
    backgroundColor: '#2D2211',
    borderColor: '#543F1F',
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
