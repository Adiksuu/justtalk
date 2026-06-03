import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { getAuth } from '@react-native-firebase/auth'

export default function Header({ step, fadeAnim, slideAnim, setStep, setOtp }: { step: 'phone' | 'otp' | 'email'; fadeAnim: Animated.Value; slideAnim: Animated.Value; setStep: (step: 'phone' | 'otp' | 'email') => void; setOtp: (otp: string[]) => void }) {
  const router = useRouter()
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.7}
        onPress={() => {
          if (step === 'otp') {
            fadeAnim.setValue(0);
            slideAnim.setValue(30);
            setStep('phone');
            setOtp(['', '', '', '', '', '']);
          } else if (step === 'email') {
            getAuth().signOut()
              .then(() => {
                fadeAnim.setValue(0);
                slideAnim.setValue(30);
                setStep('phone');
                setOtp(['', '', '', '', '', '']);
              })
              .catch((err) => {
                console.log("Error signing out:", err);
              });
          } else {
            router.back();
          }
        }}
      >
        <Ionicons name="chevron-back" size={24} color="#F9FAFB" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#191C21',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
