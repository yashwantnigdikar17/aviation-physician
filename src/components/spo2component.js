import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// SVGs
import SpO2Chart from "../assets/Images/vitalchartspo2.svg";
import HeartRateChart from "../assets/Images/vitalchartheartrate.svg";
import BPChart from "../assets/Images/vitalchartbp.svg";
import ExclaimIcon from "../assets/Images/exclaimation.svg";
import Clock from "../assets/Images/clock.svg";
// import { theme } from "../theme/theme";
import { useTheme } from "../theme/ThemeContext";

const SpO2Card = ({ patientInfo = null, onClose, showTitle = true }) => {
  const { theme, dark } = useTheme();
  const hasPatient = patientInfo && Object.keys(patientInfo).length > 0;
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingTop: insets.top + 50, // 👈 dynamic, correct
        },
        {
          backgroundColor: theme?.spo2Bg,
        },
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          {showTitle && (
            <Text style={[styles.title, { color: theme.spo2Text }]}>
              Vitals Trend
            </Text>
          )}

          {/* ✅ SHOW ONLY IF DATA EXISTS */}
          {hasPatient && (
            <>
              <Text style={[styles.name, { color: theme.spo2Text }]}>
                {patientInfo.name}, {patientInfo.age}
              </Text>

              <Text style={[styles.flight, { color: theme.spo2SubText }]}>
                Flight {patientInfo.flight} ({patientInfo.route})
              </Text>
            </>
          )}
        </View>

        {/* CLOSE ICON */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={[styles.close, { color: theme.spo2Text }]}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <View style={styles.container}>
        <View style={styles.card}>
          <SpO2Chart width="100%" height="100%" preserveAspectRatio="none" />
        </View>

        <View style={styles.card}>
          <HeartRateChart
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          />
        </View>

        <View style={styles.card}>
          <BPChart width="100%" height="95%" preserveAspectRatio="none" />
        </View>

        {/* ALERT */}
        <View style={styles.alertBox}>
          <View style={styles.alertIconWrapper}>
            <ExclaimIcon width={16} height={16} fill="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>
              SpO₂ &lt; 90% - Critical threshold
            </Text>

            <Text style={styles.alertText}>
              <Text style={{ fontWeight: "700" }}>Recommendation: </Text>
              Increase oxygen 6–8 L/min NRM. Prepare AED.
            </Text>
          </View>
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.reminderBtn}>
          <Clock width={16} height={16} />
          <Text style={styles.reminderText}>Set Reminder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SpO2Card;

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    //    backgroundColor: theme?.spo2Bg,
    // color: theme?.spo2Text,
    //  marginTop:30,
    // paddingTop: 50, // space for status bar (adjust if needed)
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // HEADER
  header: {
    marginBottom: 10,
    paddingRight: 30, // space for close icon
    marginTop: -20,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
    color: "#111",
  },

  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
  },

  flight: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },

  closeBtn: {
    position: "absolute",
    right: 0,
    top: -8, // aligns between name & flight visually
    padding: 4,
  },

  close: {
    fontSize: 14,
    color: "#111",
  },

  // CONTENT
  container: {
    gap: 10,
  },

  // SVG CARDS
  card: {
    width: "100%",
    height: 130,
    // backgroundColor: "#E9EEF5",
    borderRadius: 14,
    overflow: "hidden",
  },

  // ALERT
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EED3D3",
    borderRadius: 16,
    padding: 10,
    gap: 10,
  },

  alertIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },

  alertTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },

  alertText: {
    fontSize: 11,
    color: "#4B5563",
    lineHeight: 16,
  },

  // BUTTON
  reminderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#38A169",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop:10,
    gap: 8,
  },

  reminderText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
