import { View, Text, Animated, ActivityIndicator, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function ResultsDropdownList({loading, results, query, inputOpacity, renderResultItem}: {loading: boolean, results: [string, any][], query: string, inputOpacity: any, renderResultItem: ({ item }: { item: [string, any] }) => React.ReactElement | null}) {
  return (
    <Animated.View style={[styles.resultsContainer, { opacity: inputOpacity }]}>
        {loading ? (
        <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color="#6366F1" />
        </View>
        ) : results.length > 0 ? (
        <FlatList
            data={results}
            keyExtractor={([uid]) => uid}
            renderItem={renderResultItem}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.resultsList}
        />
        ) : query.trim().length > 0 ? (
        <View style={styles.emptyWrap}>
            <Ionicons name="search-outline" size={28} color="#2D2F38" />
            <Text style={styles.emptyText}>No users found</Text>
        </View>
        ) : null}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
    resultsList: {
        paddingVertical: 4,
    },
    resultsContainer: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        backgroundColor: '#191C21',
        borderRadius: 14,
        maxHeight: 280,
        overflow: 'hidden',
        zIndex: 200,
        elevation: 10,
    },
    loadingWrap: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    emptyWrap: {
        paddingVertical: 28,
        alignItems: 'center',
        gap: 8,
    },
    emptyText: {
        color: '#4B5563',
        fontSize: 14,
        fontWeight: '500',
    },
})