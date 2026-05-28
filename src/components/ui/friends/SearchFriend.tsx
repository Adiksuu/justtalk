import { Animated, TouchableOpacity, TextInput, View, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function SearchFriend({inputOpacity, inputWidth, closeSearch, inputRef, query, setQuery}: any) {
  return (
    <Animated.View
        style={[styles.inputRow, { opacity: inputOpacity, width: inputWidth }]}
        >
        <TouchableOpacity
            onPress={closeSearch}
            activeOpacity={0.7}
            style={styles.backBtn}
        >
            <Ionicons name="arrow-back" size={22} color="#9CA3AF" />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
            <Ionicons
            name="search-outline"
            size={18}
            color="#6366F1"
            style={styles.searchIcon}
            />
            <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Search by username..."
            placeholderTextColor="#4B5563"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            />
            {query.length > 0 && (
            <TouchableOpacity
                onPress={() => setQuery('')}
                activeOpacity={0.7}
                style={styles.clearBtn}
            >
                <Ionicons name="close-circle" size={18} color="#4B5563" />
            </TouchableOpacity>
            )}
        </View>
        </Animated.View>
  )
}

const styles = StyleSheet.create({
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    backBtn: {
        padding: 4,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#191C21',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#2D2F38',
        height: 44,
        overflow: 'hidden',
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        color: '#F9FAFB',
        fontSize: 15,
        fontWeight: '500',
        height: '100%',
        padding: 0,
    },
    clearBtn: {
        padding: 4,
        marginLeft: 4,
    },
})