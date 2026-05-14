// import { AppRegistry, Platform } from 'react-native';
// import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import App from './App';
// import { name as appName } from './app.json';

// const PENDING_MEETING_ROOM_KEY = 'PENDING_MEETING_ROOM';
// const isAndroid = Platform.OS === 'android';

// let messaging = null;
// let firestore = null;

// if (isAndroid) {
//   try {
//     messaging = require('@react-native-firebase/messaging').default;
//     firestore = require('@react-native-firebase/firestore').default;
//   } catch (error) {
//     // Keep app startup alive even if Firebase native config is missing.
//     console.warn('Firebase modules unavailable:', error?.message);
//   }
// }

// /* ==============================
//    BACKGROUND FCM: show notification with Accept/Reject
//    ============================== */
// if (messaging) {
//   messaging().setBackgroundMessageHandler(async remoteMessage => {

//     if (!remoteMessage?.data) return;

//     await notifee.createChannel({
//       id: 'call-channel',
//       name: 'Call Channel',
//       importance: AndroidImportance.HIGH,
//     });

//     if (remoteMessage.data.type === 'call') {

//       await notifee.displayNotification({
//         title: 'Incoming Patient Call',
//         body: `${remoteMessage.data.callerName || 'Patient'} is calling`,
//         android: {
//           channelId: 'call-channel',
//           pressAction: { id: 'default' },
//           actions: [
//             { title: 'Accept', pressAction: { id: 'accept' } },
//             { title: 'Reject', pressAction: { id: 'reject' } },
//           ],
//         },
//         data: remoteMessage.data,
//       });
//     }

//     if (remoteMessage.data.type === 'cancel') {
//       await notifee.cancelAllNotifications();
//     }
//   });
// }

// /* ==============================
//    BACKGROUND: when doctor taps Accept/Reject
//    ============================== */
// notifee.onBackgroundEvent(async ({ type, detail }) => {
//   if (!firestore) return;

//   const notification = detail.notification;
//   const pressAction = detail.pressAction;

//   if (type !== EventType.ACTION_PRESS || !notification?.data) return;

//   const callId = String(notification.data.callId ?? '');
//   const roomId = String(notification.data.roomId ?? '');

//   if (pressAction?.id === 'accept') {
//     await firestore().collection('Calls').doc(callId).update({ status: 'accepted' });
//     if (roomId) await AsyncStorage.setItem(PENDING_MEETING_ROOM_KEY, roomId);
//     await notifee.cancelNotification(notification.id);
//   }

//   if (pressAction?.id === 'reject') {
//     await firestore().collection('Calls').doc(callId).update({ status: 'rejected' });
//     await notifee.cancelNotification(notification.id);
//   }
// });

// AppRegistry.registerComponent(appName, () => App);
// index.js
import { AppRegistry, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from './App';
import { name as appName } from './app.json';

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const PENDING_MEETING_ROOM_KEY = 'PENDING_MEETING_ROOM';
const isAndroid = Platform.OS === 'android';

// ─────────────────────────────────────────────
// FIRESTORE — lazy load to survive missing native config
// ─────────────────────────────────────────────
let firestore = null;
try {
  firestore = require('@react-native-firebase/firestore').default;
} catch (error) {
  console.warn('Firestore unavailable:', error?.message);
}

/* ================================================================
   BACKGROUND FCM HANDLER
   Runs when app is in background / quit and a data message arrives.
   Shows a heads-up notification with Accept / Reject actions.
================================================================ */
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (!remoteMessage?.data) return;

  console.log('📩 Background FCM received:', remoteMessage.data);

  // ── Ensure the notification channel exists (Android only) ──
  if (isAndroid) {
    await notifee.createChannel({
      id: 'call-channel',
      name: 'Call Channel',
      importance: AndroidImportance.HIGH,
    });
  }

  // ── Incoming call ──
  if (remoteMessage.data.type === 'incoming_call') {
    await notifee.displayNotification({
      title: 'Incoming Patient Call',
      body: `${remoteMessage.data.callerName ?? 'Doctor'} is calling`,
      android: {
        channelId: 'call-channel',
        pressAction: { id: 'default' },
        importance: AndroidImportance.HIGH,
        // Keeps notification alive until dismissed explicitly
        ongoing: true,
        actions: [
          { title: '✅ Accept', pressAction: { id: 'accept' } },
          { title: '❌ Reject', pressAction: { id: 'reject' } },
        ],
      },
      // Carry call metadata so onBackgroundEvent can act on it
      data: remoteMessage.data,
    });
  }

  // ── Caller cancelled before nurse responded ──
  if (remoteMessage.data.type === 'cancel_call') {
    await notifee.cancelAllNotifications();
  }
});

/* ================================================================
   BACKGROUND NOTIFEE ACTION HANDLER
   Fires when user presses Accept / Reject from the notification tray
   while the app is backgrounded or killed.
================================================================ */
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type !== EventType.ACTION_PRESS || !detail.notification?.data) return;

  const { pressAction, notification } = detail;
  const callId = String(notification.data.callId ?? '');
  const roomId = String(notification.data.roomId ?? '');

  // ── ACCEPT ──
  if (pressAction?.id === 'accept') {
    // Update Firestore so the caller's listener picks it up
    if (firestore && callId) {
      await firestore()
        .collection('calls_user')
        .doc(callId)
        .update({ status: 'accepted' });
    }

    // Stash roomId — App.js reads this on next foreground to navigate
    if (roomId) {
      await AsyncStorage.setItem(PENDING_MEETING_ROOM_KEY, roomId);
    }

    await notifee.cancelNotification(notification.id);
  }

  // ── REJECT ──
  if (pressAction?.id === 'reject') {
    if (firestore && callId) {
      await firestore()
        .collection('calls_user')
        .doc(callId)
        .update({ status: 'rejected' });
    }

    await notifee.cancelNotification(notification.id);
  }
});

/* ================================================================
   APP ENTRY POINT
================================================================ */
AppRegistry.registerComponent(appName, () => App);