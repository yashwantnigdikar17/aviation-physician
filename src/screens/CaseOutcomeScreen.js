// screens/CaseOutcomeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "../theme/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Sidebar from "../components/Sidebar";
import NotificationPanel from "../components/NotificationPanel";
import VideoIcon from "../assets/Images/videoiconw";
import Bell from "../assets/Images/bellsvg.svg";
import Tick from "../assets/Images/whitetick.svg";
import Sync from "../assets/Images/refresh.svg"

//vital chart svg imports
import HeartRateG from "../assets/Images/greyheart.svg";
import VitalGrey from "../assets/Images/greyvital.svg"
import O2grey from "../assets/Images/greyO2.svg"
import LungsGrey from "../assets/Images/greylungs.svg";
import Greytemp from "../assets/Images/greytemp.svg";
import Greycolorpicker from "../assets/Images/greycolorpicker.svg";
import Greysweat from "../assets/Images/greysweat.svg";
import Greybell from "../assets/Images/greybell.svg";
import Greeneyesvg from "../assets/Images/greeneyesvg.svg";
import Redecggraph from "../assets/Images/redecggraph.svg";
import PainScore from "../assets/Images/painscore.svg";
import Glucose from "../assets/Images/Glucose.svg";
import AVPUscore from "../assets/Images/AVPU.svg" 
import BloodPressure from "../assets/Images/BloodPressure.svg" 
import ECGGraph from "../assets/Images/ECGGraph.svg"
// 🔥 Mapping object
const vitalIcons = {
  "Heart Rate": HeartRateG,
  "Blood Pressure": BloodPressure,
  "SpO2": O2grey,
  "Oxygen": O2grey,
  "Respiratory rate": LungsGrey,
  "Temperature": Greytemp,
  "Skin Colour": Greycolorpicker,
  "Sweating": Greysweat,
  "ECG": ECGGraph,
   "Pain Score": PainScore,
  "Blood Glucose": Glucose,
  "AVPU Score": AVPUscore,
  // "Default": VitalGrey,
};

// ─── Safe top inset helper ────────────────────────────────────
function useTopInset() {
  try {
    const insets = useSafeAreaInsets();
    return insets.top;
  } catch {
    return Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 44;
  }
}

// ─── TOP BAR (from TopBar.js — DetailedTopBar) ───────────────
function DetailedTopBar({
  navigation,
  showNotification = true,
  onNotification,
  deviceConnected = true,
  syncTime = "Today 12:00 PM",
  patientName = "John Smith, 58 M",
  flight = "Flight AA1234, SYD → LAX",
  // isDark = false,
}) {
  const topInset = useTopInset();
  const [panelVisible, setPanelVisible] = useState(false);
 
const themeCtx = useTheme();
  const isDark = themeCtx?.dark;
   const t = isDark ? darkBar : lightBar;
  return (
    <>
      <View
        style={[
          barStyles.container,
          { paddingTop: topInset, backgroundColor: t.bg, paddingBottom: 0 },
        ]}
      >
        {/* SINGLE ROW — Device badge · Sync badge · spacer · Join Now · Bell */}
        <View style={barStyles.topStrip}>
          {/* Device Connected */}
          <View
            style={[
              barStyles.deviceBadge,
              {
backgroundColor: isDark
  ? "#0B2A1E"
  : deviceConnected
  ? "#E8F5E9"
  : "#FFF3E0",

borderColor: isDark
  ? "#14532D"
  : deviceConnected
  ? "#A5D6A7"
  : "#FFCC80",
              },
            ]}
          >
          
            <View style={ s.whiteTick}>
              <Tick/>
            </View>
            <Text
              style={[
                barStyles.deviceText,
                { color: isDark
  ? "#4ADE80"
  : deviceConnected
  ? "#2E7D32"
  : "#E65100" },
              ]}
            >
              {deviceConnected ? "Device Connected" : "Not Connected"}
            </Text>
          </View>

          {/* Last Synced */}
          <View
            style={[
              barStyles.syncBadge,
              { backgroundColor: t.syncBg, borderColor: t.syncBorder },
            ]}
          >
          
            <View style={ s.syncIcon}>
              <Sync />

            </View>
            <Text style={[barStyles.syncText, { color: t.syncText }]}>
              Last synced {syncTime}
            </Text>
          </View>

          {/* Spacer pushes buttons to the right */}
          <View style={{ flex: 1 }} />

          {/* Join Now */}
          <TouchableOpacity
            style={barStyles.joinBtn}
            onPress={() =>
              navigation?.navigate("Meeting", {
                roomId: "test123",
                userName: "Doctor",
              })
            }
          >
            <VideoIcon width={20} height={20} />
            <Text style={barStyles.joinText}>Join Now</Text>
          </TouchableOpacity>

          {/* Bell */}
          {showNotification && (
            <TouchableOpacity
              style={barStyles.bellBtn}
              onPress={() =>
                onNotification ? onNotification() : setPanelVisible(true)
              }
            >
             
              <Bell/>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <NotificationPanel
        visible={panelVisible}
        onClose={() => setPanelVisible(false)}
      />
    </>
  );
}

const lightBar = {
  bg: "#FFFFFF",
  patientName: "#1F2024",
  flightText: "#6B7280",
  syncBg: "#F5F5F5",
  syncBorder: "#E0E0E0",
  syncIcon: "#666",
  syncText: "#666",
};
const darkBar = {
  bg: "#0F172A",
  patientName: "#F9FAFB",
  flightText: "#9CA3AF",
  syncBg: "#1E2A3B",
  syncBorder: "#1F2937",
  syncIcon: "#9CA3AF",
  syncText: "#9CA3AF",
};

const barStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingBottom: 0,
  },
  topStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 0,
    marginTop: 20,
  },
  deviceBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 27,
    paddingVertical: 6,
    paddingHorizontal: 16,
    gap: 6,
    borderWidth: 1,
  },
  deviceText: { fontSize: 11, fontWeight: "600" },
  syncBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  syncText: { fontSize: 11, fontWeight: "500" },
  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  patientName: { fontSize: 16, fontWeight: "700" },
  flightText: { fontSize: 11, marginTop: 2 },
  joinBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#015DFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  joinText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#015DFF",
    alignItems: "center",
    justifyContent: "center",
  },
});

// ─── VITAL CARD ───────────────────────────────────────────────
const VitalCard = ({
  label,
  value,
  highlight = false,
  // isDark,
  customColor = null,
}) => {
  const themeCtx = useTheme();
  const isDark = themeCtx?.dark;
  //  const t = isDark ? darkBar : lightBar;
  const t = isDark ? darkVital : lightVital;

  let dynamicBg = t.cardBg;

  // DARK MODE COLORS
  if (isDark) {
    if (label === "Oxygen") {
      dynamicBg = "#1E3249";
    } else if (
      label === "Respiratory rate" ||
      label === "Temperature"
    ) {
      dynamicBg = "#1E3249";
    } else if (label === "ECG") {
      dynamicBg = "#1E3249";
    }
  } else {
    // LIGHT MODE (UNCHANGED)
    if (label === "Oxygen") {
      dynamicBg = "#FEE2E2";
    } else if (
      label === "Respiratory rate" ||
      label === "Temperature"
    ) {
      dynamicBg = "#FFF7ED";
    }
  }

let borderColor = t.border;

  // Default left border
  let leftBorderColor = isDark ? "#FFFFFF" : "#E6E6E6";

  // Oxygen — red (both modes)
  if (label === "Oxygen") {
    leftBorderColor = "#F16154";
  }
  // Respiratory rate & Temperature — orange (both modes)
  else if (label === "Respiratory rate" || label === "Temperature") {
    leftBorderColor = "#FC9432";
  }

  // customColor overrides everything (AVPU Score → #0088FF, etc.)
  if (customColor) {
    leftBorderColor = customColor;
    borderColor = customColor;
  }

  const IconComponent = vitalIcons[label] || vitalIcons["Default"];

  const isECG = label === "ECG";
  const iconSize = isECG ? 26 : 18;

  return (
    <View
      style={[
        vStyles.card,
        {
          backgroundColor: dynamicBg,
          // borderColor: borderColor,
          borderLeftWidth: 4,
          borderLeftColor: leftBorderColor,
        },
      ]}
    >
      <View style={[vStyles.cardTop, { alignItems: "center" }]}>
        <Text style={[vStyles.label, { color: t.label }]}>
          {label}
        </Text>

        <View style={vStyles.iconWrapper}>
          <IconComponent width={iconSize} height={iconSize} />
        </View>
      </View>

      <Text
        style={[
          vStyles.value,
          {
            color:
              isDark && label === "Oxygen"
                ? "#F16154"
                : isDark &&
                  (label === "Respiratory rate" ||
                    label === "Temperature")
                ? "#FC9432"
                : t.value,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const lightVital = {
  cardBg: "#FFFFFF",
  border: "#E5E7EB",
  label: "#6B7280",
  value: "#111827",
  icon: "#9CA3AF",
};
const darkVital = {
 cardBg: "#1E3249",   // Patient vitals background
  border: "#1E3249",
  label: "#94A3B8",
  value: "#F8FAFC",
  icon: "#64748B",
};

const vStyles = StyleSheet.create({
  card: {
    width: "17.2%", // Adjusted for more gap between columns
    height:60,
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconWrapper: {
  width: 24,
  height: 24,
  alignItems: "center",
  justifyContent: "center",
},
  label: { fontSize: 10, marginTop:-18 },
  value: { fontSize: 14, fontWeight: "700", marginTop:-13},
});

// ─── CASE SUMMARY ROW ─────────────────────────────────────────
const SummaryRow = ({ label, value, isDark }) => {
  const t = isDark
    ? { label: "#9CA3AF", value: "#F9FAFB" }
    : { label: "#6B7280", value: "#111827" };
  return (
    <View style={cStyles.summaryRow}>
      <Text style={[cStyles.summaryLabel, { color: t.label }]}>{label}</Text>
      <Text style={[cStyles.summaryValue, { color: t.value }]}>{value}</Text>
    </View>
  );
};

// ─── MAIN SCREEN ─────────────────────────────────────────────
export default function CaseOutcomeScreen({ navigation, route }) {
  const patient = route?.params?.patient;
  // const [isDark, setIsDark] = useState(false);
const themeCtx = useTheme();
  const isDark = themeCtx?.dark;
   const t = isDark ? darkBar : lightBar;
  const theme = isDark
    ? {
        screen: "#0F172A",
      card: "#1E2A3B",
        cardDark: "#051429",
        cardBorder: "#1F2937",
        title: "#F9FAFB",
        subtitle: "#9CA3AF",
        sectionTitle: "#F9FAFB",
        sectionSub: "#9CA3AF",
        bodyText: "#D2D6DB",
        lastUpdated: "#9CA3AF",
        divider: "#1F2937",
        aiIconBg: "#0F2744",
        aiIconColor: "#38BDF8",
      }
    : {
        screen: "#FFFFFF",
      card: "#F6F9FF",
         cardDark: "#F6F9FF", 
        cardBorder: "#E5E7EB",
        title: "#111827",
        subtitle: "#6B7280",
        sectionTitle: "#111827",
        sectionSub: "#6B7280",
        bodyText: "#374151",
        lastUpdated: "#6B7280",
        divider: "#F3F4F6",
        aiIconBg: "#EFF6FF",
        aiIconColor: "#2563EB",
      };

  const VITALS = [
    { label: "Heart Rate", value: "88 bpm", icon: "heart-pulse" },
    { label: "Blood Pressure", value: "135/85 mmHg", icon: "gauge" },
    { label: "SpO2", value: "96%", icon: "molecule-co2" },
    { label: "Oxygen", value: "80%", icon: "molecule-co2", highlight: true, customColor: "#EF4444" }, // Red strip for Oxygen
    {
      label: "Respiratory rate",
      value: "24/min",
      icon: "lungs",
      highlight: true,
      customColor: "#FF8C00" // Orange color
    },
    {
      label: "Temperature",
      value: "34.5°C",
      icon: "thermometer",
      highlight: true,
      customColor: "#FF8C00" // Orange color
    },
    { label: "Skin Colour", value: "Normal", icon: "palette-outline" },
    { label: "Sweating", value: "Mild", icon: "water-outline" },
    { label: "ECG", value: "Sinus", icon: "pulse" },
    { label: "Pain Score", value: "6/10", icon: "emoticon-sad-outline" },
    { label: "Blood Glucose", value: "100 mg/dl", icon: "water" },
    { label: "AVPU Score", value: "15", icon: "brain", customColor: "#0088FF"  },
  ];

  // Split vitals into rows of 5 for better layout control
  const renderVitalsGrid = () => {
    const rows = [];
    for (let i = 0; i < VITALS.length; i += 5) {
      const rowVitals = VITALS.slice(i, i + 5);
      rows.push(
        <View key={i} style={s.vitalsRow}>
          {rowVitals.map((v, idx) => (
            <VitalCard
              key={i + idx}
              label={v.label}
              value={v.value}
              icon={v.icon}
              highlight={v.highlight}
              customColor={v.customColor}
              isDark={isDark}
            />
          ))}
          {/* Add empty placeholders if last row has less than 5 items */}
          {rowVitals.length < 5 && 
            Array(5 - rowVitals.length).fill(null).map((_, idx) => (
              <View key={`empty-${idx}`} style={vStyles.emptyCard} />
            ))
          }
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.screen }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0F172A" : "#FFFFFF"}
      />

      <View style={[s.root, { backgroundColor: theme.screen }]}>
        {/* SIDEBAR */}
        <Sidebar
          navigation={navigation}
          activeKey="allEvents"
          // isDark={isDark}
          // onToggleTheme={() => setIsDark((p) => !p)}
          
        />

        {/* MAIN CONTENT */}
        <View style={s.main}>
          {/* TOP BAR */}
          <DetailedTopBar
            navigation={navigation}
            deviceConnected={true}
            syncTime="Today 12:00 PM"
            patientName={null}
            flight={null}
            isDark={isDark}
          />

          {/* SCROLLABLE BODY */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[s.body, { backgroundColor: theme.screen, paddingTop: 8 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* PAGE TITLE */}
            <View style={s.titleSection}>
              <Text style={[s.pageTitle, { color: theme.title }]}>
                Case Outcome &amp; Final Report
              </Text>
              <Text style={[s.pageSubtitle, { color: theme.subtitle }]}>
                Choose the option that best describes what happened, this will
                be the official record for the medical team.
              </Text>

              {/* ACTION BUTTONS */}
              <View style={s.actionRow}>
                <TouchableOpacity style={s.primaryBtn}>
                  <Text style={s.primaryBtnText}>Generate Full Report PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    s.outlineBtn,
                    {
                      borderColor: isDark ? "#D2D6DB" : "#015DFF",
                      backgroundColor: theme.card,
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.outlineBtnText,
                      { color: isDark ? "#D2D6DB" : "#015DFF" },
                    ]}
                  >
                    Email Final Report
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* CASE INFORMATION CARD */}
            <View
              style={[
                s.caseInfoCard,
                { backgroundColor: isDark ? "#051429" : theme.card, borderColor: theme.cardBorder },
              ]}
            >
              <Text style={[s.cardTitle, { color: theme.sectionTitle }]}>
                Case Summary for John Smith
              </Text>

              <View style={s.summaryGrid}>
                {/* Left column */}
                <View style={[s.summaryCol, { alignItems: 'flex-start' }]}>
                  <SummaryRow
                    label="Flight Number"
                    value="AA123 (JFK → LAX)"
                    isDark={isDark}
                  />
                  <SummaryRow
                    label="Case ID"
                    value="TC-20260127-AA123-001"
                    isDark={isDark}
                  />
                  <SummaryRow
                    label="Time of Onset"
                    value="14:35 UTC"
                    isDark={isDark}
                  />
                  <SummaryRow
                    label="Case Duration"
                    value="45 minutes"
                    isDark={isDark}
                  />
                  <SummaryRow
                    label="Patient"
                    value="Male, 42 years, Seat 15A"
                    isDark={isDark}
                  />
                </View>

                {/* Right column - shifted to the left by adjusting alignment */}
                <View style={[s.summaryCol, { alignItems: 'flex-start' }]}>
                  <SummaryRow
                    label="Primary Complaint"
                    value="Neurologic - Left-sided weakness"
                    isDark={isDark}
                  />
                  <SummaryRow
                    label="Interventions"
                    value="O2 (2L/min), Aspirin, Analgesic"
                    isDark={isDark}
                  />
                  <SummaryRow
                    label="Medical Volunteer"
                    value="Doctor - Dr. Sarah Mitchell"
                    isDark={isDark}
                  />
                  <SummaryRow
                    label="Ground Support"
                    value="Contacted - No diversion advised"
                    isDark={isDark}
                  />
                  <SummaryRow
                    label="Final Status"
                    value="Stabilised - Monitoring continued"
                    isDark={isDark}
                  />
                </View>
              </View>
            </View>

            {/* AI EVENT SUMMARY CARD */}
            <View
              style={[
                s.aiSummaryCard,
                { backgroundColor: isDark ? "#051429" : theme.card, borderColor: theme.cardBorder },
              ]}
            >
              <View style={s.aiTitleRow}>
                <View
                  
                >
                  <MaterialIcons
                    name="auto-awesome"
                    size={22}
                    color={theme.aiIconColor}
                  />
                </View>
                <Text style={[s.cardTitle, { color: theme.sectionTitle }]}>
                  AI Event Summary
                </Text>
              </View>

              <Text style={[s.aiBody, { color: theme.bodyText }]}>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur laborum.
              </Text>
              <Text style={[s.aiBody, { color: theme.bodyText }]}>
             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              </Text>
              <Text style={[s.aiBody, { color: theme.bodyText }]}>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              </Text>
              <Text style={[s.aiBody, { color: theme.bodyText }]}>
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
            </View>

            {/* CLINICAL VITALS MONITORING CARD */}
            <View
              style={[
                s.vitalsCard,
                { backgroundColor: theme.cardDark, borderColor: theme.cardBorder },
              ]}
            >
              <View style={s.vitalsHeader}>
                <Text style={[s.cardTitle, { color: theme.sectionTitle }]}>
                 Patient Vitals
                </Text>
                <Text style={[s.lastUpdated, { color: theme.lastUpdated }]}>
                  Last updated 20/04/2026 12:55:54
                </Text>
              </View>

              <View style={s.vitalsGrid}>
                {renderVitalsGrid()}
              </View>
            </View>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────
const cStyles = StyleSheet.create({
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    gap: 16,
    width: '100%',
  },
  summaryLabel: { fontSize: 12, flex: 1, textAlign: 'left' },
  summaryValue: {
    fontSize: 12,
    fontWeight: "700",
    flex: 1.4,
    textAlign: 'left',
  },
});

const s = StyleSheet.create({
  safe: { flex: 1 },
  root: { flex: 1, flexDirection: "row" },
  main: { flex: 1, flexDirection: "column" },
  whiteTick: {   width: 24,          // ✅ fixed size
  height: 24,
  borderRadius: 12,   
  backgroundColor: 'green',

  justifyContent: 'center', // center icon/text
    alignItems: 'center',
  },
  syncIcon: {
    width: 24,          // ✅ fixed size
  height: 24,
  },
  body: {
    padding: 20,
    gap: 15,
  },

  // ── Title section ──
  titleSection: { gap: 8, marginBottom: 16, marginTop: 8 },
  pageTitle: { fontSize: 20, fontWeight: "800" },
  pageSubtitle: { fontSize: 13.5, lineHeight: 20 },

  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#015DFF",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 8,
  },
  primaryBtnText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 8,
  },
  outlineBtnText: { fontSize: 11, fontWeight: "600" },

  // ── Different Cards with unique names ──
  caseInfoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 13,
    backgroundColor: '#F6F9FF',
    marginTop: -12,
    height:240
  },
  aiSummaryCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
    gap: 8,
    backgroundColor: '#F6F9FF',
    marginTop: 8,
    height:305
  },
  vitalsCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    backgroundColor: '#F6F9FF',
    marginTop: 8,
    height:305
  },
  cardTitle: { fontSize: 15, fontWeight: "700" },

  // ── Summary grid with more spacing ──
  summaryGrid: { flexDirection: "row", gap: 80 },
  summaryCol: { flex: 1 },
  vertDivider: { width: 1.5, marginHorizontal: 36 },

  // ── AI summary ──
  aiTitleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  aiIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  aiBody: { fontSize: 13, lineHeight: 20 },

  // ── Vitals ──
  vitalsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  lastUpdated: { fontSize: 11 },
  vitalsGrid: {
    flexDirection: "column",
    gap: 10,
  },
  vitalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },
});

// Add empty card style
vStyles.emptyCard = {
  width: "17.2%",
  opacity: 0,
};