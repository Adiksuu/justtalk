import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { getFilteredCountries } from '@/constants/COUNTRIES'

export default function CountryModal({ modalVisible, setModalVisible, countryCode, setCountryCode, searchQuery, setSearchQuery }: { modalVisible: boolean, setModalVisible: (visible: boolean) => void, countryCode: string, setCountryCode: (code: string) => void, searchQuery: string, setSearchQuery: (query: string) => void }) {
    const handleSelectCountry = (code: string) => {
        setCountryCode(code)
        setModalVisible(false)
        setSearchQuery('')
    }
    return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        >
        <View style={styles.modalOverlay}>
            <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Country</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={24} color="#F9FAFB" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                style={styles.searchInput}
                placeholder="Search country or code..."
                placeholderTextColor="#6B7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
                />
            </View>

            <FlatList
                data={getFilteredCountries(searchQuery)}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                <TouchableOpacity 
                    style={[
                    styles.countryItem,
                    item.code === countryCode && styles.countryItemActive
                    ]}
                    onPress={() => handleSelectCountry(item.code)}
                >
                    <View style={styles.countryInfo}>
                    <Text style={styles.flagText}>{item.flag}</Text>
                    <Text style={styles.countryName}>{item.name}</Text>
                    </View>
                    <Text style={styles.countryCodeListText}>{item.code}</Text>
                </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
            </SafeAreaView>
        </View>
        </Modal>
  )
}
const styles = StyleSheet.create({
    modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#191C21',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '75%',
    borderWidth: 1,
    borderColor: '#2D2F38',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  modalTitle: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1115',
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#2D2F38',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F9FAFB',
    fontSize: 15,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  countryItemActive: {
    backgroundColor: '#2D2F38',
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagText: {
    fontSize: 20,
  },
  countryName: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '500',
  },
  countryCodeListText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#2D2F38',
    marginHorizontal: 24,
  },
})