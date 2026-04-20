import React, { useEffect, useCallback } from 'react';
import { View, PermissionsAndroid, StyleSheet } from 'react-native';
import { JitsiMeeting } from '@jitsi/react-native-sdk';

const MeetingScreen = ({ route, navigation }) => {
  const { roomId, userName } = route.params || {};

  ////////////////////////////////////////////////////////
  // 🎥 PERMISSIONS
  ////////////////////////////////////////////////////////
  useEffect(() => {
    const getPermissions = async () => {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
    };

    getPermissions();
  }, []);

  ////////////////////////////////////////////////////////
  // ❌ CLOSE MEETING
  ////////////////////////////////////////////////////////
const onReadyToClose = useCallback(() => {
  navigation.goBack();
}, [navigation]);
  ////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////
  return (
    <View style={styles.container}>
      <JitsiMeeting
        room={roomId || "test123"}
        serverURL="https://meet.jit.si/"
        style={styles.meeting}
        config={{
          disableThirdPartyRequests: true,
          analytics: { disabled: true },
        }}
        flags={{
          'prejoinpage.enabled': false,
          'pip.enabled': false,
        }}
        userInfo={{
          displayName: userName || 'User',
        }}
        eventListeners={{
          onReadyToClose,
        }}
      />
    </View>
  );
};

export default MeetingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  meeting: {
    flex: 1,
  },
});