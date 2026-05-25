import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ChatHeader({ name, avatarUrl, onBack,}: { name: string; avatarUrl: string; onBack: () => void;}) {
  return (
    <View style={headerStyles.container}>
      <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={headerStyles.backBtn}>
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={headerStyles.avatarWrapper}>
        <Image source={{ uri: avatarUrl }} style={headerStyles.avatar} />
        <View style={headerStyles.onlineDot} />
      </View>

      <View style={headerStyles.info}>
        <Text style={headerStyles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={headerStyles.status}>last seen just now</Text>
      </View>

      {/* <View style={headerStyles.actions}>
        <TouchableOpacity activeOpacity={0.7} style={headerStyles.actionBtn}>
          <Ionicons name="videocam-outline" size={21} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={headerStyles.actionBtn}>
          <Ionicons name="call-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#16181D',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    padding: 6,
    marginRight: 4,
  },
  avatarWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'visible',
    marginRight: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#16181D',
  },
  info: {
    flex: 1,
    gap: 1,
  },
  name: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    color: '#6B7280',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    padding: 8,
  },
});