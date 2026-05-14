// screens/MedicineKitScreen.js
import React, { useMemo, useRef, useState } from "react";
import Pill from "../assets/Images/pill.svg";
import Search from "../assets/Images/Search";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TextInput,
  Modal,
  Animated,
  Image,
  Pressable,
} from "react-native";

import Sidebar from "../components/Sidebar";
import { useTheme } from "../theme/ThemeContext";
import { lightTheme, darkTheme } from "../theme/theme";
import BlueMic from "../assets/Images/bluemic.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MedicineModules from "../components/MedicineModules";

import {
  medicineImages,
  normalizeMedicineName,
} from "../constants/medicineImages";

// ─── Medicine Kit drawn illustration ──────────────────────────────────────────
const MedicineKitIllustration = ({ isDark }) => (
  <View style={kit.wrapper}>
    <View
      style={[kit.handle, { borderColor: isDark ? "#6B7280" : "#90A4AE" }]}
    />
    <View
      style={[
        kit.body,
        {
          borderColor: isDark ? "#6B7280" : "#90A4AE",
          backgroundColor: isDark ? "#1F2937" : "#F5F7F9",
        },
      ]}
    >
      <View style={kit.plusWrap}>
        <View
          style={[
            kit.plusH,
            { backgroundColor: isDark ? "#9CA3AF" : "#90A4AE" },
          ]}
        />
        <View
          style={[
            kit.plusV,
            { backgroundColor: isDark ? "#9CA3AF" : "#90A4AE" },
          ]}
        />
      </View>

      <View
        style={[kit.grid, { borderTopColor: isDark ? "#374151" : "#CFD8DC" }]}
      >
        <View style={kit.row}>
          <View
            style={[
              kit.cell,
              {
                borderRightWidth: 1,
                borderRightColor: isDark ? "#374151" : "#CFD8DC",
                backgroundColor: isDark ? "#111827" : "#ECEFF1",
              },
            ]}
          >
            <Text
              style={[kit.cellText, { color: isDark ? "#9CA3AF" : "#546E7A" }]}
            >
              ESSENTIALS
            </Text>
          </View>

          <View
            style={[
              kit.cell,
              { backgroundColor: isDark ? "#111827" : "#ECEFF1" },
            ]}
          >
            <Text
              style={[kit.cellText, { color: isDark ? "#9CA3AF" : "#546E7A" }]}
            >
              MEDICATIONS-{"\n"}PA
            </Text>
          </View>
        </View>

        <View
          style={[
            kit.row,
            {
              borderTopWidth: 1,
              borderTopColor: isDark ? "#374151" : "#CFD8DC",
            },
          ]}
        >
          <View
            style={[
              kit.cell,
              {
                borderRightWidth: 1,
                borderRightColor: isDark ? "#374151" : "#CFD8DC",
                backgroundColor: isDark ? "#111827" : "#ECEFF1",
              },
            ]}
          >
            <Text
              style={[kit.cellText, { color: isDark ? "#9CA3AF" : "#546E7A" }]}
            >
              AIRWAY
            </Text>
          </View>

          <View
            style={[
              kit.cell,
              { backgroundColor: isDark ? "#111827" : "#ECEFF1" },
            ]}
          >
            <Text
              style={[kit.cellText, { color: isDark ? "#9CA3AF" : "#546E7A" }]}
            >
              CIRCULATION
            </Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

// ─── Custom right panel ───────────────────────────────────────────────────────
const CustomRightPanel = () => {
  const insets = useSafeAreaInsets();
  const topPadding = insets.top + 8;
  const themeCtx = useTheme();
  const isDark = themeCtx?.dark;

  return (
    <View
      style={[
        styles.rightPanel,
        {
          backgroundColor: isDark ? "#0B1D35" : "#fff",
          borderLeftColor: isDark ? "#374151" : "#E8ECF2",
        },
      ]}
    >
      <View
        style={[
          styles.rightPanelContent,
          {
            paddingTop: topPadding,
            backgroundColor: isDark ? "#051429" : "#EBF1FE",
          },
        ]}
      >
        <MedicineKitIllustration isDark={isDark} />
      </View>
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function MedicineKitScreen({ navigation }) {
  const themeCtx = useTheme();
  const isDark = themeCtx?.dark;
  const COLORS = isDark ? darkTheme : lightTheme;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("medical");
  const [showModal, setShowModal] = useState(false);

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const selectedMedicineKey = useMemo(
    () => normalizeMedicineName(selectedMedicine),
    [selectedMedicine]
  );

  const selectedMedicineImage = selectedMedicineKey
    ? medicineImages[selectedMedicineKey]
    : null;

  const openMedicineImage = (medicine) => {
    const medicineName =
      typeof medicine === "string"
        ? medicine
        : medicine?.name || medicine?.medicine || medicine?.title || "";

    const key = normalizeMedicineName(medicineName);

    console.log("Tapped medicine:", medicineName);
    console.log("Normalized key:", key);
    console.log("Mapped image:", medicineImages[key]);

    setSelectedMedicine(medicineName);
    setShowImageModal(true);

    scaleAnim.setValue(0.85);
    opacityAnim.setValue(0);

    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMedicineImage = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowImageModal(false);
      setSelectedMedicine(null);
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: COLORS.lightBg }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={COLORS.lightBg}
      />

      <View style={styles.root}>
        <Sidebar navigation={navigation} activeKey="searchKit" />

        <View
          style={[styles.main, { backgroundColor: COLORS.screenBackground }]}
        >
          <ScrollView
            style={styles.formScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <Text style={[styles.pageTitle, { color: COLORS.textPrimary }]}>
                Find Medicine in Kit
              </Text>

              <View style={styles.topRow}>
                <View
                  style={[
                    styles.tabsContainer,
                    { backgroundColor: isDark ? "#1C2D48" : "#E8EEF9" },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.tabBtn,
                      activeTab === "medical" && {
                        backgroundColor: "#0A5FFF",
                      },
                    ]}
                    onPress={() => setActiveTab("medical")}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        {
                          color:
                            activeTab === "medical"
                              ? "#FFFFFF"
                              : isDark
                              ? "#D2D6DB"
                              : "#1F2024",
                        },
                      ]}
                    >
                      Medical Kit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.tabBtn,
                      activeTab === "digital" && {
                        backgroundColor: "#0A5FFF",
                      },
                    ]}
                    onPress={() => setActiveTab("digital")}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        {
                          color:
                            activeTab === "digital"
                              ? "#FFFFFF"
                              : isDark
                              ? "#D2D6DB"
                              : "#1F2024",
                        },
                      ]}
                    >
                      Digital Kit
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.searchBox,
                    { backgroundColor: isDark ? "#1C2D48" : "#EEF3FF" },
                  ]}
                >
                  <Search />

                  <TextInput
                    placeholder="Search"
                    placeholderTextColor={isDark ? "#8F9098" : "#8F9098"}
                    style={[
                      styles.searchInputNew,
                      { color: isDark ? "#FFFFFF" : "#1F2024" },
                    ]}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />

                  <TouchableOpacity>
                    <BlueMic />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.calcBtn}
                  onPress={() => setShowModal(true)}
                >
                  <Pill width={16} height={16} />
                  <Text style={styles.calcBtnText}>Dosage Calculator</Text>
                </TouchableOpacity>
              </View>

              <MedicineModules
                searchQuery={searchQuery}
                showUsageColumn={true}
                showCheckboxes={false}
                showAddButtons={false}
                onMedicinePress={openMedicineImage}
              />
            </View>
          </ScrollView>
        </View>

        <CustomRightPanel />
      </View>

      {/* Dosage Calculator Modal */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: isDark ? "#16263B" : "#FFFFFF" },
            ]}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: isDark ? "#FFFFFF" : "#171923" },
                  ]}
                >
                  Dosage Calculator
                </Text>
                <Text
                  style={[
                    styles.modalSubtitle,
                    { color: isDark ? "#94A3B8" : "#4B5563" },
                  ]}
                >
                  Calculate Safe Dosage
                </Text>
              </View>

              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons
                  name="close"
                  size={22}
                  color={isDark ? "#FFFFFF" : "#000000"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalRow}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.modalLabel,
                    { color: isDark ? "#CBD5E1" : "#6B7280" },
                  ]}
                >
                  Medication
                </Text>

                <TextInput
                  placeholder="Drug name"
                  placeholderTextColor={isDark ? "#64748B" : "#9CA3AF"}
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: isDark ? "#0F172A" : "#EEF2F7",
                      color: isDark ? "#FFFFFF" : "#111827",
                    },
                  ]}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.modalLabel,
                    { color: isDark ? "#CBD5E1" : "#6B7280" },
                  ]}
                >
                  Weight (kg)
                </Text>

                <TextInput
                  placeholder="85"
                  keyboardType="numeric"
                  placeholderTextColor={isDark ? "#64748B" : "#9CA3AF"}
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: isDark ? "#0F172A" : "#EEF2F7",
                      color: isDark ? "#FFFFFF" : "#111827",
                    },
                  ]}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.calculateBtn}>
              <Text style={styles.calculateBtnText}>Calculate</Text>
            </TouchableOpacity>

            <View
              style={[
                styles.resultBox,
                { backgroundColor: isDark ? "#0F1E32" : "#EEF4FF" },
              ]}
            >
              <Text
                style={[
                  styles.resultLabel,
                  { color: isDark ? "#94A3B8" : "#6B7280" },
                ]}
              >
                Recommended Dosage
              </Text>

              <Text
                style={[
                  styles.resultValue,
                  { color: isDark ? "#FFFFFF" : "#111827" },
                ]}
              >
                10 Mg
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Medicine Image Modal */}
      <Modal transparent visible={showImageModal} animationType="none">
        <Pressable style={styles.imageModalOverlay} onPress={closeMedicineImage}>
          <Animated.View
            style={[
              styles.imageModalCard,
              {
                backgroundColor: isDark ? "#16263B" : "#FFFFFF",
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Pressable onPress={() => {}}>
              <View style={styles.imageModalHeader}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.imageModalTitle,
                      { color: isDark ? "#FFFFFF" : "#111827" },
                    ]}
                    numberOfLines={2}
                  >
                    {selectedMedicine || "Medicine"}
                  </Text>

                  <Text
                    style={[
                      styles.imageModalSub,
                      { color: isDark ? "#94A3B8" : "#6B7280" },
                    ]}
                  >
                    Medicine kit item preview
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={closeMedicineImage}
                  style={[
                    styles.imageCloseBtn,
                    { backgroundColor: isDark ? "#0F172A" : "#EEF2F7" },
                  ]}
                >
                  <MaterialIcons
                    name="close"
                    size={20}
                    color={isDark ? "#FFFFFF" : "#111827"}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.imagePreviewBox,
                  { backgroundColor: isDark ? "#0F172A" : "#F8FAFC" },
                ]}
              >
                {selectedMedicineImage ? (
                  <Image
                    source={selectedMedicineImage}
                    style={styles.medicinePreviewImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.noImageBox}>
                    <MaterialIcons
                      name="image-not-supported"
                      size={42}
                      color={isDark ? "#64748B" : "#94A3B8"}
                    />

                    <Text
                      style={[
                        styles.noImageText,
                        { color: isDark ? "#CBD5E1" : "#475569" },
                      ]}
                    >
                      No image mapped for this item
                    </Text>

                    <Text
                      style={[
                        styles.noImageKeyText,
                        { color: isDark ? "#94A3B8" : "#64748B" },
                      ]}
                    >
                      Key: {selectedMedicineKey || "empty"}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Kit illustration styles ──────────────────────────────────────────────────
const kit = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    transform: [{ scale: 1.25 }],
  },
  handle: {
    width: 52,
    height: 18,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 2.5,
    borderBottomWidth: 0,
    backgroundColor: "transparent",
    marginBottom: -1,
  },
  body: {
    width: 190,
    height: 180,
    borderRadius: 12,
    borderWidth: 2.5,
    overflow: "hidden",
    alignItems: "center",
  },
  plusWrap: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 8,
  },
  plusH: {
    position: "absolute",
    width: 24,
    height: 4,
    borderRadius: 2,
  },
  plusV: {
    position: "absolute",
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  grid: {
    flex: 1,
    width: "100%",
    borderTopWidth: 1,
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    padding: 6,
  },
  cellText: {
    fontSize: 8.5,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 12,
  },
});

// ─── Main styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  root: {
    flex: 1,
    flexDirection: "row",
  },
  main: {
    flex: 1,
  },
  formScroll: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  pageTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 12,
  },
  tabsContainer: {
    flexDirection: "row",
    borderRadius: 30,
    padding: 4,
  },
  tabBtn: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  searchBox: {
    width: 230,
    height: 48,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginLeft: "auto",
    gap: 10,
  },
  searchInputNew: {
    flex: 1,
    fontSize: 13,
  },
  calcBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#0A5FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    gap: 8,
  },
  calcBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  rightPanel: {
    width: 320,
  },
  rightPanelContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    paddingBottom: 20,
    marginTop: 40,
    marginRight: 20,
    marginBottom: 40,
    borderRadius: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: 520,
    borderRadius: 22,
    padding: 28,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  modalSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  modalRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  modalLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  modalInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 13,
  },
  calculateBtn: {
    backgroundColor: "#0A5FFF",
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  calculateBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  resultBox: {
    borderRadius: 16,
    padding: 16,
  },
  resultLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 28,
    fontWeight: "700",
  },

  // Medicine image modal
  imageModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  imageModalCard: {
    width: 460,
    maxWidth: "92%",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  imageModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },
  imageModalTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  imageModalSub: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: "500",
  },
  imageCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePreviewBox: {
    height: 320,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: 16,
  },
  medicinePreviewImage: {
    width: "100%",
    height: "100%",
  },
  noImageBox: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  noImageText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  noImageKeyText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
});