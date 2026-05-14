// screens/IncomingCallScreen.js
import React, { useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Animated,
  Easing,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SocketManager from '../services/SocketManager';

// ─── This is YOUR userId on the receiver/crew app ───
const MY_USER_ID = 'nurse_001'; // pull from auth context in real app

const VIBRATE_PATTERN = [400, 400, 400, 400, 400, 400];

export default function IncomingCallScreen({ route, navigation }) {
  const { callId, roomId, callerName, callerId } = route.params || {};

  // Pulsing ring animation
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start vibration
    Vibration.vibrate(VIBRATE_PATTERN, true);

    // Pulse animation
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.18,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();

    // If caller cancels while we're ringing
    SocketManager.onCallCancelled(() => {
      Vibration.cancel();
      anim.stop();
      navigation.goBack();
    });

    // If call ends from the other side
    SocketManager.onCallEnded(() => {
      Vibration.cancel();
      anim.stop();
      navigation.goBack();
    });

    return () => {
      Vibration.cancel();
      anim.stop();
      SocketManager.off('call_cancelled');
      SocketManager.off('call_ended');
    };
  }, []);

  // ─────────────────────────────────────────────
  // ACCEPT
  // ─────────────────────────────────────────────
  const handleAccept = useCallback(() => {
    Vibration.cancel();
    SocketManager.acceptCall({ callId, roomId, callerId });
    navigation.replace('Meeting', {
      roomId,
      userName: 'Julia (Crew)',
      userRole: 'crew',
    });
  }, [callId, roomId, callerId]);

  // ─────────────────────────────────────────────
  // REJECT
  // ─────────────────────────────────────────────
  const handleReject = useCallback(() => {
    Vibration.cancel();
    SocketManager.rejectCall({ callId, callerId });
    navigation.goBack();
  }, [callId, callerId]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        {/* Avatar with pulse ring */}
        <View style={styles.avatarSection}>
          <Animated.View
            style={[styles.pulseRing, { transform: [{ scale: pulse }] }]}
          />
          <View style={styles.avatar}>
            <MaterialIcons name="medical-services" size={38} color="#60A5FA" />
          </View>
        </View>

        <Text style={styles.callerName}>{callerName ?? 'Doctor'}</Text>
        <Text style={styles.callType}>Incoming Video Call</Text>
        <Text style={styles.callSubtext}>Aeromedic Emergency Case</Text>

        {/* Action buttons */}
        <View style={styles.actions}>
          <View style={styles.actionItem}>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={handleReject}
              activeOpacity={0.8}
            >
              <MaterialIcons name="call-end" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>Decline</Text>
          </View>

          <View style={styles.actionItem}>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={handleAccept}
              activeOpacity={0.8}
            >
              <MaterialIcons name="videocam" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>Accept</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(5, 14, 31, 0.97)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 320,
    backgroundColor: '#0F2340',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#1E3A6A',
    alignItems: 'center',
    paddingVertical: 44,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.7,
    shadowRadius: 30,
    elevation: 20,
  },
  avatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: 110,
    height: 110,
  },
  pulseRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(59,130,246,0.18)',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  callerName: {
    color: '#F1F5F9',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  callType: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
  },
  callSubtext: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 40,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionItem: {
    alignItems: 'center',
    gap: 12,
  },
  rejectBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  acceptBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  actionLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
});