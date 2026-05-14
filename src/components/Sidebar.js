// components/Sidebar.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TiaAIChat from "./TiaAIChat";
import NotificationPanel from "./NotificationPanel";
import { useTheme } from "../theme/ThemeContext"; // ✅ USE CONTEXT
import { lightTheme } from "../theme/theme";       // ✅ fallback only

const NAV_ITEMS = [
  { key: "allEvents", label: "All Events", icon: "event-note",    screen: "EventsScreenTable" },
  { key: "searchKit", label: "Search Kit", icon: "link",          screen: "SearchKit" },
  { key: "tiaAI",    label: "Tia AI",     icon: "auto-awesome",  screen: "TiaAI" },
  { key: "faqs",     label: "FAQs",       icon: "help-outline",  screen: "FAQs" },
];

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({ activeKey, navigation }) => {
  // ✅ All theme data comes from context — no props needed
  const themeCtx    = useTheme();
  const t           = themeCtx?.theme       ?? lightTheme;
  const isDark      = themeCtx?.dark        ?? false;
  const toggleTheme = themeCtx?.toggleTheme ?? (() => {});

  const [showTiaAI, setShowTiaAI]           = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      {/* SIDEBAR */}
      <View style={[styles.sidebar, { backgroundColor: t.bg, borderRightColor: t.border }]}>

        {/* LOGO */}
        <View style={styles.logoArea}>
          <Image
            source={require("../assets/Images/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={[styles.logoText, { color: t.logoText }]}>TiaTELE</Text>
        </View>

        {/* NAV ITEMS */}
        <View style={styles.navList}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.navItem,
                  isActive && {
                    backgroundColor: t.activeItemBg,
                    borderRightColor: t.activeBar,
                    borderRightWidth: 3,
                  },
                ]}
                activeOpacity={0.75}
                onPress={() => {
                  if (item.screen === "EventsScreenTable") navigation.navigate("EventsScreenTable");
                  else if (item.screen === "SearchKit")    navigation.navigate("SearchKit");
                  else if (item.screen === "TiaAI")        setShowTiaAI(true);
                  else alert(`${item.label} screen coming soon`);
                }}
              >
                <MaterialIcons
                  name={item.icon}
                  size={18}
                  color={isActive ? t.iconActive : t.iconInactive}
                />
                <Text style={[
                  styles.navLabel,
                  { color: isActive ? t.labelActive : t.labelInactive },
                  isActive && styles.navLabelActive,
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* NOTIFICATION */}
        <TouchableOpacity style={styles.notificationBtn} onPress={() => setShowNotifications(true)}>
          <MaterialIcons name="notifications-none" size={20} color={t.notifIcon} />
        </TouchableOpacity>

        {/* THEME TOGGLE */}
        <View style={styles.toggleSection}>
          <MaterialCommunityIcons name="white-balance-sunny" size={13} color={t.toggleSunColor} />

          {/* ✅ Calls context toggleTheme directly */}
          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.85}
            style={[styles.toggleTrack, { backgroundColor: t.toggleTrackBg }]}
          >
            <View style={[
              styles.toggleThumb,
              {
                backgroundColor: t.toggleThumb,
                alignSelf: isDark ? "flex-end" : "flex-start",
              },
            ]} />
          </TouchableOpacity>

          <MaterialCommunityIcons name="moon-waning-crescent" size={13} color={t.toggleMoonColor} />
        </View>

        {/* LOGOUT */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: "Login" }] })}
          >
            <MaterialIcons name="logout" size={20} color={t.logoutIcon} />
            <Text style={[styles.logoutText, { color: t.logoutText }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CHAT + NOTIFICATION OVERLAYS */}
      <View style={styles.chatOverlay} pointerEvents="box-none">
        <TiaAIChat
          visible={showTiaAI}
          onClose={() => setShowTiaAI(false)}
          theme={t}
        />
        <NotificationPanel
          visible={showNotifications}
          onClose={() => setShowNotifications(false)}
          theme={t}
        />
      </View>
    </>
  );
};

export default Sidebar;

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  sidebar: {
    width: 80,
    borderRightWidth: 1,
    alignItems: "center",
    paddingTop: 12,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 12,
  },
  logoImage: {
    width: 90,
    height: 70,
  },
  logoText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  notificationBtn: {
    marginBottom: 10,
    padding: 6,
    borderRadius: 10,
  },
  navList: {
    width: "100%",
    alignItems: "center",
    gap: 4,
  },
  navItem: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 4,
  },
  navLabelActive: {
    fontWeight: "700",
  },
  navLabel: {
    fontSize: 8,
    fontWeight: "500",
    textAlign: "center",
  },
  toggleSection: {
    marginTop: 16,
    alignItems: "center",
    gap: 6,
  },
  toggleTrack: {
    width: 36,
    height: 20,
    borderRadius: 10,
    padding: 2,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  bottomSection: {
    marginTop: "auto",
    marginBottom: 20,
    alignItems: "center",
  },
  logoutBtn: {
    alignItems: "center",
    paddingVertical: 10,
    gap: 4,
  },
  logoutText: {
    fontSize: 10,
    fontWeight: "600",
  },
  chatOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});