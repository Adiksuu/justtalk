import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native'

interface MediasProps {
    sharedMedia: any[];
    loadingMedia: boolean;
    getMediaThumbnail: (item: any) => string | null;
    handleMediaPress: (item: any, index: number) => void;
}
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = (SCREEN_WIDTH - 40) / 3;

export default function Medias({ sharedMedia, loadingMedia, getMediaThumbnail, handleMediaPress }: MediasProps) {
    
  return (
    <View style={styles.mediaContainer}>
        <View style={styles.mediaHeader}>
            <Text style={styles.sectionTitle}>Shared Media</Text>
            <Text style={styles.mediaCount}>{sharedMedia.length} files</Text>
        </View>

        {loadingMedia ? (
            <ActivityIndicator color="#6366F1" style={{ marginVertical: 40 }} />
        ) : sharedMedia.length === 0 ? (
            <View style={styles.emptyMedia}>
            <Ionicons name="images-outline" size={48} color="#4B5563" />
            <Text style={styles.emptyMediaText}>No shared media yet</Text>
            </View>
        ) : (
            <View style={styles.mediaGrid}>
            {sharedMedia.map((item, index) => {
                const thumbnailUri = getMediaThumbnail(item);
                return (
                <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    style={styles.gridItem}
                    onPress={() => handleMediaPress(item, index)}
                >
                    {thumbnailUri ? (
                    <Image source={{ uri: thumbnailUri }} style={styles.mediaThumbnail} />
                    ) : (
                    <View style={styles.videoPlaceholder}>
                        <Ionicons name="videocam" size={28} color="#8B5CF6" />
                    </View>
                    )}
                    
                    {item.type === 'video' && (
                    <View style={styles.playIconOverlay}>
                        <Ionicons name="play" size={18} color="#FFFFFF" />
                    </View>
                    )}
                </TouchableOpacity>
                );
            })}
            </View>
        )}
        </View>
  )
}

const styles = StyleSheet.create({
    mediaContainer: {
    marginBottom: 24,
  },
  mediaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  mediaCount: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyMedia: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#1E2028',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyMediaText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 8,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  gridItem: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH,
    margin: 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#262A34',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    position: 'relative',
  },
  mediaThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})