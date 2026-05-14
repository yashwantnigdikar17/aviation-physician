import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "react-native";
import SendIcon from "../assets/Images/sendicon.svg";
import Star from "../assets/Images/starsvg.svg";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SpO2Card from "../components/spo2component";
import AvatarIcon from "../assets/Images/avatar.svg";
import Sidebar from "../components/Sidebar";
import RightVitalsPanel from "../components/RightVitalsPanel";
import VideoIconw from "../assets/Images/videoiconw";
import { lightTheme, darkTheme } from "../theme/theme";
import Mic_icon from "../assets/Images/mic_icon.svg";
import Attach_icon from "../assets/Images/attachicon.svg";
import Avatar2 from "../assets/Images/Avatar2.svg";
import SocketManager from "../services/SocketManager";
import { useTheme } from "../theme/ThemeContext";

// ── NEW imports ──────────────────────────────────────────────────────────────
import ChatPanel from "../components/ChatPanel";
import MedicineModules from "../components/MedicineModules";

// ─────────────────────────────────────────────
// SESSION IDs — replace with real auth context
// ─────────────────────────────────────────────
const MY_USER_ID = "doctor_001";
const MY_USER_NAME = "Dr. Sarah Johnson";
const RECEIVER_ID = "nurse_001";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const generateRoomId = (caseId) => `aeromedic-${caseId}-${Date.now()}`;

// ─────────────────────────────────────────────
// CALLING OVERLAY
// ─────────────────────────────────────────────
const CallingOverlay = ({ calleeName, onCancel }) => (
  <View style={overlayStyles.backdrop}>
    <View style={overlayStyles.card}>
      <View style={overlayStyles.avatarWrap}>
        <View style={overlayStyles.avatar}>
          <MaterialIcons name="medical-services" size={32} color="#60A5FA" />
        </View>
      </View>
      <Text style={overlayStyles.name}>{calleeName}</Text>
      <Text style={overlayStyles.status}>Calling…</Text>
      <ActivityIndicator
        color="#3B82F6"
        style={{ marginTop: 8, marginBottom: 28 }}
      />
      <TouchableOpacity style={overlayStyles.endBtn} onPress={onCancel}>
        <MaterialIcons name="call-end" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={overlayStyles.endLabel}>Cancel</Text>
    </View>
  </View>
);

// ─────────────────────────────────────────────
// VITAL TRENDS PANEL
// ─────────────────────────────────────────────
const VitalsTrendPanel = ({ onClose, t }) => (
  <View style={{ flex: 1, backgroundColor: t.cdRootBg }}>
    <View
      style={[
        styles.vitalsHeader,
        {
          backgroundColor: t.cdHeaderBg,
          borderBottomColor: t.cdVitalsHeaderBorder,
        },
      ]}
    >
      <Text style={[styles.vitalsTitle, { color: t.cdVitalsTitle }]}>
        Vital Trends
      </Text>
      <TouchableOpacity onPress={onClose}>
        <MaterialIcons name="close" size={20} color={t.cdVitalsCloseColor} />
      </TouchableOpacity>
    </View>
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <SpO2Card theme={t} />
    </ScrollView>
  </View>
);

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────
export default function CaseDetailScreen({ navigation, route }) {
  const [message, setMessage] = useState("");
  const [showTrends, setShowTrends] = useState(false);

  const [pendingMedicines, setPendingMedicines] = useState([]);
  const [recommendedMedicines, setRecommendedMedicines] = useState([]);

  const activeTab = "summary";
  const insets = useSafeAreaInsets();

  const themeCtx = useTheme();
  const t = themeCtx?.theme;
  const isDark = themeCtx?.dark;
  const physicianAssigned = route?.params?.physicianAssigned ?? false;

  // ── NEW: inline chat panel state ────────────────────────────────────────
  const [chatVisible, setChatVisible] = useState(false);

  // ── Call state ──────────────────────────────────────────────────────────
  const [callStatus, setCallStatus] = useState("idle");
  const [activeCallId, setActiveCallId] = useState(null);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const timeoutRef = useRef(null);
  const activeRoomIdRef = useRef(null);
  const [chatMessage, setChatMessage] = useState("");

  // const addMedicineToChat = (medicineName) => {
  //   setChatMessage((prev) => {
  //     if (prev.includes(medicineName)) {
  //       return prev;
  //     }

  //     return prev.length > 0
  //       ? `${prev}\n💊 ${medicineName}`
  //       : `💊 ${medicineName}`;
  //   });
  // };

  // const addMultipleMedicinesToChat = (medicines) => {
  //   setChatMessage((prev) => {
  //     const existing = prev.split("\n");

  //     const newItems = medicines
  //       .map((m) => `💊 ${m}`)
  //       .filter((m) => !existing.includes(m));

  //     return [...existing, ...newItems].filter(Boolean).join("\n");
  //   });
  // };
  // ── Socket listeners ────────────────────────────────────────────────────
  useEffect(() => {
    if (!SocketManager.isConnected()) {
      SocketManager.connect(MY_USER_ID);
    }

    const handleAccepted = (payload = {}) => {
      const resolvedRoomId =
        payload?.roomId ||
        payload?.roomID ||
        payload?.meetingId ||
        activeRoomIdRef.current;

      console.log(
        "✅ Call accepted:",
        payload,
        "resolvedRoomId:",
        resolvedRoomId,
      );
      clearTimeout(timeoutRef.current);
      setCallStatus("accepted");

      navigation.navigate("Meeting", {
        roomId: resolvedRoomId,
        userName: MY_USER_NAME,
        userRole: "doctor",
      });

      setTimeout(resetCall, 500);
    };

    const handleRejected = () => {
      console.log("❌ Call rejected");
      clearTimeout(timeoutRef.current);
      setCallStatus("rejected");
      Alert.alert("Call Declined", "The crew member declined your call.");
      resetCall();
    };

    const handleEnded = () => {
      console.log("📴 Call ended");
      clearTimeout(timeoutRef.current);
      resetCall();
    };

    SocketManager.onCallAccepted(handleAccepted);
    SocketManager.onCallRejected(handleRejected);
    SocketManager.onCallEnded(handleEnded);

    return () => {
      clearTimeout(timeoutRef.current);
      SocketManager.off("call_accepted");
      SocketManager.off("call_rejected");
      SocketManager.off("call_ended");
    };
  }, []);

  // ── Reset helper ─────────────────────────────────────────────────────────
  const resetCall = useCallback(() => {
    setCallStatus("idle");
    setActiveCallId(null);
    setActiveRoomId(null);
    activeRoomIdRef.current = null;
  }, []);

  // ── Start call ───────────────────────────────────────────────────────────
  const handleStartCall = useCallback(() => {
    if (callStatus !== "idle") return;

    if (!SocketManager.isConnected()) {
      Alert.alert("Connecting...", "Please wait for socket connection");
      return;
    }

    const roomId = generateRoomId("AA1234");
    const callId = `call_${Date.now()}`;

    console.log("📞 Starting call:", roomId);

    setCallStatus("calling");
    setActiveCallId(callId);
    setActiveRoomId(roomId);
    activeRoomIdRef.current = roomId;

    SocketManager.callUser({
      callerId: MY_USER_ID,
      callerName: MY_USER_NAME,
      receiverId: RECEIVER_ID,
      roomId,
      callId,
    });

    navigation.navigate("Meeting", {
      roomId,
      userName: MY_USER_NAME,
      userRole: "doctor",
    });

    setTimeout(resetCall, 300);
  }, [callStatus, navigation, resetCall]);

  // ── Cancel call ──────────────────────────────────────────────────────────
  const handleCancelCall = useCallback(() => {
    console.log("❌ Call cancelled");
    clearTimeout(timeoutRef.current);

    if (activeCallId && SocketManager.isConnected()) {
      SocketManager.cancelCall({
        callId: activeCallId,
        receiverId: RECEIVER_ID,
      });
    }

    resetCall();
  }, [activeCallId, resetCall]);

  const formatMedicineLine = useCallback((medicine) => {
    const moduleTitle =
      medicine?.moduleTitle || medicine?.moduleName || medicine?.module || "";

    const medicineName =
      typeof medicine === "string"
        ? medicine
        : medicine?.medicineName || medicine?.name || medicine?.title || "";

    if (!medicineName) return null;

    const cleanModuleTitle = moduleTitle
      ? moduleTitle.replace(/:\s*$/, "")
      : "";

    return cleanModuleTitle
      ? `💊 ${cleanModuleTitle}: ${medicineName}`
      : `💊 ${medicineName}`;
  }, []);

  const getMedicineKey = useCallback((medicine) => {
    const moduleId =
      medicine?.moduleId || medicine?.moduleTitle || medicine?.moduleName || "";

    const medicineName =
      typeof medicine === "string"
        ? medicine
        : medicine?.medicineName || medicine?.name || medicine?.title || "";

    return `${moduleId}__${medicineName}`;
  }, []);

  const addPendingMedicine = useCallback(
    (medicineOrMedicines) => {
      const medicines = Array.isArray(medicineOrMedicines)
        ? medicineOrMedicines
        : [medicineOrMedicines];

      const normalizedMedicines = medicines
        .map((m) => {
          if (typeof m === "string") {
            return {
              moduleId: "",
              moduleTitle: "",
              medicineName: m,
              usage: "",
            };
          }

          return {
            moduleId: m?.moduleId || "",
            moduleTitle: m?.moduleTitle || "",
            medicineName: m?.medicineName || m?.name || m?.title || "",
            usage: m?.usage || "",
          };
        })
        .filter((m) => m.medicineName);

      if (normalizedMedicines.length === 0) return;

      setPendingMedicines((prev) => {
        const existingKeys = new Set(prev.map(getMedicineKey));
        const next = [...prev];

        normalizedMedicines.forEach((medicine) => {
          const key = getMedicineKey(medicine);
          if (!existingKeys.has(key)) {
            next.push(medicine);
            existingKeys.add(key);
          }
        });

        return next;
      });

      setChatMessage((prev) => {
        const existingLines = prev.split("\n").filter(Boolean);

        const newLines = normalizedMedicines
          .map(formatMedicineLine)
          .filter(Boolean)
          .filter((line) => !existingLines.includes(line));

        return [...existingLines, ...newLines].join("\n");
      });

      setChatVisible(true);
    },
    [formatMedicineLine, getMedicineKey],
  );

  //   const addPendingMedicine = useCallback((medicine) => {
  //   const medicineName =
  //     typeof medicine === "string"
  //       ? medicine
  //       : medicine?.name || medicine?.medicineName || medicine?.title;

  //   if (!medicineName) return;

  //   setPendingMedicines((prev) => {
  //     if (prev.includes(medicineName)) return prev;
  //     return [...prev, medicineName];
  //   });
  // }, []);

  // const addPendingMedicines = useCallback((medicines = []) => {
  //   const names = medicines
  //     .map((m) =>
  //       typeof m === "string"
  //         ? m
  //         : m?.name || m?.medicineName || m?.title
  //     )
  //     .filter(Boolean);

  //   setPendingMedicines((prev) => {
  //     const merged = [...prev];

  //     names.forEach((name) => {
  //       if (!merged.includes(name)) {
  //         merged.push(name);
  //       }
  //     });

  //     return merged;
  //   });
  // }, []);

  const handleSendChatMedicines = useCallback(() => {
    if (pendingMedicines.length === 0 && !chatMessage.trim()) {
      return;
    }

    if (pendingMedicines.length > 0) {
      setRecommendedMedicines((prev) => {
        const existingKeys = new Set(prev.map(getMedicineKey));
        const next = [...prev];

        pendingMedicines.forEach((medicine) => {
          const key = getMedicineKey(medicine);

          if (!existingKeys.has(key)) {
            next.push(medicine);
            existingKeys.add(key);
          }
        });

        return next;
      });
    }

    setPendingMedicines([]);
    setChatMessage("");
  }, [pendingMedicines, chatMessage, getMedicineKey]);
  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <View style={[styles.safe, { backgroundColor: t.cdSafeBg }]}>
      {/* ── CALLING OVERLAY ── */}
      {callStatus === "calling" && (
        <CallingOverlay
          calleeName="Julia (Crew Nurse)"
          onCancel={handleCancelCall}
        />
      )}

      <View style={[styles.root, { backgroundColor: t.cdRootBg }]}>
        {/* ── SIDEBAR ── */}
        <Sidebar activeKey="medicines" navigation={navigation} />

        {/* ── MAIN CONTENT ── */}
        <View style={[styles.mainContent, { backgroundColor: t.cdRootBg }]}>
          {/* HEADER */}
          <View
            style={[
              styles.patientHeader,
              {
                paddingTop: insets.top,
                backgroundColor: t.cdHeaderBg,
                borderBottomColor: t.cdHeaderBorder,
              },
            ]}
          >
            <View>
              <Text style={[styles.patientName, { color: t.cdPatientName }]}>
                John Smith, 58 M
              </Text>
              <Text
                style={[styles.patientFlight, { color: t.cdPatientFlight }]}
              >
                Flight AA1234, SYD → LAX
              </Text>
            </View>

            <View style={{ flex: 1 }} />

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* ── CHAT BUTTON — toggles inline ChatPanel ── */}
              <TouchableOpacity
                style={[
                  styles.chatBtn,
                  !physicianAssigned && styles.disabledActionBtn,
                ]}
                onPress={() => {
                  if (physicianAssigned) {
                    setChatVisible((prev) => !prev);
                  }
                }}
                disabled={!physicianAssigned}
              >
                <MaterialIcons
                  name="chat-bubble-outline"
                  size={18}
                  color="#fff"
                />
                <Text style={styles.chatBtnText}>
                  {chatVisible ? "Close Chat" : "Chat"}
                </Text>
              </TouchableOpacity>

              {/* JOIN NOW */}
              <TouchableOpacity
                style={[
                  styles.joinNowBtn,
                  callStatus === "calling" && styles.joinNowBtnDisabled,
                  !physicianAssigned && styles.disabledActionBtn,
                ]}
                onPress={handleStartCall}
                disabled={callStatus !== "idle" || !physicianAssigned}
              >
                <VideoIconw />
                <Text style={styles.joinNowText}>
                  {callStatus === "calling" ? "Calling…" : "Join Now"}
                </Text>
              </TouchableOpacity>

              {/* BELL */}
              <TouchableOpacity style={styles.bellBtn}>
                <MaterialIcons
                  name="notifications-none"
                  size={22}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* BODY */}
          <View style={styles.body}>
            {/*
             * ── LEFT PANEL ──────────────────────────────────────────────────
             * position: "relative" so that ChatPanel's absoluteFillObject
             * stays within this panel and does NOT bleed into the medicine
             * modules panel or the right vitals panel.
             */}
            <View
              style={[
                styles.leftPanel,
                { backgroundColor: t.cdLeftPanelBg, position: "relative" },
              ]}
            >
              {/* ── TABS (kept but empty — no tabs currently active) ── */}
              <View
                style={[
                  styles.tabWrapper,
                  { backgroundColor: t.cdTabWrapperBg },
                ]}
              />

              {/* ── EVENT SUMMARY ── */}
              {/* ── EVENT SUMMARY ── */}
              {activeTab === "summary" && (
                <ScrollView
                  style={styles.eventSummaryScroll}
                  contentContainerStyle={styles.eventSummaryContent}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {/* <Text
      style={[styles.summaryTitle, { color: t.cdSummaryTitle }]}
    >
      Event Summary
    </Text> */}

                  {/* ───────────────── CASE HEADER ───────────────── */}
                  <View
                    style={[
                      styles.summaryCard,
                      {
                        backgroundColor: isDark ? "#111827" : "#FFFFFF",
                        borderColor: isDark ? "#1F2937" : "#E5E7EB",
                      },
                    ]}
                  >
                    <View style={styles.caseHeaderTop}>
                      <Text
                        style={[
                          styles.sectionHeading,
                          {
                            color: isDark ? "#F8FAFC" : "#111827",
                            marginBottom: 0,
                          },
                        ]}
                      >
                        Event Summary
                      </Text>

                      <View style={styles.statusBadge}>
                        <Text style={styles.statusBadgeText}>CLOSED</Text>
                      </View>
                    </View>

                    <View style={styles.quickInfoGrid}>
                      {[
                        ["Patient", "Male, 62 yrs"],
                        ["Flight", "AA1234"],
                        ["Route", "SYD → LAX"],
                        ["Seat", "18C"],
                        ["Aircraft", "Boeing 787"],
                        ["Priority", "High"],
                        ["Physician", "Dr. Raj Mehta"],
                        ["Duration", "55 mins"],
                      ].map(([label, value], idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.quickInfoCard,
                            {
                              backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.quickInfoLabel,
                              { color: isDark ? "#94A3B8" : "#64748B" },
                            ]}
                          >
                            {label}
                          </Text>

                          <Text
                            style={[
                              styles.quickInfoValue,
                              { color: isDark ? "#F8FAFC" : "#111827" },
                            ]}
                          >
                            {value}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <Text
                      style={[
                        styles.summaryParagraph,
                        { color: isDark ? "#CBD5E1" : "#374151" },
                      ]}
                    >
                    A 62-year-old male passenger on flight AA1234 developed sudden dizziness,
slurred speech, facial asymmetry, and right-sided weakness. The case was
escalated to the telecare physician team and managed as a suspected
stroke/TIA with associated hypoglycemia.
                    </Text>
                  </View>

                  {/* ───────────────── CHIEF COMPLAINT ───────────────── */}
                  <View
                    style={[
                      styles.summaryCard,
                      {
                        backgroundColor: isDark ? "#111827" : "#FFFFFF",
                        borderColor: isDark ? "#1F2937" : "#E5E7EB",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sectionHeading,
                        { color: isDark ? "#F8FAFC" : "#111827" },
                      ]}
                    >
                      Chief Complaint
                    </Text>

                    <Text
                      style={[
                        styles.summaryParagraph,
                        { color: isDark ? "#CBD5E1" : "#374151" },
                      ]}
                    >
                    Sudden dizziness, slurred speech, facial asymmetry, and right-sided arm weakness.
                    </Text>
                  </View>

                  {/* ───────────────── INITIAL ASSESSMENT ───────────────── */}
                  <View
                    style={[
                      styles.summaryCard,
                      {
                        backgroundColor: isDark ? "#111827" : "#FFFFFF",
                        borderColor: isDark ? "#1F2937" : "#E5E7EB",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sectionHeading,
                        { color: isDark ? "#F8FAFC" : "#111827" },
                      ]}
                    >
                      Initial Assessment
                    </Text>

                    <Text
                      style={[
                        styles.summaryParagraph,
                        { color: isDark ? "#CBD5E1" : "#374151" },
                      ]}
                    >
                     FAST assessment was positive for neurological deficit. Presentation was
concerning for stroke/TIA with concurrent low blood glucose.
                    </Text>

                    {/* <View style={styles.vitalsGrid}>
                      {[
                        ["AVPU", "Alert"],
                        ["RR", "24/min"],
                        ["SpO2", "91%"],
                        ["Pulse", "112 bpm"],
                        ["BP", "168/96"],
                        ["BGL", "3.2 mmol/L"],
                      ].map(([label, value], idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.vitalCard,
                            {
                              backgroundColor: isDark ? "#0F172A" : "#F8FAFC",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.vitalLabel,
                              { color: isDark ? "#94A3B8" : "#64748B" },
                            ]}
                          >
                            {label}
                          </Text>

                          <Text
                            style={[
                              styles.vitalValue,
                              { color: isDark ? "#F8FAFC" : "#111827" },
                            ]}
                          >
                            {value}
                          </Text>
                        </View>
                      ))}
                    </View> */}
                  </View>

                  {/* ───────────────── TIMELINE ───────────────── */}
                  <Text
                    style={[
                      styles.timelineHeading,
                      { color: isDark ? "#F8FAFC" : "#111827" },
                    ]}
                  >
                    Timeline of Events
                  </Text>

                  {[
                    [
                      "08:42 UTC",
                      "Symptoms Reported",
                      "Passenger developed sudden dizziness, slurred speech, and right-sided weakness.",
                    ],
                    [
                      "08:44 UTC",
                      "Neurological Concern Identified",
                      "FAST assessment suggested possible stroke/TIA with associated low blood glucose.",
                    ],
                    [
                      "08:49 UTC",
                      "Physician Guidance Given",
                      "Oxygen, glucose correction, airway monitoring, and continued observation were advised.",
                    ],
                    [
                      "09:37 UTC",
                      "Case Closed",
                      "Passenger remained stable and was prepared for EMS handoff after landing.",
                    ],
                  ].map(([time, title, desc], idx) => (
                    <View key={idx} style={styles.timelineRow}>
                      <View style={styles.timelineLineWrap}>
                        <View style={styles.timelineDot} />
                        {idx !== 6 && <View style={styles.timelineLine} />}
                      </View>

                      <View
                        style={[
                          styles.timelineCard,
                          {
                            backgroundColor: isDark ? "#111827" : "#FFFFFF",
                            borderColor: isDark ? "#1F2937" : "#E5E7EB",
                          },
                        ]}
                      >
                        <Text style={styles.timelineTime}>{time}</Text>

                        <Text
                          style={[
                            styles.timelineTitle,
                            { color: isDark ? "#F8FAFC" : "#111827" },
                          ]}
                        >
                          {title}
                        </Text>

                        <Text
                          style={[
                            styles.timelineDesc,
                            { color: isDark ? "#CBD5E1" : "#4B5563" },
                          ]}
                        >
                          {desc}
                        </Text>
                      </View>
                    </View>
                  ))}

                  {/* ───────────────── TREATMENT ───────────────── */}
                  <View
                    style={[
                      styles.summaryCard,
                      {
                        backgroundColor: isDark ? "#111827" : "#FFFFFF",
                        borderColor: isDark ? "#1F2937" : "#E5E7EB",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sectionHeading,
                        { color: isDark ? "#F8FAFC" : "#111827" },
                      ]}
                    >
                      Treatment & Interventions
                    </Text>

                    {[
                      "Oxygen therapy initiated",
                      "Glucose correction performed",
                      "Continuous neuro monitoring",
                      "IV cannulation completed",
                      "IV fluids administered",
                      "Telecare physician consultation",
                    ].map((item, idx) => (
                      <View key={idx} style={styles.treatmentRow}>
                        <View style={styles.treatmentBullet} />

                        <Text
                          style={[
                            styles.treatmentText,
                            { color: isDark ? "#CBD5E1" : "#374151" },
                          ]}
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* ───────────────── COMMUNICATION SUMMARY ───────────────── */}
                  <View
                    style={[
                      styles.summaryCard,
                      {
                        backgroundColor: isDark ? "#111827" : "#FFFFFF",
                        borderColor: isDark ? "#1F2937" : "#E5E7EB",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sectionHeading,
                        { color: isDark ? "#F8FAFC" : "#111827" },
                      ]}
                    >
                      Communication Summary
                    </Text>

                    <Text
                      style={[
                        styles.summaryParagraph,
                        { color: isDark ? "#CBD5E1" : "#374151" },
                      ]}
                    >
                    Crew reported acute neurological symptoms with low blood glucose. Physician
advised oxygen, glucose correction, close monitoring, and EMS handoff after
landing.
                    </Text>
                  </View>

                  {/* Recommended medicines */}
                  <View
                    style={[
                      styles.recommendedMedicineCard,
                      {
                        backgroundColor: isDark ? "#111827" : "#FFFFFF",
                        borderColor: isDark ? "#1F2937" : "#E5E7EB",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.recommendedMedicineTitle,
                        { color: isDark ? "#F8FAFC" : "#111827" },
                      ]}
                    >
                      Recommended Medicines
                    </Text>

                    {recommendedMedicines.length > 0 ? (
                      recommendedMedicines.map((medicine, index) => {
                        const moduleTitle = medicine?.moduleTitle
                          ? medicine.moduleTitle.replace(/:\s*$/, "")
                          : "Unassigned Module";

                        const medicineName =
                          typeof medicine === "string"
                            ? medicine
                            : medicine?.medicineName ||
                              medicine?.name ||
                              medicine?.title ||
                              "";

                        return (
                          <View
                            key={`${moduleTitle}-${medicineName}-${index}`}
                            style={[
                              styles.recommendedMedicineItem,
                              {
                                backgroundColor:
                                  t.cdTiaItemBg || "rgba(10,95,255,0.12)",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.recommendedMedicineText,
                                { color: isDark ? "#CBD5E1" : "#374151" },
                              ]}
                            >
                              💊 {moduleTitle}: {medicineName}
                            </Text>
                          </View>
                        );
                      })
                    ) : (
                      <Text
                        style={[
                          styles.recommendedMedicineEmpty,
                          { color: t.cdPatientFlight || "#94A3B8" },
                        ]}
                      >
                        No medicines recommended yet.
                      </Text>
                    )}
                  </View>

                  {/* ───────────────── FINAL OUTCOME ───────────────── */}
                  <View
                    style={[
                      styles.summaryCard,
                      {
                        backgroundColor: isDark ? "#052E16" : "#ECFDF5",
                        borderColor: isDark ? "#14532D" : "#A7F3D0",
                        marginBottom: 40,
                        marginTop: 20,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sectionHeading,
                        { color: isDark ? "#BBF7D0" : "#065F46" },
                      ]}
                    >
                      Final Outcome
                    </Text>

                    <Text
                      style={[
                        styles.summaryParagraph,
                        { color: isDark ? "#D1FAE5" : "#065F46" },
                      ]}
                    >
                      Passenger remained conscious, clinically stable, and
                      responsive at the time of landing. Mild residual right arm
                      weakness persisted. Passenger transferred to airport EMS
                      for further stroke evaluation.
                    </Text>
                  </View>
                </ScrollView>
              )}

              {/*
               * ── INLINE CHAT PANEL ─────────────────────────────────────────
               * Rendered in "inline" mode so it uses absoluteFillObject
               * and covers only this leftPanel.
               */}
              <ChatPanel
                mode="inline"
                visible={chatVisible}
                onClose={() => setChatVisible(false)}
                chatTitle="Julia (Crew)"
                message={chatMessage}
                setMessage={setChatMessage}
                pendingMedicines={pendingMedicines}
                onSendMedicines={handleSendChatMedicines}
              />
            </View>
          </View>
        </View>

        {/* ── MEDICINE MODULES PANEL (replaces TIA Suggest) ── */}
        <View
          style={[
            styles.tiaPanel(insets),
            {
              backgroundColor: t.cdTiaPanelBg,
              borderColor: t.cdTiaPanelBorder,
            },
          ]}
        >
          {showTrends ? (
            <SpO2Card onClose={() => setShowTrends(false)} />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modulesPanelContent}
            >
              {/*
               * MedicineModules with:
               *   showUsageColumn={false}  — no Usage column, as requested
               *   showCheckboxes={false}   — default, no checkboxes needed here
               *   showAddButtons={false}   — default, no add buttons needed here
               */}
              <MedicineModules
                searchQuery=""
                showUsageColumn={false}
                showGlobalAddAll={true}
                showCheckboxes={true}
                showAddButtons={true}
                onAddMedicine={addPendingMedicine}
                onAddMedicines={addPendingMedicine}
              />
            </ScrollView>
          )}
        </View>

        {/* ── RIGHT VITALS PANEL ── */}
        <View style={[styles.rightPanelWrapper, { paddingTop: insets.top }]}>
          <RightVitalsPanel
            theme={t}
            onShowTrends={() => setShowTrends(true)}
            onECGPress={() => navigation.navigate("ECGScreen")}
          />
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1 },
  root: { flex: 1, flexDirection: "row" },
  mainContent: { flex: 1, flexDirection: "column" },

  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 25,
  },
  patientName: { fontSize: 21, fontWeight: "700" },
  patientFlight: { fontSize: 11, marginTop: 2, fontWeight: "400" },

  // Chat toggle button — normal state
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#015DFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },

  //event summary

  summaryCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  eventSummaryScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },

  eventSummaryContent: {
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  summaryParagraph: {
    fontSize: 13,
    lineHeight: 21,
  },

  caseHeaderTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  caseId: {
    fontSize: 18,
    fontWeight: "800",
  },

  caseSubText: {
    fontSize: 12,
    marginTop: 3,
  },

  statusBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  quickInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  quickInfoCard: {
    width: "31%",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },

  quickInfoLabel: {
    fontSize: 11,
    marginBottom: 4,
  },

  quickInfoValue: {
    fontSize: 13,
    fontWeight: "700",
  },

  vitalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 14,
  },

  vitalCard: {
    width: "31%",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  vitalLabel: {
    fontSize: 11,
    marginBottom: 6,
  },

  vitalValue: {
    fontSize: 13,
    fontWeight: "700",
  },

  timelineHeading: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
    marginTop: 8,
  },

  timelineRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  timelineLineWrap: {
    width: 30,
    alignItems: "center",
  },

  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 20,
    backgroundColor: "#015DFF",
    marginTop: 10,
  },

  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#334155",
    marginTop: 2,
  },

  timelineCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },

  timelineTime: {
    color: "#3B82F6",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
  },

  timelineTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },

  timelineDesc: {
    fontSize: 12,
    lineHeight: 18,
  },

  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  redFlagChip: {
    backgroundColor: "#7F1D1D",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },

  redFlagText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  treatmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  treatmentBullet: {
    width: 8,
    height: 8,
    borderRadius: 20,
    backgroundColor: "#015DFF",
    marginRight: 10,
  },

  treatmentText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  // Chat button — active (panel is open)
  chatBtnActive: {
    backgroundColor: "#0F2D6E",
  },
  chatBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  disabledActionBtn: {
    opacity: 0.45,
    backgroundColor: "#475569",
  },
  joinNowBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#015DFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  joinNowBtnDisabled: { backgroundColor: "#334155" },
  joinNowText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },

  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#015DFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  body: { flex: 1, flexDirection: "row" },

  // left panel must be "relative" so the absolute ChatPanel is clipped to it
  leftPanel: { flex: 1, overflow: "hidden" },

  tabWrapper: {
    flexDirection: "row",
    borderRadius: 40,
    padding: 4,
    margin: 12,
    alignSelf: "flex-start",
  },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexWrap: "nowrap",
  },
  tabText: { fontSize: 12, fontWeight: "500", marginLeft: 6, flexShrink: 1 },
  tabTextActive: { fontWeight: "700" },

  summaryTitle: { fontSize: 14, fontWeight: "500", marginBottom: 8 },
  cardBodyText: { fontSize: 12, lineHeight: 16 },
  cardSectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
    padding: 10,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },

  instructionsContainer: {
    flex: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 10,
    overflow: "hidden",
  },
  chatWrapper: { marginTop: 10, alignItems: "flex-end", marginRight: 70 },
  chatWrapper2: { marginTop: 10, alignItems: "flex-start", marginLeft: 25 },
  chatBubble: { padding: 10, borderRadius: 12, maxWidth: "75%" },
  chatBubble2: {
    padding: 10,
    borderRadius: 12,
    maxWidth: "75%",
    marginLeft: 50,
    marginTop: 10,
  },
  chatText: { fontSize: 12, lineHeight: 16 },
  chatFooter: { marginTop: 6, fontSize: 10 },

  avatarWrapper: {
    position: "absolute",
    right: -50,
    bottom: -3,
    width: 35,
    height: 35,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D0BCFF",
  },
  avatarWrapper2: {
    position: "absolute",
    left: 0,
    bottom: -3,
    width: 35,
    height: 35,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: { position: "relative", borderRadius: 8, overflow: "hidden" },
  image: { width: 180, height: 120 },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  chatInputBar: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
    marginLeft: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    width: "96.5%",
  },
  chatInput: { flex: 1, fontSize: 14, fontWeight: "500" },
  iconCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A5FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
  },
  sendBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },

  // ── Medicine Modules panel (same geometry as the old tiaPanel) ──
  tiaPanel: (insets) => ({
    width: 309,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: "100%",
    marginTop: 0,
    paddingTop: insets.top + 14,
    paddingHorizontal: 0, // let MedicineModules handle its own horizontal padding
    paddingBottom: 14,
    overflow: "hidden",
  }),

  // Extra top padding inside the ScrollView so the first module isn't flush with the border
  modulesPanelContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },

  vitalsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderBottomWidth: 1,
  },
  vitalsTitle: { fontSize: 14, fontWeight: "700" },
  rightPanelWrapper: {
    width: 218,
    height: 1187,
    backgroundColor: "#0F172A",
    paddingHorizontal: 12,
    paddingBottom: 0,
  },
  //recommended meds
  recommendedMedicineCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 20,
  },

  recommendedMedicineTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },

  recommendedMedicineItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },

  recommendedMedicineText: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },

  recommendedMedicineEmpty: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
});

// ── Calling overlay styles ──
const overlayStyles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5,14,31,0.92)",
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: 300,
    backgroundColor: "#0F2340",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1E3A6A",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.7,
    shadowRadius: 30,
    elevation: 20,
  },
  avatarWrap: { marginBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  name: {
    color: "#F1F5F9",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  status: { color: "#64748B", fontSize: 13, marginTop: 4, marginBottom: 8 },
  endBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  endLabel: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 10,
  },
});
