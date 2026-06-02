import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { THEMES } from '@/constants/THEMES';
import { setChatTheme, getChatTheme } from '@/functions/utility';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 10;
const COLUMNS = 4;
const SWATCH_SIZE = (SCREEN_WIDTH - 32 - GRID_GAP * (COLUMNS - 1)) / COLUMNS;

interface ChatThemesProps {
  chatId: string;
}

function ThemeSwatch({
  theme,
  isActive,
  onPress,
  index,
}: {
  theme: { name: string; colors: [string, string] };
  isActive: boolean;
  onPress: () => void;
  index: number;
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 40,
      tension: 120,
      friction: 14,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: isActive ? 1 : 0,
      tension: 200,
      friction: 15,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[
          styles.swatchOuter,
          isActive && {
            borderColor: theme.colors[0],
            shadowColor: theme.colors[0],
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 8,
          },
        ]}
      >
        <LinearGradient
          colors={theme.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.swatchGradient}
        >
          <Animated.View
            style={[
              styles.checkBadge,
              {
                opacity: checkAnim,
                transform: [{ scale: checkAnim }],
              },
            ]}
          >
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
      <Text style={[styles.swatchLabel, isActive && { color: theme.colors[0] }]} numberOfLines={1}>
        {theme.name}
      </Text>
    </Animated.View>
  );
}

export default function ChatThemes({ chatId }: ChatThemesProps) {
  const [activeTheme, setActiveTheme] = useState<string>('Classic');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    getChatTheme(chatId).then((data) => {
      if (data?.theme) {
        setActiveTheme(data.theme);
      }
    });
  }, [chatId]);

  const handleThemeSelect = async (themeName: string) => {
    if (themeName === activeTheme || applying) return;
    setApplying(true);
    setActiveTheme(themeName);
    try {
      await setChatTheme(themeName, chatId);
    } catch (err) {
      console.error('Failed to set theme:', err);
    } finally {
      setApplying(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="color-palette-outline" size={18} color="#8F94A3" />
          <Text style={styles.title}>Chat Theme</Text>
        </View>
        <Text style={styles.activeLabel}>{activeTheme}</Text>
      </View>

      <View style={styles.grid}>
        {THEMES.map((theme, index) => (
          <ThemeSwatch
            key={theme.name}
            theme={theme}
            isActive={activeTheme === theme.name}
            onPress={() => handleThemeSelect(theme.name)}
            index={index}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E2028',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#F3F4F6',
    fontSize: 15,
    fontWeight: '600',
  },
  activeLabel: {
    color: '#6366F1',
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  swatchOuter: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE * 0.7,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  swatchGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  swatchLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },
});
