// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import  LoginScreen  from './src/screens/LoginScreen';
// import Alleventsscreen from './src/screens/Alleventsscreen';

// import { ThemeProvider } from './src/theme/ThemeContext'; // ← ADD THIS
// import MeetingScreen from './src/screens/MeetingScreen';
// import CaseDetailScreen from './src/screens/CaseDetailScreen';
// import SearchKitScreen from './src/screens/SearchKitScreen'
// import ECGScreen from './src/screens/ECGScreen';
// import EventsScreenTable from './src/screens/EventsScreenTable';
// import CaseOutcomeScreen from './src/screens/CaseOutcomeScreen';






// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//         <ThemeProvider>
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Login"
//         screenOptions={{ headerShown: false, animation: 'fade' }}
//       >
//       <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="AllEvent" component={Alleventsscreen} />

       
      
//         <Stack.Screen name="Meeting" component={MeetingScreen} />
         
//         <Stack.Screen name="CaseDetail" component={CaseDetailScreen} />

//         <Stack.Screen name="SearchKit" component={SearchKitScreen} />

//         <Stack.Screen name="ECGScreen" component={ECGScreen} />
        
//         <Stack.Screen name="EventsScreenTable" component={EventsScreenTable} />

//         <Stack.Screen name="CaseOutcomeScreen" component={CaseOutcomeScreen} />

//       </Stack.Navigator>
//       </NavigationContainer>
//          </ThemeProvider>
//   );
// }

// App.js
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Existing screens ──────────────────────────────────────────────
import LoginScreen        from './src/screens/LoginScreen';
import Alleventsscreen    from './src/screens/Alleventsscreen';
import MeetingScreen      from './src/screens/MeetingScreen';
import CaseDetailScreen   from './src/screens/CaseDetailScreen';
import SearchKitScreen    from './src/screens/SearchKitScreen';
import ECGScreen          from './src/screens/ECGScreen';
import EventsScreenTable  from './src/screens/EventsScreenTable';
import CaseOutcomeScreen  from './src/screens/CaseOutcomeScreen';
import ChatScreen from "./src/components/ChatPanel";
// ── New screens ───────────────────────────────────────────────────
import IncomingCallScreen from './src/screens/IncomingCallScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// ── Services ──────────────────────────────────────────────────────
import NotificationService from './src/services/NotificationService';
import SocketManager       from './src/services/SocketManager';

// ── Theme ─────────────────────────────────────────────────────────
import { ThemeProvider } from './src/theme/ThemeContext';

// ─────────────────────────────────────────────
// CONSTANTS — replace with your real auth system
// ─────────────────────────────────────────────
const CURRENT_USER_ID   = 'nurse_001';   // pull from auth context / login response
const PENDING_CALL_KEY  = 'PENDING_MEETING_ROOM';

const Stack = createNativeStackNavigator();

export default function App() {
  const navigationRef = useRef(null);

  // ─────────────────────────────────────────────
  // INIT — runs once after navigation is ready
  // ─────────────────────────────────────────────
  useEffect(() => {
    // Small delay so NavigationContainer is fully mounted
    const timer = setTimeout(async () => {
      if (!navigationRef.current) return;

      // 1. Connect socket (nurse/receiver side)
      // SocketManager.connect(CURRENT_USER_ID);

      // // 2. Init FCM — registers token, sets up foreground + background-open handlers
      // const unsubscribeFCM = await NotificationService.initialize(
      //   CURRENT_USER_ID,
      //   navigationRef.current
      // );

      // 3. If user accepted a call via notification while app was killed,
      //    AsyncStorage holds the roomId — navigate them straight into the meeting
      const pendingRoom = await AsyncStorage.getItem(PENDING_CALL_KEY);
      if (pendingRoom) {
        await AsyncStorage.removeItem(PENDING_CALL_KEY);
        navigationRef.current.navigate('Meeting', {
          roomId:   pendingRoom,
          userName: 'Julia (Crew)',   // replace with real logged-in name
          userRole: 'crew',
        });
      }

      // Cleanup on unmount
      // return () => {
      //   unsubscribeFCM?.();
      //   SocketManager.disconnect();
      // };
    }
      , 1000);

    return () => clearTimeout(timer);
  }, []);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <SafeAreaProvider>
    <ThemeProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false, animation: 'fade' }}
        >
          {/* ── Existing screens — unchanged ── */}
          <Stack.Screen name="Login"             component={LoginScreen} />
          <Stack.Screen name="AllEvent"          component={Alleventsscreen} />
          <Stack.Screen name="Meeting"           component={MeetingScreen} />
          <Stack.Screen name="CaseDetail"        component={CaseDetailScreen} />
          <Stack.Screen name="SearchKit"         component={SearchKitScreen} />
          <Stack.Screen name="ECGScreen"         component={ECGScreen} />
          <Stack.Screen name="EventsScreenTable" component={EventsScreenTable} />
          <Stack.Screen name="CaseOutcomeScreen" component={CaseOutcomeScreen} />
          <Stack.Screen
  name="ChatScreen"
  component={ChatScreen}
/>
          {/* ── New: full-screen modal shown when a call comes in ── */}
          <Stack.Screen
            name="IncomingCall"
            component={IncomingCallScreen}
            options={{ presentation: 'fullScreenModal', animation: 'fade' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </ThemeProvider>
      </SafeAreaProvider>
  );
}