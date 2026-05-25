// screens/AllEventsScreen.js
import React, { useState, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// ADD THESE IMPORTS
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Sidebar from "../components/Sidebar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AssignToPatient from "../assets/Images/assigntothepatient";
// Modals / panels
import RightVitalsPanel from "../components/RightVitalsPanel";
import SpO2Component from "../components/spo2component";
import AssignPhysicianModal from "../components/AssignPhysicianModal";
import ShareModal from "../components/ShareModal";
import PatientToAssign from "../assets/Images/patienttoassign";

// ─── THEME ───────────────────────────────────────────────────
import { lightTheme, darkTheme } from "../theme/theme";

// ─── SVG IMPORTS ─────────────────────────────────────────────
import CalendarIcon from "../assets/Images/calander_icons.svg";
import FilterIcon from "../assets/Images/filter.svg";
import ExportIcon from "../assets/Images/export.svg";
import SearchIcon from "../assets/Images/searchicon.svg";
import Grpdropdown from "../assets/Images/dropdowngrp";
import Blckdropdown from "../assets/Images/dropdownblack";
import EyeIcon from "../assets/Images/eyeicon.svg";
import MedicalIcon from "../assets/Images/medIcon.svg";
import HeartIcon from "../assets/Images/heartvital.svg";
import VideoIcon from "../assets/Images/vid_icon.svg";
import ViewTrendsIcon from "../assets/Images/vital_trends.svg";
import ViewReportIcon from "../assets/Images/view_report.svg";
import ShareReportIcon from "../assets/Images/share_report.svg";
import { useTheme } from "../theme/ThemeContext";

// ─── MENU ITEMS ──────────────────────────────────────────────
const MENU_ITEMS = [
  { label: "View Vital Trends", Icon: ViewTrendsIcon },
  { label: "View report", Icon: ViewReportIcon },
  { label: "Share report", Icon: ShareReportIcon },
];

// ─── COLUMN WIDTHS ───────────────────────────────────────────
const C = {
  checkbox: { width: 36 },
  flight: { flex: 0.8 },
  name: { flex: 1.1 },
  mrn: { flex: 0.9 },
  caseArrival: { flex: 0.9 },
  status: { flex: 0.8 },
  route: { flex: 1.1 },
  physician: { flex: 1.0 },
  crew: { flex: 0.9 },
  actions: { flex: 1.9 },
};
const CASE_ARRIVAL_TIMES = [
  "08:15 AM",
  "08:42 AM",
  "09:05 AM",
  "09:28 AM",
  "10:10 AM",
  "10:45 AM",
  "11:20 AM",
  "12:05 PM",
  "12:40 PM",
  "01:15 PM",
];
// ─── DATA ────────────────────────────────────────────────────
const ROWS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  flight: "AA1234",
  seat: "A15",
  name: "Lisha Cook",
  age: "45y (F)",
  patientId: "NA",
    caseArrival: CASE_ARRIVAL_TIMES[i],
  status: "Critical",
  route: "SYD → LAX",
  physicianStatus: i === 0 ? "assign" : "named",
  physician: "Alex Tobar",
  crew: "Julia R",
}));

// ─── STAT CARD ───────────────────────────────────────────────
const StatCard = ({ icon, SvgIcon, value, label, theme }) => (
  <View
    style={[
      s.statCard,
      {
        backgroundColor: theme.statCardBg,
        borderColor: theme.statCardBorder,
      },
    ]}
  >
    <View style={[s.iconWrapper, { backgroundColor: theme.iconBg }]}>
      {SvgIcon ? (
        <SvgIcon width={22} height={22} />
      ) : icon ? (
        <MaterialCommunityIcons name={icon} size={22} color={theme.statIcon} />
      ) : (
        <View style={s.initialCircle}>
          <Text style={s.initialText}>JO</Text>
        </View>
      )}
    </View>

    <View>
      <Text style={[s.statValue, { color: theme.statValue }]}>{value}</Text>
      <Text style={[s.statLabel, { color: theme.statLabel }]}>{label}</Text>
    </View>
  </View>
);

// ─── SVG ACTION BUTTON ───────────────────────────────────────
// Uses theme.actBtnIcon for all row action icons (#D2D6DB in dark mode)
const SvgActionBtn = ({ SvgIcon, onPress, theme }) => (
  <TouchableOpacity
    style={[s.actBtn, { backgroundColor: theme.actBtnBg }]}
    onPress={onPress}
  >
    <View pointerEvents="none">
      <SvgIcon width={20} height={20} color={theme.actBtnIcon} />
    </View>
  </TouchableOpacity>
);

// ─── THREE-DOT POPUP MENU ────────────────────────────────────
const ThreeDotMenu = ({ onViewTrends, onShare, onViewReport, theme }) => {
  const [visible, setVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const btnRef = useRef(null);

  const openMenu = () => {
    btnRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPos({ x: x - 160 + width + 20, y: y + height + 4 });
      setVisible(true);
    });
  };

  const handlePress = (item) => {
    setVisible(false);
    if (item.label === "View Vital Trends") onViewTrends?.();
    if (item.label === "Share report") onShare?.();
    if (item.label === "View report") onViewReport?.();
  };

  return (
    <>
      {/* More-vert dot button — uses actBtnIcon (#D2D6DB dark) */}
      <TouchableOpacity
        ref={btnRef}
        style={[
          s.actBtn,
          { backgroundColor: theme.actBtnBg, borderColor: theme.actBtnBorder },
        ]}
        onPress={openMenu}
      >
        <MaterialIcons name="more-vert" size={18} color={theme.actBtnIcon} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="none">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={s.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  s.menuCard,
                  {
                    top: menuPos.y,
                    left: menuPos.x,
                    transform: [{ translateX: -90 }],
                    backgroundColor: theme.menuBg,
                    borderColor: theme.menuBorder,
                    shadowColor: theme.menuShadow,
                  },
                ]}
              >
                {MENU_ITEMS.map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    style={s.menuItem}
                    onPress={() => handlePress(item)}
                  >
                    {/* Menu popup icons — theme.menuIconColor (#01B3E6 dark) */}
                    <item.Icon
                      width={18}
                      height={18}
                      color={theme.menuIconColor}
                    />
                    <Text
                      style={[s.menuLabel, { color: theme.menuLabelColor }]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

// ─── TABLE HEADER ────────────────────────────────────────────
const TableHeader = ({ selectAll, onToggleAll, theme, checkboxColor }) => (
  <View
    style={[
      s.headerRow,
      { backgroundColor: theme.tableHeaderBg, borderColor: theme.borderColor },
    ]}
  >
    <TouchableOpacity style={s.checkCell} onPress={onToggleAll}>
      <View
        style={[
          s.checkbox,
          { borderColor: checkboxColor },
          selectAll && s.checkboxOn,
        ]}
      >
        {selectAll && <MaterialIcons name="check" size={10} color="#fff" />}
      </View>
    </TouchableOpacity>

    <Text
      style={[
        s.hCell,
        C.flight,
        {
          color: theme.textHeader,
          borderRightWidth: 1,
          borderRightColor: theme.borderColor,
        },
      ]}
    >
      {"Flight #\nSeat"}
    </Text>
    <Text
      style={[
        s.hCell,
        C.name,
        s.headerCol,
        { color: theme.textHeader, borderRightColor: theme.borderColor },
      ]}
    >
      {"Name\nAge (Gender)"}
    </Text>
    <Text
      style={[
        s.hCell,
        C.mrn,
        s.headerCol,
        s.patientIdHeader,
        { color: theme.textHeader, borderRightColor: theme.borderColor },
      ]}
    >
      {"Patient ID"}
    </Text>
    <Text
  style={[
    s.hCell,
    C.caseArrival,
    s.headerCol,
    {
      color: theme.textHeader,
      borderRightColor: theme.borderColor,
    },
  ]}
>
  {"Case\nArrival"}
</Text>
    <View
      style={[
        s.hSortCell,
        C.status,
        s.headerCol,
        {
          borderRightColor: theme.borderColor,
        },
      ]}
    >
      <Text style={[s.hTxt, { color: theme.textHeader }]}>Status</Text>
      <View style={s.drpdwnIcon}>
        <Grpdropdown color={theme.dropdownIcon} />
      </View>
    </View>
    <View
      style={[
        s.hSortCell,
        C.route,
        s.headerCol,
        { borderRightColor: theme.borderColor },
      ]}
    >
      <Text style={[s.hTxt, { color: theme.textHeader }]}>Flight Route</Text>
      <View style={{ marginLeft: 8, marginTop: 5 }}>
        <Blckdropdown color={theme.dropdownIcon} />
      </View>
    </View>
    <View
      style={[
        s.hSortCell,
        C.physician,
        s.headerCol,
        { borderRightColor: theme.borderColor },
      ]}
    >
      <Text style={[s.hTxt, { color: theme.textHeader }]}>Physician</Text>
      <View style={{ marginLeft: 8, marginTop: 5 }}>
        <Blckdropdown color={theme.dropdownIcon} />
      </View>
    </View>
    <View
      style={[
        s.hSortCell,
        C.crew,
        s.headerCol,
        { borderRightColor: theme.borderColor },
      ]}
    >
      <Text style={[s.hTxt, { color: theme.textHeader }]}>Crew</Text>
      <View style={{ marginLeft: 8, marginTop: 5 }}>
        <Blckdropdown color={theme.dropdownIcon} />
      </View>
    </View>
    <Text style={[s.hCell, C.actions, { color: theme.textHeader }]}>
      Actions
    </Text>
  </View>
);

// ─── TABLE ROW ───────────────────────────────────────────────
const TableRow = ({
  row,
  index,
  selected,
  onToggle,
  onOpenVitals,
  onAssignPress,
  onSharePress,
  onNamePress,
  onECGPress,
  theme,
  navigation,
  checkboxColor,
}) => (
  <View
    style={[
      s.row,
      { backgroundColor: theme.rowBg, borderColor: theme.rowBorderColor },
    ]}
  >
    <TouchableOpacity style={s.checkCell} onPress={() => onToggle(row.id)}>
      <View
        style={[
          s.checkbox,
          { borderColor: checkboxColor },
          selected && s.checkboxOn,
        ]}
      >
        {selected && <MaterialIcons name="check" size={10} color="#fff" />}
      </View>
    </TouchableOpacity>

    <Text
      style={[s.dCell, C.flight, { color: theme.textPrimary }]}
      numberOfLines={2}
    >
      {row.flight}
      {"\n"}
      <Text style={[s.subTxt, { color: theme.textSecondary }]}>{row.seat}</Text>
    </Text>

    <TouchableOpacity style={C.name} activeOpacity={0.7} onPress={onNamePress}>
      <Text style={[s.dCell, { color: theme.textPrimary }]} numberOfLines={2}>
        {row.name}
        {"\n"}
        <Text style={[s.subTxt, { color: theme.textSecondary }]}>
          {row.age}
        </Text>
      </Text>
    </TouchableOpacity>

    <Text
      style={[s.dCell, C.mrn, { color: theme.textPrimary }]}
      numberOfLines={1}
    >
      <Text style={[s.subTxt, { color: theme.textPrimary }]}>
        {"ID: " + row.patientId}
      </Text>
    </Text>

    <Text
  style={[s.dCell, C.caseArrival, { color: theme.textPrimary }]}
  numberOfLines={1}
>
  {row.caseArrival}
</Text>

    <Text
      style={[s.dCell, s.statusTxt, C.status, { color: theme.textPrimary }]}
      numberOfLines={1}
    >
      {row.status}
    </Text>

    <Text
      style={[s.dCell, C.route, { color: theme.textPrimary }]}
      numberOfLines={1}
    >
      {row.route}
    </Text>

    {/* Physician badge */}
    <View style={[s.badgeCell, C.physician]}>
      <TouchableOpacity onPress={onAssignPress}>
        {row.physicianStatus === "assign" ? (
          <View
            style={[s.badgeYellow, { backgroundColor: theme.badgeYellowBg }]}
          >
            <Text style={[s.badgeTxt, { color: theme.badgeTxtAssign }]}>
              Assign
            </Text>
          </View>
        ) : (
          <View style={[s.badgeGreen, { backgroundColor: theme.badgeGreenBg }]}>
            <Text style={[s.badgeTxt, { color: theme.badgeTxt }]}>
              {row.physician}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>

    {/* Crew badge — theme.badgeBlueBg (#0E5648 dark) */}
    <View style={[s.badgeCell, C.crew]}>
      <View style={[s.badgeBlue, { backgroundColor: theme.badgeBlueBg }]}>
        <Text style={[s.badgeTxt, { color: theme.badgeTxt }]}>{row.crew}</Text>
      </View>
    </View>

    {/* Action buttons */}
    <View style={[s.actionsCell, C.actions]}>
      <SvgActionBtn SvgIcon={EyeIcon} theme={theme} />
      <SvgActionBtn
        SvgIcon={MedicalIcon}
        theme={theme}
        onPress={() => onOpenVitals?.(row, false)}
      />
      <SvgActionBtn SvgIcon={HeartIcon} theme={theme} onPress={onECGPress} />
      <SvgActionBtn SvgIcon={VideoIcon} theme={theme} />
      <ThreeDotMenu
        theme={theme}
        onViewTrends={() => onOpenVitals(row, true)}
        onShare={() => onSharePress(row)}
        onViewReport={() =>
          navigation.navigate("CaseOutcomeScreen", { patient: row })
        }
      />
    </View>
  </View>
);

// ─── MAIN SCREEN ─────────────────────────────────────────────
const formatDateLabel = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function EventsScreenTable({ navigation }) {
  const insets = useSafeAreaInsets();
  
  // const [isDark, setIsDark] = useState(false);
  // const theme = isDark ? darkTheme : lightTheme;
  const themeCtx = useTheme();
  const theme = themeCtx?.theme;
  const isDark = themeCtx?.dark;
  const checkboxColor = isDark ? "#C5C6CC" : "#9CA3AF";
  const [selected, setSelected] = useState({});

  const [selectAll, setSelectAll] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showTrends, setShowTrends] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [rows, setRows] = useState(ROWS);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);

  const patientInfo = {
    name: "John Smith",
    age: "58 M",
    flight: "AA1234",
    route: "SYD → LAX",
  };

  const toggleRow = (id) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    const map = {};
    ROWS.forEach((r) => (map[r.id] = next));
    setSelected(map);
  };

  const openAssignModal = (row) => {
    setSelectedRowId(row.id);
    setShowAssignModal(true);
  };

  const handleAssignDoctor = (doctor) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === selectedRowId
          ? { ...row, physician: doctor.name, physicianStatus: "named" }
          : row,
      ),
    );
  };

  const onSharePress = (row) => setShowShareModal(true);

  const openVitalsPanel = (row, isTrends = false) => {
    setSelectedPatient(row);
    setShowPanel(true);
    setShowTrends(isTrends);
  };

  const closePanel = () => {
    setShowPanel(false);
    setShowTrends(false);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.screenBg }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#0B1525" : "#1565C0"}
      />

      <View style={[s.root, { backgroundColor: theme.screenBg }]}>
        <Sidebar navigation={navigation} activeKey="allEvents" />

        {/* MAIN + PANEL WRAPPER */}
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={[s.main, { backgroundColor: theme.mainBg }]}>
            {/* ── TOP STATS ── */}
            <View style={s.top}>
              <View style={[s.greet, { backgroundColor: theme.greetBg }]}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View style={s.initialCircle}>
                    <Text style={s.initialText}>JO</Text>
                  </View>
                  <View>
                    <Text style={[s.g1, { color: theme.greetTitle }]}>
                      Good morning 🌤
                    </Text>
                    <Text style={[s.g2, { color: theme.greetName }]}>
                      Dr. James Oktar
                    </Text>
                    <Text style={[s.g3, { color: theme.greetSub }]}>
                      MD - Neurology
                    </Text>
                  </View>
                </View>
              </View>

              <StatCard
                icon="calendar-month-outline"
                value="XX"
                label="Events today"
                theme={theme}
              />
              <StatCard
                icon="account-outline"
                value="XX/XX"
                label="Patients to see"
                theme={theme}
              />
              <StatCard
                SvgIcon={PatientToAssign}
                value="12"
                label="Patients Assigned"
                theme={theme}
              />
              <StatCard
                icon="file-plus-outline"
                value="XX"
                label="Critical Cases"
                theme={theme}
              />
            </View>

            {/* ── SEARCH ROW ── */}
            <View style={s.searchRow}>
              {/* Date picker — calendar icon uses theme.calendarIconColor */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  s.dateBox,
                  {
                    backgroundColor: theme.dateBg,
                    borderColor: theme.dateBorder,
                  },
                ]}
                onPress={() => setShowCalendar(true)}
              >
                <MaterialIcons
                  name="chevron-left"
                  size={24}
                  color={theme.dateChevron}
                />

                <CalendarIcon
                  width={14}
                  height={14}
                  color={theme.calendarIconColor}
                />

                <Text style={[s.dateText, { color: theme.dateText }]}>
                  {formatDateLabel(selectedDate)}
                </Text>

                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={theme.dateChevron}
                />
              </TouchableOpacity>

              {/* Search box — search icon uses theme.searchIconColor */}
              <View
                style={[
                  s.searchBox,
                  {
                    backgroundColor: theme.searchBg,
                    borderColor: theme.searchBorder,
                  },
                ]}
              >
                <SearchIcon
                  width={16}
                  height={16}
                  color={theme.searchIconColor}
                />
                <TextInput
                  placeholder="Search flight route, patients by name or MRN..."
                  placeholderTextColor={theme.placeholderText}
                  style={[s.searchInput, { color: theme.searchText }]}
                />
              </View>

              <View style={s.rightBtns}>
                <TouchableOpacity
                  style={[
                    s.outlineBtn,
                    {
                      borderColor: theme.outlineBtnBorder,
                      backgroundColor: theme.outlineBtnBg,
                    },
                  ]}
                >
                  <FilterIcon
                    width={18}
                    height={18}
                    color={theme.outlineBtnIcon}
                  />
                  <Text style={[s.btnText, { color: theme.outlineBtnText }]}>
                    Filter
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    s.outlineBtn,
                    {
                      borderColor: theme.outlineBtnBorder,
                      backgroundColor: theme.outlineBtnBg,
                    },
                  ]}
                >
                  <ExportIcon
                    width={14}
                    height={14}
                    color={theme.outlineBtnIcon}
                  />
                  <Text style={[s.btnText, { color: theme.outlineBtnText }]}>
                    Export
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Modal
  visible={showCalendar}
  transparent
  animationType="fade"
  onRequestClose={() => setShowCalendar(false)}
>
  <TouchableWithoutFeedback onPress={() => setShowCalendar(false)}>
    <View style={s.calendarOverlay}>
      <TouchableWithoutFeedback>
        <View
          style={[
            s.calendarCard,
            {
              backgroundColor: isDark ? "#0B1525" : "#FFFFFF",
              borderColor: theme.borderColor,
            },
          ]}
        >
          <Calendar
            current={selectedDate}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: "#2563EB",
                selectedTextColor: "#FFFFFF",
              },
            }}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setShowCalendar(false);
            }}
            theme={{
              calendarBackground: isDark ? "#0B1525" : "#FFFFFF",
              dayTextColor: isDark ? "#FFFFFF" : "#111827",
              monthTextColor: isDark ? "#FFFFFF" : "#111827",
              textSectionTitleColor: isDark ? "#C5C6CC" : "#6B7280",
              selectedDayBackgroundColor: "#2563EB",
              selectedDayTextColor: "#FFFFFF",
              todayTextColor: "#2563EB",
              arrowColor: "#2563EB",
              textDisabledColor: isDark ? "#4B5563" : "#D1D5DB",
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>

            {/* ── TABLE ── */}
            <View
              style={[
                s.tableWrapper,
                {
                  backgroundColor: theme.cardBg,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              <TableHeader
                selectAll={selectAll}
                onToggleAll={toggleAll}
                theme={theme}
                checkboxColor={checkboxColor}
              />
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
              >
                {rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    row={row}
                    index={index}
                    selected={!!selected[row.id]}
                    onToggle={toggleRow}
                    onOpenVitals={openVitalsPanel}
                    onAssignPress={() => openAssignModal(row)}
                    onSharePress={onSharePress}
                    onNamePress={() =>
                      navigation.navigate("CaseDetail", {
                        patient: row,
                        physicianAssigned: row.physicianStatus === "named",
                      })
                    }
                    onECGPress={() => navigation.navigate("ECGScreen")}
                    theme={theme}
                    checkboxColor={checkboxColor}
                    navigation={navigation}
                  />
                ))}
              </ScrollView>
            </View>

            {/* ── RIGHT PANEL OVERLAY ── */}
            {showPanel && (
              <View style={s.overlayContainer}>
                <TouchableWithoutFeedback onPress={closePanel}>
                  <View style={s.overlayBackdrop} />
                </TouchableWithoutFeedback>

                <View
                  style={[
                    s.rightPanel,
                    { backgroundColor: isDark ? "#0B1525" : "#1B1C3A" },
                  ]}
                >
                  {showTrends ? (
                    <SpO2Component
                      patientInfo={patientInfo}
                      onClose={closePanel}
                      showTitle={false}
                      theme={theme}
                    />
                  ) : (
                    <RightVitalsPanel
                      showHeader
                      showTrendsButton={false}
                      patientInfo={{
                        name: selectedPatient?.name,
                        age: selectedPatient?.age,
                        gender: "M",
                        flight: selectedPatient?.flight,
                        route: selectedPatient?.route,
                      }}
                      onClose={closePanel}
                      theme={theme}
                    />
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </View>

      <AssignPhysicianModal
        visible={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignDoctor}
        theme={theme}
      />

      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        theme={theme}
      />
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1 },
  root: { flex: 1, flexDirection: "row" },
  main: { flex: 1, minWidth: 0, flexDirection: "column" },
calendarOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.45)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 20,
},

calendarCard: {
  width: 340,
  borderRadius: 16,
  borderWidth: 1,
  overflow: "hidden",
  padding: 8,
  elevation: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.25,
  shadowRadius: 12,
},
  // ── TOP ──
  top: { flexDirection: "row", gap: 5, padding: 20, alignItems: "stretch" },
  greet: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: "center",
    minWidth: 150,
    height: 88,
    width: 215,
    marginRight: 8,
    marginLeft: 10,
  },
  g1: { fontSize: 11, fontWeight: "500" },
  g2: { fontSize: 13, fontWeight: "500", marginTop: 2 },
  g3: { fontSize: 11, marginTop: 1, fontWeight: "400" },

  initialCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#69b6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  initialText: { fontSize: 12, fontWeight: "700", color: "#FFFFFF" },

  // ── STAT CARD ──
  statCard: {
    flex: 1,
    paddingRight: 12,
    paddingLeft: 12,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 88,
    width: 217,
    marginRight: 8,
  },
  statValue: { fontWeight: "700", fontSize: 15 },
  statLabel: { fontSize: 11, marginTop: 1, fontWeight: "700" },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  // ── SEARCH ROW ──
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 2,
    marginLeft: 17,
  },
  dateText: { fontSize: 12, fontWeight: "500" },
  searchBox: {
    flex: 0.5,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 43,
    gap: 8,
    marginHorizontal: 10,
  },
  searchInput: { flex: 1, minWidth: 0, fontSize: 12, padding: 0 },
  rightBtns: { flexDirection: "row", gap: 8, position: "relative", left: 369 },
  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  btnText: { fontSize: 12, fontWeight: "600" },

  // ── TABLE ──
  tableWrapper: {
    flex: 1,
    marginHorizontal: 30,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    marginTop: 15,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 5,
    alignItems: "center",
  },
  hCell: {
    paddingHorizontal: 8,
    fontWeight: "700",
    fontSize: 11,
    lineHeight: 16,
  },
  patientIdHeader: {
    paddingVertical: 12,
    textAlign: "left",
  },
  hSortCell: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 1,
  },
  headerCol: {
    height: "100%", // 🔥 FULL HEIGHT
    justifyContent: "center",
    borderRightWidth: 1,
  },
  hTxt: { fontWeight: "700", fontSize: 12, marginLeft: -6 },

  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  dCell: {
    paddingHorizontal: 8,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "590",
  },
  subTxt: { fontSize: 10 },
  statusTxt: { fontWeight: "400", fontSize: 12 },
  drpdwnIcon: { marginLeft: 10 },
  badgeCell: { paddingHorizontal: 8, justifyContent: "center" },
  actionsCell: {
    paddingHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  // ── CHECKBOX ──
  checkCell: { width: 36, alignItems: "center", justifyContent: "center" },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: "#2563EB", borderColor: "#2563EB" },

  // ── BADGES ──
  badgeGreen: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    justifyContent: "flex-start",
    width: 95,
  },
  badgeBlue: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    justifyContent: "flex-start",
    width: 95,
  },
  badgeYellow: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    justifyContent: "flex-start",
    width: 95,
  },
  badgeTxt: { fontSize: 10, fontWeight: "500" },

  // ── ACTION BUTTON ──
  actBtn: {
    borderWidth: 0,
    paddingHorizontal: 9,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: -2,
  },

  // ── THREE-DOT MENU ──
  modalOverlay: { flex: 1, backgroundColor: "transparent" },
  menuCard: {
    position: "absolute",
    borderRadius: 12,
    paddingVertical: 6,
    minWidth: 210,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 16,
    gap: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  menuLabel: { fontSize: 12, fontWeight: "450" },

  // ── RIGHT PANEL OVERLAY ──
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 2000,
  },
  overlayBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  rightPanel: {
    width: 270,
    padding: 16,
    elevation: 20,
  },
});
