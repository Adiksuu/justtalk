import AsyncStorage from '@react-native-async-storage/async-storage';

interface PreferencesData {
    darkmode: boolean,
    notifications: boolean,
    biometrics: boolean,
}

export const savePreferences = async (data: PreferencesData) => {
    try {
        const jsonData = JSON.stringify(data)
        await AsyncStorage.setItem('@justtalk_preferences', jsonData)
        console.log('Preferences saved successfully')
    } catch (error) {
        console.log('Error saving preferences:', error)
    }
}

export const getPreferences = async () => {
    try {
        const jsonData = await AsyncStorage.getItem('@justtalk_preferences')
        if (jsonData !== null) {
            return JSON.parse(jsonData)
        }
    } catch (error) {
        console.log('Error getting preferences:', error)
    }
    return {
        darkmode: false,
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