import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

interface PreferencesData {
    haptics: boolean,
    notifications: boolean,
    biometrics: boolean,
}

export const savePreferences = async (data: PreferencesData) => {
    try {
        const jsonData = JSON.stringify(data)
        await AsyncStorage.setItem('@justtalk_preferences', jsonData)
        await lightHaptic()
    } catch (error) {
        console.log('Error saving preferences:', error)
    }
}

export const lightHaptic = async () => {
    try {
        const data = await getPreferences();
        if (data.haptics) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    } catch (error) {
        console.log('Error with light haptic:', error)
    }
}

export const getPreferences = async () => {
    try {
        const jsonData: any = await AsyncStorage.getItem('@justtalk_preferences')
        if (jsonData !== null) {
            return JSON.parse(jsonData)
        }
    } catch (error) {
        console.log('Error getting preferences:', error)
    }
    return {
        haptics: false,
        notifications: false,
        biometrics: false,
    }
}

export const ifBiometricsEnabled = async () => {
    try {
        const preferences = await getPreferences();
        return preferences.biometrics;
    } catch (error) {
        console.log('Error getting preferences:', error)
    }
    return false;
}