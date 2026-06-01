import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import database from '@react-native-firebase/database';
import { getUnreadMessagesCount } from './activity';

export async function registerForPushNotificationsAsync(userId: string) {
  if (!Device.isDevice) {
    console.log('You must use a physical device to receive push notifications!');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('No permissions for push notifications!');
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: "6f9b608c-d2e1-414d-aefe-8ac622772b9d"
  })).data;

  await database().ref(`users/${userId}/pushToken`).set(token);
}

export async function sendRemotePushNotification(recipientUid: string, messageText: string, senderName: string) {
    try {
        const snapshot = await database()
            .ref(`users/${recipientUid}/pushToken`)
            .once('value');
            
        const pushToken = snapshot.val();
        if (!pushToken) return;

        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: pushToken,
                title: `New message from ${senderName}!`,
                body: messageText,
                sound: 'default',
            }),
        });

        const data = await response.json();
        console.log('Status of sending push notification via Expo API:', data);
    } catch (error) {
        console.error('Error while sending push notification:', error);
    }
}