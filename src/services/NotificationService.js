// // services/NotificationService.js
// import messaging from '@react-native-firebase/messaging';
// import { Platform } from 'react-native';
// import { SOCKET_URL } from './SocketManager';

// class NotificationService {
  
//   // ─────────────────────────────────────────────
//   // PERMISSION
//   // ─────────────────────────────────────────────
//   async requestPermission() {
//     if (Platform.OS === 'android') return true; // Android 12 and below auto-grants

//     const status = await messaging().requestPermission();
//     return (
//       status === messaging.AuthorizationStatus.AUTHORIZED ||
//       status === messaging.AuthorizationStatus.PROVISIONAL
//     );
//   }

//   // ─────────────────────────────────────────────
//   // TOKEN
//   // ─────────────────────────────────────────────
//   async getFCMToken() {
//     try {
//       if (!messaging().isDeviceRegisteredForRemoteMessages) {
//         await messaging().registerDeviceForRemoteMessages();
//       }
//       return await messaging().getToken();
//     } catch (e) {
//       console.error('FCM token error:', e);
//       return null;
//     }
//   }

//   async sendTokenToBackend(userId, token) {
//     try {
//       await fetch(`${SOCKET_URL}/register-fcm-token`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, fcmToken: token }),
//       });
//       console.log('FCM token registered with backend');
//     } catch (e) {
//       console.error('Token registration failed:', e);
//     }
//   }

//   // ─────────────────────────────────────────────
//   // FOREGROUND HANDLER
//   // Returns unsubscribe fn — store & call on unmount
//   // ─────────────────────────────────────────────
//   setupForegroundHandler(navigation) {
//     return messaging().onMessage(async (remoteMessage) => {
//       const { data } = remoteMessage;
//       console.log('📩 Foreground FCM:', data);

//       if (data?.type === 'incoming_call') {
//         navigation.navigate('IncomingCall', {
//           callId:     data.callId,
//           roomId:     data.roomId,
//           callerName: data.callerName,
//           callerId:   data.callerId,
//         });
//       }
//     });
//   }

//   // ─────────────────────────────────────────────
//   // BACKGROUND / QUIT → notification tap handler
//   // Call this ONCE after navigation is ready (App.js)
//   // ─────────────────────────────────────────────
//   setupNotificationOpenHandlers(navigation) {
//     // App was in background, user tapped notification
//     messaging().onNotificationOpenedApp((remoteMessage) => {
//       const { data } = remoteMessage;
//       if (data?.type === 'incoming_call') {
//         navigation.navigate('IncomingCall', {
//           callId:     data.callId,
//           roomId:     data.roomId,
//           callerName: data.callerName,
//           callerId:   data.callerId,
//         });
//       }
//     });

//     // App was fully quit, user tapped notification
//     messaging().getInitialNotification().then((remoteMessage) => {
//       if (!remoteMessage) return;
//       const { data } = remoteMessage;
//       if (data?.type === 'incoming_call') {
//         navigation.navigate('IncomingCall', {
//           callId:     data.callId,
//           roomId:     data.roomId,
//           callerName: data.callerName,
//           callerId:   data.callerId,
//         });
//       }
//     });
//   }

//   // ─────────────────────────────────────────────
//   // INIT — call once in App.js when nav is ready
//   // ─────────────────────────────────────────────
//   async initialize(userId, navigation) {
//     const permitted = await this.requestPermission();
//     if (!permitted) {
//       console.warn('Notification permission denied');
//       return null;
//     }

//     const token = await this.getFCMToken();
//     if (token) await this.sendTokenToBackend(userId, token);

//     // Refresh token listener
//     messaging().onTokenRefresh((newToken) =>
//       this.sendTokenToBackend(userId, newToken)
//     );

//     this.setupNotificationOpenHandlers(navigation);
//     const unsubscribeForeground = this.setupForegroundHandler(navigation);
//     return unsubscribeForeground; // caller should invoke this on cleanup
//   }
// }

// export default new NotificationService();
// services/NotificationService.js
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import SocketManager from './SocketManager';

class NotificationService {
  socketIncomingUnsubscribe = null;

  // ─────────────────────────────────────────────
  // PERMISSION
  // ─────────────────────────────────────────────
  async requestPermission() {
    if (Platform.OS === 'android') return true;

    const status = await messaging().requestPermission();
    return (
      status === messaging.AuthorizationStatus.AUTHORIZED ||
      status === messaging.AuthorizationStatus.PROVISIONAL
    );
  }

  // ─────────────────────────────────────────────
  // TOKEN
  // ─────────────────────────────────────────────
  async getFCMToken() {
    try {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }
      return await messaging().getToken();
    } catch (e) {
      console.error('FCM token error:', e);
      return null;
    }
  }

  // ─────────────────────────────────────────────
  // SEND TOKEN VIA SOCKET (FIXED)
  // ─────────────────────────────────────────────
  sendTokenToBackend(userId, token) {
    if (!SocketManager.isConnected()) {
      console.log('❌ Socket not connected, cannot send FCM token');
      return;
    }

    SocketManager.socket.emit('register_user', {
      userId: String(userId),
      fcmToken: token,
    });

    console.log('✅ FCM token sent via socket');
  }

  // ─────────────────────────────────────────────
  // FOREGROUND HANDLER
  // ─────────────────────────────────────────────
  setupForegroundHandler(navigation) {
    return messaging().onMessage(async (remoteMessage) => {
      const { data } = remoteMessage;
      console.log('📩 Foreground FCM:', data);

      if (data?.type === 'call' || data?.type === 'incoming_call') {
        navigation.navigate('IncomingCall', {
          callId:     data.callId,
          roomId:     data.roomId,
          callerId:   data.fromUserId ?? data.callerId,
          callerName: data.callerName,
        });
      }
    });
  }

  // ─────────────────────────────────────────────
  // SOCKET INCOMING CALL HANDLER (fallback)
  // ─────────────────────────────────────────────
  setupSocketIncomingHandler(navigation) {
    const handler = (payload = {}) => {
      console.log('📞 Incoming socket call:', payload);
      navigation.navigate('IncomingCall', {
        callId: payload.callId,
        roomId: payload.roomId,
        callerId: payload.fromUserId ?? payload.callerId,
        callerName: payload.callerName,
      });
    };

    SocketManager.onIncomingCall(handler);
    this.socketIncomingUnsubscribe = () => SocketManager.off('incoming_call');
  }

  // ─────────────────────────────────────────────
  // BACKGROUND / QUIT HANDLER
  // ─────────────────────────────────────────────
  setupNotificationOpenHandlers(navigation) {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      const { data } = remoteMessage;
      if (data?.type === 'call' || data?.type === 'incoming_call') {
        navigation.navigate('IncomingCall', {
          callId:     data.callId,
          roomId:     data.roomId,
          callerId:   data.fromUserId ?? data.callerId,
          callerName: data.callerName,
        });
      }
    });

    messaging().getInitialNotification().then((remoteMessage) => {
      if (!remoteMessage) return;

      const { data } = remoteMessage;
      if (data?.type === 'call' || data?.type === 'incoming_call') {
        navigation.navigate('IncomingCall', {
          callId:     data.callId,
          roomId:     data.roomId,
          callerId:   data.fromUserId ?? data.callerId,
          callerName: data.callerName,
        });
      }
    });
  }

  // ─────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────
  async initialize(userId, navigation) {
    const permitted = await this.requestPermission();
    if (!permitted) {
      console.warn('Notification permission denied');
      return null;
    }

    const token = await this.getFCMToken();

    // 🔥 IMPORTANT: connect socket first, then send token
    SocketManager.connect(userId, token);

    if (token) {
      this.sendTokenToBackend(userId, token);
    }

    // Token refresh
    messaging().onTokenRefresh((newToken) => {
      this.sendTokenToBackend(userId, newToken);
    });

    this.setupNotificationOpenHandlers(navigation);
    this.setupSocketIncomingHandler(navigation);
    const unsubscribeForeground = this.setupForegroundHandler(navigation);

    return () => {
      unsubscribeForeground?.();
      this.socketIncomingUnsubscribe?.();
    };
  }
}

export default new NotificationService();