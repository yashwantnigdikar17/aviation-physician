import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";

// ✅ Your SVG
import ExclaimIcon from "../assets/Images/exclaimation.svg";

const NotificationPanel = ({ visible, onClose, theme }) => {
  const [todayAlerts, setTodayAlerts] = useState([
    { id: 1, title: "Alert Headline", desc: "Description. Lorem ipsum dolor sit amet." },
    { id: 2, title: "Alert Headline", desc: "Description. Lorem ipsum dolor sit amet." },
    { id: 3, title: "Alert Headline", desc: "Description. Lorem ipsum dolor sit amet." },
  ]);

  const [pastAlerts, setPastAlerts] = useState([
    { id: 4, title: "Alert Headline", desc: "Description. Lorem ipsum dolor sit amet." },
    { id: 5, title: "Alert Headline", desc: "Description. Lorem ipsum dolor sit amet." },
    { id: 6, title: "Alert Headline", desc: "Description. Lorem ipsum dolor sit amet." },
  ]);

  if (!visible) return null;

  const removeTodayAlert = (id) => {
    setTodayAlerts((prev) => prev.filter((item) => item.id !== id));
  };

  const removePastAlert = (id) => {
    setPastAlerts((prev) => prev.filter((item) => item.id !== id));
  };

  const styles = makeStyles(theme);

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlayBackdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.panel}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Notification</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* TODAY BADGE */}
          <View style={styles.todayBadge}>
            <Text style={styles.todayText}>TODAY</Text>
          </View>

          {/* TODAY ALERT LIST */}
          <View style={{ gap: 12 }}>
            {todayAlerts.map((item) => (
              <View key={item.id} style={styles.alertCard}>
                {/* LEFT ICON */}
                <View style={styles.iconWrapper}>
                  <ExclaimIcon width={14} height={14} fill="#fff" />
                </View>

                {/* TEXT */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertTitle}>{item.title}</Text>
                  <Text style={styles.alertDesc}>{item.desc}</Text>
                </View>

                {/* RIGHT CLOSE */}
                <TouchableOpacity onPress={() => removeTodayAlert(item.id)}>
                  <Text style={styles.cardClose}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* 12 MARCH 2026 BADGE */}
          <View style={styles.todayBadge}>
            <Text style={styles.todayText}>12 MARCH 2026</Text>
          </View>

          {/* PAST ALERT LIST */}
          <View style={{ gap: 12 }}>
            {pastAlerts.map((item) => (
              <View key={item.id} style={styles.alertCard}>
                {/* LEFT ICON */}
                <View style={styles.iconWrapper}>
                  <ExclaimIcon width={14} height={14} fill="#fff" />
                </View>

                {/* TEXT */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.alertTitle}>{item.title}</Text>
                  <Text style={styles.alertDesc}>{item.desc}</Text>
                </View>

                {/* RIGHT CLOSE */}
                <TouchableOpacity onPress={() => removePastAlert(item.id)}>
                  <Text style={styles.cardClose}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default NotificationPanel;

// ─────────────────────────────────────────────
// DYNAMIC STYLES
// ─────────────────────────────────────────────
const makeStyles = (theme) =>
  StyleSheet.create({
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: "row",
      zIndex: 3000,
    },

    overlayBackdrop: {
      flex: 1,
      backgroundColor: theme.npOverlayBg,
    },

    panel: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: 320,
      backgroundColor: theme.npPanelBg,
      padding: 16,
      borderLeftWidth: 1,
      borderLeftColor: theme.npBorderColor,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },

    title: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.npTitleColor,
    },

    close: {
      fontSize: 18,
      color: theme.npCloseColor,
    },

    // ALERT CARD
    alertCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.npAlertCardBg,
      borderRadius: 14,
      padding: 12,
      gap: 10,
    },

    // RED CIRCLE
    iconWrapper: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: "#FF616D",
      alignItems: "center",
      justifyContent: "center",
    },

    todayBadge: {
      alignSelf: "flex-start",
      backgroundColor: theme.npBadgeBg,
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 8,
      paddingRight: 8,
      borderRadius: 12,
      marginTop: 10,
      marginBottom: 10,
    },

    todayText: {
      fontSize: 10,
      fontWeight: "600",
      color: theme.npBadgeText,
    },

    alertTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.npAlertTitleColor,
      marginBottom: 2,
    },

    alertDesc: {
      fontSize: 11,
      color: theme.npAlertDescColor,
    },

    cardClose: {
      fontSize: 14,
      color: theme.npCardCloseColor,
      paddingLeft: 6,
    },
  });