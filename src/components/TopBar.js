// // components/TopBar.js
// import React, { useState } from "react";
// import SocketManager from "../services/SocketManager";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   StatusBar,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { useNavigation } from "@react-navigation/native";
// import NotificationPanel from "../components/NotificationPanel";
// import { useTheme } from "../theme/ThemeContext"; // adjust path as needed
// import { lightTheme } from "../theme/theme"; // adjust path as needed
// import SyncSvg from "../assets/Images/refresh.svg";

// // ─── Helper ───────────────────────────────────────────────────────────────────
// function useTopInset() {
//   try {
//     const insets = useSafeAreaInsets();
//     return insets.top;
//   } catch {
//     return Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 44;
//   }
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // DetailedTopBar  →  All screens
// //
// //  TOP STRIP
// //    [✅ Device Connected]   🔄 Last synced Today 12:00 PM
// //
// //  MAIN ROW
// //    John Smith, 58 M                    [▶ Join Now] [🔔]
// //    Flight AA1234, SYD → LAX
// // ─────────────────────────────────────────────────────────────────────────────
// export function DetailedTopBar({
//   navigation,
//   showNotification = true,
//   onNotification,
//   notifications,
//   deviceConnected = true,
//   syncTime = "Today 12:00 PM",
//   patientName = "John Smith, 58 M",
//   flight = "Flight AA1234, SYD → LAX",
// }) {
//   const topInset = useTopInset();
//   const navigationHook = useNavigation();
//   const [panelVisible, setPanelVisible] = useState(false);

//   // ── Theme ─────────────────────────────────────────────────────────────────
//   // useTheme() returns { theme, dark, toggleTheme } from ThemeContext.
//   // Fallback to lightTheme if context is not available (safety guard).
//   const themeCtx = useTheme();
//   const t = themeCtx?.theme ?? lightTheme;
//   const dark = themeCtx?.dark ?? false;

//   const handleNotification = () => {
//     if (onNotification) onNotification();
//     else setPanelVisible(true);
//   };

//   // ── Resolved badge colors ─────────────────────────────────────────────────
//   const deviceBadgeBg = deviceConnected
//     ? t.tbDeviceBadgeBg
//     : t.tbDeviceBadgeOffBg;
//   const deviceBadgeBorder = deviceConnected
//     ? t.tbDeviceBadgeBorder
//     : t.tbDeviceBadgeOffBorder;
//   const deviceIconColor = deviceConnected
//     ? t.tbDeviceIconColor
//     : t.tbDeviceIconOff;
//   const deviceTextColor = deviceConnected ? t.tbDeviceText : t.tbDeviceTextOff;

//   // Sync row: subtle pill in light mode, plain icon+text in dark (matches screenshot)
//   const syncHasPill = !dark;

//   return (
//     <>
//       <View
//         style={[
//           styles.container,
//           {
//             backgroundColor: t.tbContainerBg,
//             paddingTop: topInset + 6,
//           },
//         ]}
//       >
//         {/* ───────── TOP STRIP ───────── */}
//         <View style={styles.topStrip}>
//           {/* Device badge — always a pill */}
//           <View
//             style={[
//               styles.deviceBadge,
//               {
//                 backgroundColor: deviceBadgeBg,
//                 borderColor: deviceBadgeBorder,
//               },
//             ]}
//           >
//             <MaterialIcons
//               name={deviceConnected ? "check-circle" : "cancel"}
//               size={15}
//               color={deviceIconColor}
//             />
//             <Text style={[styles.deviceText, { color: deviceTextColor }]}>
//               {deviceConnected ? "Device Connected" : "Not Connected"}
//             </Text>
//           </View>

//           {/* Sync row — pill in light, plain in dark */}
//           <View
//             style={[
//               styles.syncRow,
//               syncHasPill && {
//                 backgroundColor: t.tbSyncRowBg,
//                 borderWidth: 1,
//                 borderColor: t.tbSyncRowBorder,
//                 borderRadius: 20,
//                 paddingHorizontal: 10,
//                 paddingVertical: 4,
//               },
//             ]}
//           >
//             <SyncSvg width={14} height={14} color={t.tbSyncIcon} />
//             <Text style={[styles.syncText, { color: t.tbSyncText }]}>
//               Last synced {syncTime}
//             </Text>
//           </View>
//         </View>

//         {/* ───────── MAIN ROW ───────── */}
//         <View style={styles.mainRow}>
//           {/* LEFT: Patient info */}
//           <View style={styles.patientInfo}>
//             <Text style={[styles.patientName, { color: t.tbPatientName }]}>
//               {patientName}
//             </Text>
//             <Text style={[styles.flightText, { color: t.tbFlightText }]}>
//               {flight}
//             </Text>
//           </View>

//           {/* RIGHT: Action buttons */}
//           <View style={styles.actions}>
//             {/* CHAT BUTTON */}
//             <TouchableOpacity
//               style={[
//                 styles.chatBtn,
//                 { backgroundColor: t.tbChatBtnBg || "#1E293B" },
//               ]}
//               activeOpacity={0.82}
//               onPress={() => navigationHook.navigate("Chat")}
//             >
//               <MaterialIcons
//                 name="chat-bubble-outline"
//                 size={16}
//                 color="#FFFFFF"
//               />
//               <Text style={styles.chatText}>Chat</Text>
//             </TouchableOpacity>
//             {/* JOIN NOW */}
//             <TouchableOpacity
//               style={[styles.joinBtn, { backgroundColor: t.tbJoinBtnBg }]}
//               activeOpacity={0.82}
//               onPress={() => {
//                 if (!SocketManager.isConnected()) {
//                   console.log("❌ Socket not connected");
//                   return;
//                 }

//                 const roomId = "room_" + Date.now();

//                 SocketManager.callUser({
//                   callerId: "doctor_001",
//                   callerName: "Dr. Sarah Johnson",
//                   receiverId: "nurse_001",
//                   roomId,
//                 });

//                 console.log("📞 Call initiated from TopBar");
//               }}
//             >
//               <MaterialIcons name="videocam" size={16} color="#FFFFFF" />
//               <Text style={styles.joinText}>Join Now</Text>
//             </TouchableOpacity>

//             {/* NOTIFICATION BELL */}
//             {showNotification && (
//               <TouchableOpacity
//                 style={[styles.bellBtn, { backgroundColor: t.tbBellBtnBg }]}
//                 activeOpacity={0.82}
//                 onPress={handleNotification}
//               >
//                 <MaterialIcons
//                   name="notifications-none"
//                   size={20}
//                   color="#FFFFFF"
//                 />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </View>

//       <NotificationPanel
//         visible={panelVisible}
//         onClose={() => setPanelVisible(false)}
//         notifications={notifications}
//       />
//     </>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // Static styles — layout & shape only.
// // All colors injected inline from theme tokens above.
// // ─────────────────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//   },

//   // ── Top strip ──────────────────────────────────────────────────────────────
//   topStrip: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     marginTop: 4,
//     marginBottom: 10,
//   },

//   deviceBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 100,
//     paddingVertical: 5,
//     paddingHorizontal: 14,
//     borderWidth: 1,
//     gap: 6,
//   },
//   deviceText: {
//     fontSize: 12,
//     fontWeight: "400",
//   },

//   syncRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//   },
//   syncText: {
//     fontSize: 12,
//     fontWeight: "500",
//   },

//   chatBtn: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   borderRadius: 10,
//   paddingHorizontal: 14,
//   paddingVertical: 9,
//   gap: 6,
// },

// chatText: {
//   color: '#FFFFFF',
//   fontSize: 13,
//   fontWeight: '600',
// },
//   // ── Main row ───────────────────────────────────────────────────────────────
//   mainRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },

//   patientInfo: {
//     flex: 1,
//     marginRight: 12,
//   },
//   patientName: {
//     fontSize: 17,
//     fontWeight: "700",
//     letterSpacing: 0.1,
//   },
//   flightText: {
//     fontSize: 12,
//     marginTop: 2,
//   },

//   // ── Action buttons ─────────────────────────────────────────────────────────
//   actions: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },

//   joinBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 9,
//     gap: 6,
//   },
//   joinText: {
//     color: "#FFFFFF",
//     fontSize: 13,
//     fontWeight: "600",
//   },

//   bellBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
// components/TopBar.js
// components/TopBar.js
// components/TopBar.js
import React, { useState } from "react";
import SocketManager from "../services/SocketManager";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import NotificationPanel from "../components/NotificationPanel";

import { useTheme } from "../theme/ThemeContext";
import { lightTheme } from "../theme/theme";
import BellIcon from "../assets/Images/bellsvg"
import SyncSvg from "../assets/Images/refresh.svg";

import Svg, { Path, Rect } from "react-native-svg";

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICONS
// ─────────────────────────────────────────────────────────────────────────────

const DeviceConnectedIcon = ({ size = 15, color = "#22C55E" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17L4 12"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const DeviceDisconnectedIcon = ({ size = 15, color = "#EF4444" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <Path
      d="M6 6L18 18"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </Svg>
);

const ChatBubbleIcon = ({ size = 16, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const VideocamIcon = ({ size = 16, color = "#FFFFFF" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 7L16 12L23 17V7Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect
      x="1"
      y="5"
      width="15"
      height="14"
      rx="2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);


// ─────────────────────────────────────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────────────────────────────────────

function useTopInset() {
  try {
    const insets = useSafeAreaInsets();
    return insets.top;
  } catch {
    return Platform.OS === "android"
      ? (StatusBar.currentHeight ?? 24)
      : 44;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// TOP BAR
//
// Props:
//   onChatPress  {function}  — called when the Chat button is tapped.
//                             If not provided, falls back to navigating
//                             to "ChatScreen" (original behaviour).
// ─────────────────────────────────────────────────────────────────────────────

export function DetailedTopBar({
  navigation,
  showNotification = true,
  onNotification,
  notifications,
  deviceConnected = true,
  syncTime = "Today 12:00 PM",
  patientName = "John Smith, 58 M",
  flight = "Flight AA1234, SYD → LAX",
  // ── NEW: optional callback to open inline chat panel ──
  onChatPress,
}) {

  const topInset = useTopInset();
  const navigationHook = useNavigation();

  const [notifPanelVisible, setNotifPanelVisible] = useState(false);

  // ── Theme ────────────────────────────────────────────────────────────────
  const themeCtx = useTheme();
  const t = themeCtx?.theme ?? lightTheme;
  const dark = themeCtx?.dark ?? false;

  // ── Notification Handler ────────────────────────────────────────────────
  const handleNotification = () => {
    if (onNotification) onNotification();
    else setNotifPanelVisible(true);
  };

  // ── Chat Handler ────────────────────────────────────────────────────────
  // If a parent passes onChatPress (e.g. CaseDetailScreen toggling inline
  // chat), use it. Otherwise fall back to full-screen ChatScreen navigation.
  const handleChatPress = () => {
    if (onChatPress) {
      onChatPress();
    } else {
      navigationHook.navigate("ChatScreen");
    }
  };

  // ── Device Badge Colors ────────────────────────────────────────────────
  const deviceBadgeBg = deviceConnected
    ? t.tbDeviceBadgeBg
    : t.tbDeviceBadgeOffBg;

  const deviceBadgeBorder = deviceConnected
    ? t.tbDeviceBadgeBorder
    : t.tbDeviceBadgeOffBorder;

  const deviceIconColor = deviceConnected
    ? t.tbDeviceIconColor
    : t.tbDeviceIconOff;

  const deviceTextColor = deviceConnected
    ? t.tbDeviceText
    : t.tbDeviceTextOff;

  const syncHasPill = !dark;

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: t.tbContainerBg,
            paddingTop: topInset + 6,
          },
        ]}
      >

        {/* ───────── TOP STRIP ───────── */}
        <View style={styles.topStrip}>

          {/* DEVICE STATUS */}
          <View
            style={[
              styles.deviceBadge,
              {
                backgroundColor: deviceBadgeBg,
                borderColor: deviceBadgeBorder,
              },
            ]}
          >
            {deviceConnected ? (
              <DeviceConnectedIcon size={15} color={deviceIconColor} />
            ) : (
              <DeviceDisconnectedIcon size={15} color={deviceIconColor} />
            )}

            <Text style={[styles.deviceText, { color: deviceTextColor }]}>
              {deviceConnected ? "Device Connected" : "Not Connected"}
            </Text>
          </View>

          {/* SYNC STATUS */}
          <View
            style={[
              styles.syncRow,
              syncHasPill && {
                backgroundColor: t.tbSyncRowBg,
                borderWidth: 1,
                borderColor: t.tbSyncRowBorder,
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 4,
              },
            ]}
          >
            <SyncSvg width={14} height={14} color={t.tbSyncIcon} />
            <Text style={[styles.syncText, { color: t.tbSyncText }]}>
              Last synced {syncTime}
            </Text>
          </View>
        </View>

        {/* ───────── MAIN ROW ───────── */}
        <View style={styles.mainRow}>

          {/* LEFT SECTION */}
          <View style={styles.patientInfo}>
            <Text
              style={[styles.patientName, { color: t.tbPatientName }]}
              numberOfLines={1}
            >
              {patientName}
            </Text>

            <Text
              style={[styles.flightText, { color: t.tbFlightText }]}
              numberOfLines={1}
            >
              {flight}
            </Text>
          </View>

          {/* RIGHT ACTIONS */}
          <View style={styles.actions}>

            {/* CHAT BUTTON — calls handleChatPress */}
            <TouchableOpacity
              style={[
                styles.chatBtn,
                { backgroundColor: t.tbJoinBtnBg },
              ]}
              activeOpacity={0.82}
              onPress={handleChatPress}
            >
              <ChatBubbleIcon size={16} color="#FFFFFF" />
              <Text style={styles.chatText}>Chat</Text>
            </TouchableOpacity>

            {/* JOIN NOW */}
            <TouchableOpacity
              style={[
                styles.joinBtn,
                { backgroundColor: t.tbJoinBtnBg },
              ]}
              activeOpacity={0.82}
              onPress={() => {
                if (!SocketManager.isConnected()) {
                  console.log("❌ Socket not connected");
                  return;
                }

                const roomId = "room_" + Date.now();

                SocketManager.callUser({
                  callerId: "doctor_001",
                  callerName: "Dr. Sarah Johnson",
                  receiverId: "nurse_001",
                  roomId,
                });

                console.log("📞 Call initiated from TopBar");
              }}
            >
              <VideocamIcon size={16} color="#FFFFFF" />
              <Text style={styles.joinText}>Join Now</Text>
            </TouchableOpacity>

            {/* NOTIFICATION */}
            {showNotification && (
              <TouchableOpacity
                style={[
                  styles.bellBtn,
                  { backgroundColor: t.tbBellBtnBg },
                ]}
                activeOpacity={0.82}
                onPress={handleNotification}
              >
                <BellIcon size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}

          </View>
        </View>
      </View>

      {/* NOTIFICATION PANEL */}
      <NotificationPanel
        visible={notifPanelVisible}
        onClose={() => setNotifPanelVisible(false)}
        notifications={notifications}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({

  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  // TOP STRIP
  topStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    marginBottom: 10,
  },

  deviceBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderWidth: 1,
    gap: 6,
  },

  deviceText: {
    fontSize: 12,
    fontWeight: "400",
  },

  syncRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  syncText: {
    fontSize: 12,
    fontWeight: "500",
  },

  // MAIN ROW
  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    
  },

  patientInfo: {
    flex: 1,
    marginRight: 12,
  },

  patientName: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.1,
    
  },

  flightText: {
    fontSize: 12,
    marginTop: 2,
  },

  // ACTION BUTTONS
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    
  },

  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 6,
  },

  chatText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  joinBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 6,
    
  },

  joinText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    
  },
});