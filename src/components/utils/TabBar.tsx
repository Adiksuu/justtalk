import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type TabStyleType = 'capsule' | 'classic' | 'floating';
export type ThemeModeType = 'dark' | 'light';

interface TabBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  styleType: TabStyleType;
  themeMode: ThemeModeType;
}

export default function TabBar({
  currentTab,
  onTabChange,
  styleType,
  themeMode,
}: TabBarProps) {
  const isDark = themeMode === 'dark';

  const tabs = [
    { id: 'home', label: 'Home', icon: 'home-outline', iconFilled: 'home' },
    ...(styleType === 'floating' ? [{ id: 'scanner', label: 'Scan', icon: 'scan-outline', iconFilled: 'scan', isCenter: true }] : []),
    { id: 'profile', label: 'Profile', icon: 'person-outline', iconFilled: 'person' },
  ];

  const containerBg = isDark ? '#16181D' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';
  const shadowColor = isDark ? '#000000' : '#8E9096';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: containerBg,
          borderColor: borderColor,
          shadowColor: shadowColor,
        },
      ]}
    >
      <View style={styles.innerContainer}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;

          if (styleType === 'capsule') {
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => onTabChange(tab.id)}
                activeOpacity={0.8}
                style={styles.tabWrapper}
              >
                {isActive ? (
                  <View style={styles.capsuleActive}>
                    <Ionicons name={tab.iconFilled as any} size={20} color="#FFFFFF" />
                    <Text style={styles.capsuleLabel}>{tab.label}</Text>
                  </View>
                ) : (
                  <Ionicons
                    name={tab.icon as any}
                    size={22}
                    color={isDark ? '#8E9096' : '#6B7280'}
                  />
                )}
              </TouchableOpacity>
            );
          }

          if (styleType === 'classic') {
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => onTabChange(tab.id)}
                activeOpacity={0.7}
                style={styles.classicTab}
              >
                <Ionicons
                  name={(isActive ? tab.iconFilled : tab.icon) as any}
                  size={22}
                  color={isActive ? '#6366F1' : isDark ? '#8E9096' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.classicLabel,
                    {
                      color: isActive ? '#6366F1' : isDark ? '#8E9096' : '#6B7280',
                      fontWeight: isActive ? '600' : '400',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          }

          if (styleType === 'floating') {
            if (tab.isCenter) {
              return (
                <View key={tab.id} style={styles.floatingCenterContainer}>
                  <TouchableOpacity
                    onPress={() => onTabChange('scanner')}
                    activeOpacity={0.85}
                    style={styles.floatingCenterButton}
                  >
                    <Ionicons name="scan-outline" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              );
            }

            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => onTabChange(tab.id)}
                activeOpacity={0.7}
                style={styles.classicTab}
              >
                <Ionicons
                  name={(isActive ? tab.iconFilled : tab.icon) as any}
                  size={22}
                  color={isActive ? '#FFFFFF' : isDark ? '#8E9096' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.classicLabel,
                    {
                      color: isActive ? (isDark ? '#FFFFFF' : '#111827') : isDark ? '#8E9096' : '#6B7280',
                      fontWeight: isActive ? '600' : '400',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          }

          return null;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: '15%',
    borderRadius: 28,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 8,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    zIndex: 100,
    width: '70%',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 50,
  },
  tabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  capsuleActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  capsuleLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  classicTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  classicLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  floatingCenterContainer: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    top: -20, // push it upwards to float
  },
  floatingCenterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
