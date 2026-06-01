import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Keyboard,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { searchUser } from '@/functions/friends'
import { addNewFriend } from '@/functions/friends'
import auth from '@react-native-firebase/auth'
import SearchFriend from './friends/SearchFriend'
import ResultsDropdownList from './friends/ResultsDropdownList'
import SearchResult from './friends/SearchResult'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<[string, any][]>([])
  const [loading, setLoading] = useState(false)
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set())

  const inputRef = useRef<TextInput>(null)
  const expandAnim = useRef(new Animated.Value(0)).current
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentUid = auth().currentUser?.uid

  const openSearch = useCallback(() => {
    setSearchOpen(true)
    Animated.timing(expandAnim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: false,
    }).start(() => {
      inputRef.current?.focus()
    })
  }, [expandAnim])

  const closeSearch = useCallback(() => {
    Keyboard.dismiss()
    Animated.timing(expandAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: false,
    }).start(() => {
      setSearchOpen(false)
      setQuery('')
      setResults([])
      setLoading(false)
    })
  }, [expandAnim])

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)

    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    debounceTimer.current = setTimeout(async () => {
      const res = await searchUser(query.trim())
      const filtered = res.filter(([uid]) => uid !== currentUid)
      setResults(filtered)
      setLoading(false)
    }, 400)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [query, currentUid])

  const handleAddFriend = async (uid: string) => {
    setSentRequests((prev) => new Set(prev).add(uid))
    await addNewFriend(uid)
  }
  const titleOpacity = expandAnim.interpolate({
    inputRange: [0, 0.3],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const inputOpacity = expandAnim.interpolate({
    inputRange: [0.4, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })

  const inputWidth = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  })

  return (
    <View style={styles.headerOuter}>
      <View style={styles.header}>
        <Animated.View
          style={[styles.titleWrap, { opacity: titleOpacity }]}
          pointerEvents={searchOpen ? 'none' : 'auto'}
        >
          <Text style={styles.headerTitle}>Chats</Text>
        </Animated.View>
        {searchOpen && (
          <SearchFriend inputOpacity={inputOpacity} inputWidth={inputWidth} closeSearch={closeSearch} inputRef={inputRef} query={query} setQuery={setQuery} />
        )}
        {!searchOpen && (
          <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={openSearch}>
            <Ionicons name="search-outline" size={26} color="#F9FAFB" />
          </TouchableOpacity>
        )}
      </View>

      {searchOpen && (
        <View style={styles.dropdownAnchor}>
          <ResultsDropdownList loading={loading} results={results} query={query} inputOpacity={inputOpacity} renderResultItem={({ item }: { item: [string, any] }) => <SearchResult uid={item[0]} data={item[1]} isSent={sentRequests.has(item[0])} handleAddFriend={handleAddFriend} />} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  headerOuter: {
    zIndex: 100,
  },
  dropdownAnchor: {
    height: 0,
    overflow: 'visible',
    zIndex: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    minHeight: 58,
  },
  titleWrap: {
    position: 'absolute',
    left: 20,
  },
  headerTitle: {
    color: '#F9FAFB',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  addButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
})