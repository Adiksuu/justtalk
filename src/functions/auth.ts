import { getApp } from "@react-native-firebase/app";
import auth, { createUserWithEmailAndPassword, FacebookAuthProvider, GoogleAuthProvider, sendEmailVerification, signInWithCredential, signInWithEmailAndPassword, signInWithPhoneNumber, signOut, updateProfile, verifyBeforeUpdateEmail } from "@react-native-firebase/auth";
import { getDatabase, ref, set } from "@react-native-firebase/database";
import { Router } from "expo-router";
import { Animated, TextInput } from "react-native";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AccessToken, LoginManager } from "react-native-fbsdk-next";
import * as LocalAuthentication from 'expo-local-authentication';

// ----- PHONE AUTHENTICATION AND VERIFICATION FUNCTIONS -----

export function handleSendCode(countryCode: string, phone: string, isDisabled: boolean, setCountdown: React.Dispatch<React.SetStateAction<number>>, setIsDisabled: (isDisabled: boolean) => void, fadeAnim: Animated.Value, slideAnim: Animated.Value, setStep: (step: 'phone' | 'otp' | 'email') => void, setConfirmResult: (confirmResult: any) => void, intervalRef: React.RefObject<number | null>, timerRef: React.RefObject<number | null>) {
    if (phone.length >= 6 && !isDisabled) {
        setCountdown(60);
        setIsDisabled(true);
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
        signInWithPhoneNumber(auth(), `${countryCode}${phone}`).then((result) => {
            setConfirmResult(result);
        }).catch((error) => {
            console.log(error)
        })
        setStep('otp');

        intervalRef.current = setInterval(() => {
            setCountdown((prev: number) => {
            if (prev <= 1) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                return 0;
            }
            return prev - 1;
            });
        }, 1000);

        timerRef.current = setTimeout(() => {
            setIsDisabled(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
        }, 60000);
    }
}

export function handleOtpChange(value: string, index: number, otp: string[], setOtp: React.Dispatch<React.SetStateAction<string[]>>, otpInputs: React.MutableRefObject<(TextInput | null)[]>) {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
}

export function handleOtpKeyPress(key: string, index: number, otp: string[], otpInputs: React.MutableRefObject<(TextInput | null)[]>) {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
}

export function handleVerifyCode(confirmResult: any, otp: string[], router: Router, fadeAnim: Animated.Value, slideAnim: Animated.Value, setStep: (step: 'phone' | 'otp' | 'email') => void) {
    if (confirmResult && otp.length === 6) {
      confirmResult.confirm(otp.join(''))
        .then((userCredential: any) => {
          console.log("Logged in user:", userCredential.user);
          const user = userCredential.user;
          
          if (user.displayName) {
            router.replace('/');
          } else {
            fadeAnim.setValue(0);
            slideAnim.setValue(30);
            setStep('email');
          }
        })
        .catch((error: string) => {
          console.error("Wrong code:", error);
        });
    }
}

export async function handleSaveProfile(fullName: string, email: string, setEmailError: React.Dispatch<React.SetStateAction<string>>, setIsSaving: (isSaving: boolean) => void, router: Router) {
    if (!fullName.trim() || fullName.trim().length < 2) {
      setEmailError('Full name is required (minimum 2 characters)');
      return;
    }
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setIsSaving(true);

    const user = auth().currentUser;
    if (user) {
      console.log("Saving profile for user:", user.uid);
      
      await saveUserDataToRTDB(user);

      user.updateProfile({ displayName: fullName.trim() })
        .then(() => {
          console.log("Auth display name updated successfully in background.");
        })
        .catch(authErr => {
          console.error("Background Auth update error:", authErr);
        });

      user.updateEmail(email.trim())
        .then(() => {
          console.log("Auth email updated successfully in background.");
        })
        .catch(authErr => {
          console.error("Background Auth email update error:", authErr);
        });

      setIsSaving(false);
      router.replace('/');
    } else {
      setIsSaving(false);
      setEmailError('No user is currently signed in.');
    }
}

export const handleLogout = async (setIsLoggingOut: React.Dispatch<React.SetStateAction<boolean>>, closeLogoutConfirm: () => void, router: Router) => {
    setIsLoggingOut(true);
    closeLogoutConfirm();
    try {
      await signOut(auth());
      router.replace('/login');
    } catch (e) {
      console.error("Signout failed:", e);
      setIsLoggingOut(false);
    }
};


// ----- EMAIL AUTHENTICATION AND VERIFICATION FUNCTIONS -----

export const sendEmailVerify = async (email?: string) => {
  const user = auth().currentUser;
  if (user) {
    try {
      if (!user.email && email && email !== 'No email provided') {
        console.log("Sending verify-before-update email to:", email);
        await verifyBeforeUpdateEmail(user, email);
        console.log("Verify-before-update email sent successfully");
      } else if (user.email) {
        await sendEmailVerification(user);
        console.log("Email verification sent successfully");
      } else {
        console.warn("No email available for verification");
      }
    } catch (error) {
      console.error("Error sending email verification:", error);
    }
  }
}

export const handleSignInWithEmail = async (email: string, password: string, setError: React.Dispatch<React.SetStateAction<string>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, router: Router) => {
    if (!email || !password) {
        setError('Please enter your email and password');
        return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth(), email, password);
      setLoading(false);
      router.replace('/');
    } catch (error: any) {
      setLoading(false);
      if (error.code === 'auth/user-not-found') {
        setError('User not found');
      } else if (error.code === 'auth/wrong-password') {
        setError('Wrong password');
      } else {
        setError(error.message);
      }
    }
}

export const handleSignUpWithEmail = async (email: string, password: string, name: string, confirmPassword: string, setError: React.Dispatch<React.SetStateAction<string>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, router: Router) => {
    if (!email || !password || !name || !confirmPassword) {
        setError('Please enter your email and password');
        return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth(), email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      await saveUserDataToRTDB(auth().currentUser);
      await sendEmailVerification(user)
      setLoading(false);
      router.replace('/');
    } catch (error: any) {
      setLoading(false);
      if (error.code === 'auth/user-not-found') {
        setError('User not found');
      } else if (error.code === 'auth/wrong-password') {
        setError('Wrong password');
      } else {
        setError(error.message);
      }
    }
}

// ----- GOOGLE SIGN IN -----

export const handleSignInWithGoogle = async (router: Router) => {
    const response = await GoogleSignin.signIn();

    if (response.type === 'success') {
        const idToken = response.data.idToken;

        if (!idToken) {
            throw new Error('Google Sign-In failed: No ID Token found');
        }

        const googleCredential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth(), googleCredential);
        await saveUserDataToRTDB(auth().currentUser);
        router.replace('/');
    } else {
        console.log('Google Sign-In was cancelled by the user');
    }
}

// ----- FACEBOOK SIGN IN -----

export const handleSignInWithFacebook = async (router: Router) => {
  try {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      console.error('Facebook Sign-in cancelled');
      return;
    }

    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw new Error('Something went wrong obtaining access token');
    }

    const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
    await signInWithCredential(auth(), facebookCredential);
    await saveUserDataToRTDB(auth().currentUser);
    router.replace('/');
  } catch (error) {
    console.error('Facebook Sign-In error:', error);
  } 
}

// FUCTION TO SAVE DATA TO RTD

const saveUserDataToRTDB = async (user: any) => {
    const db = getDatabase(getApp(), "https://justtalk-app-default-rtdb.europe-west1.firebasedatabase.app");
    set(ref(db, `users/${user.uid}`), {
        uid: user.uid,
        fullName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        createdAt: new Date().toISOString()
    })
    .then(() => {
        console.log("Database write completed in background!");
    })
    .catch(dbErr => {
        console.error("Background DB write error:", dbErr);
    });
} 

// ----- BIOMETRIC AUTHENTICATION -----

export const handleBiometricAuth = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return;

  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) return;

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Login with Biometrics',
    promptSubtitle: 'Use your fingerprint or face',
    promptDescription: 'Confirm your identity',
    cancelLabel: 'Cancel',
    disableDeviceFallback: false,
    biometricsSecurityLevel: 'strong',
  });
  return result;
};