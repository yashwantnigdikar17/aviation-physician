// screens/AllEventsScreen.js – Fully working with imported Sidebar
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, SafeAreaView, FlatList, TextInput,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Sidebar from '../components/Sidebar'; // Import Sidebar from components

// ── Vital icon config ─────────────────────────────────────────────────
const VITAL_ICON_CONFIG = {
  'Heart Rate':       { lib: 'MI',  name: 'favorite-border' },
  'Blood Pressure':   { lib: 'MCI', name: 'radiobox-marked' },
  'Oxygen':           { lib: 'MI',  name: 'air' },
  'Respiratory Rate': { lib: 'MCI', name: 'arrow-top-right-thin-circle-outline' },
  'Temperature':      { lib: 'MI',  name: 'thermostat' },
};

const VitalIcon = ({ label, color, size = 13 }) => {
  const cfg = VITAL_ICON_CONFIG[label];
  if (!cfg) return null;
  if (cfg.lib === 'MI') {
    return <MaterialIcons name={cfg.name} size={size} color={color} />;
  }
  return <MaterialCommunityIcons name={cfg.name} size={size} color={color} />;
};

// ── Data ──────────────────────────────────────────────────────────────
const EVENTS = Array(5).fill(null).map((_, i) => ({
  id: String(i + 1),
  patient: 'John Smith, 58 M',
  flight: 'Flight AA1234 SYD → LAX , Boeing 787-9',
  physician: 'Dr. Sarah Johnson',
  complaint: 'Chest tightness, shortness of breath, mild dizziness onset',
  duration: '18mins',
  vitals: [
    { label: 'Heart Rate',       value: '88',     unit: 'bpm',  warning: false },
    { label: 'Blood Pressure',   value: '135/85', unit: 'mmHg', warning: false },
    { label: 'Oxygen',           value: '80',     unit: '%',    warning: true  },
    { label: 'Respiratory Rate', value: '24',     unit: '/Min', warning: true  },
    { label: 'Temperature',      value: '34.5',   unit: '°C',   warning: true  },
  ],
}));

// ── TopBar ────────────────────────────────────────────────────────────
const TopBar = () => (
  <View style={styles.topBar}>
    <Text style={styles.pageTitle}>All Events</Text>
    <View style={{ flex: 1 }} />
    <TouchableOpacity style={styles.topFilterBtn} activeOpacity={0.7}>
      <Text style={styles.topFilterText}>Critical patients</Text>
      <MaterialIcons name="keyboard-arrow-down" size={14} color="#333" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.topFilterBtn} activeOpacity={0.7}>
      <Text style={styles.topFilterText}>Dr. Johnson</Text>
      <MaterialIcons name="keyboard-arrow-down" size={14} color="#333" />
    </TouchableOpacity>
    <View style={styles.searchBox}>
      <MaterialIcons name="search" size={14} color="#9AA5B4" />
      <TextInput
        style={styles.searchInput}
        placeholder="Flight no./route"
        placeholderTextColor="#9AA5B4"
      />
    </View>
    <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
      <MaterialIcons name="notifications-none" size={18} color="#333" />
    </TouchableOpacity>
  </View>
);

// ── VitalBox ──────────────────────────────────────────────────────────
const VitalBox = ({ label, value, unit, warning }) => {
  const iconColor = warning ? '#E53935' : '#AAA';
  return (
    <View style={[styles.vitalBox, warning && styles.vitalBoxWarn]}>
      <View style={styles.vitalTopRow}>
        <Text style={styles.vitalBoxLabel}>{label}</Text>
        <VitalIcon label={label} color={iconColor} size={13} />
      </View>
      <Text style={[styles.vitalBoxValue, warning && styles.vitalBoxValueWarn]}>
        {value} <Text style={styles.vitalBoxUnit}>{unit}</Text>
      </Text>
    </View>
  );
};

// ── EventCard ── (FIXED: now accepts navigation prop and navigates correctly)
const EventCard = ({ navigation, patient, flight, physician, complaint, duration, vitals }) => (
  <View style={styles.card}>
    <View style={styles.cardInner}>
      {/* Row 1 */}
      <View style={styles.cardRow1}>
        <Text style={styles.cardPatient}>{patient}</Text>
        <Text style={styles.cardFlight}>  {flight}</Text>
        <View style={{ flex: 1 }} />
        <Text style={styles.physicianLabel}>
          Physician: <Text style={styles.physicianName}>{physician}</Text>
        </Text>
        <View style={styles.criticalTag}>
          <View style={styles.criticalCircle}>
            <Text style={styles.criticalExcl}>!</Text>
          </View>
          <Text style={styles.criticalText}>CRITICAL</Text>
        </View>
        <TouchableOpacity
          style={styles.viewCaseRow}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('CaseDetail', {
            event: { patient, flight, physician, complaint, duration, vitals }
          })}
        >
          <Text style={styles.viewCaseText}>View Case</Text>
          <MaterialIcons name="arrow-forward" size={12} color="#1565C0" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* Row 2 */}
      <View style={styles.cardRow2}>
        <View style={styles.complaintCol}>
          <Text style={styles.complaintLabel}>Chief Complaint:</Text>
          <Text style={styles.complaintText}>{complaint}</Text>
        </View>
        <View style={styles.durationCol}>
          <Text style={styles.durationLabel}>Duration</Text>
          <Text style={styles.durationValue}>{duration}</Text>
        </View>
        {vitals.map((v, i) => <VitalBox key={i} {...v} />)}
      </View>
    </View>
  </View>
);

// ── Screen ────────────────────────────────────────────────────────────
export default function AllEventsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FA" />
      <View style={styles.root}>
        <Sidebar navigation={navigation} activeKey="allEvents" />
        <View style={styles.main}>
          <TopBar />
          <FlatList
            data={EVENTS}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <EventCard navigation={navigation} {...item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F6FA' },
  root: { flex: 1, flexDirection: 'row' },

 topBar: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingHorizontal: 14,
  paddingVertical: 10,
  gap: 8,
},
  pageTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  topFilterBtn: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D8DEE9',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#fff', gap: 3,
  },
  topFilterText: { fontSize: 10, color: '#333', fontWeight: '500' },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D8DEE9',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#fff',
    gap: 4, minWidth: 130,
  },
  searchInput: { fontSize: 10, color: '#333', padding: 0, margin: 0, flex: 1 },
  bellBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F4F6FA', alignItems: 'center', justifyContent: 'center' },

  main: { flex: 1, backgroundColor: '#FFF' },
  listContent: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 20 },

  card: {
  backgroundColor: '#F4F6FA',
  borderRadius: 10,
  elevation: 1,
  shadowColor: '#000',
  shadowOpacity: 0.04,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 1 },
  overflow: 'hidden',
  height: 120, // 👈 increase this value
},
  cardInner: { paddingHorizontal: 12, paddingVertical: 10 },
  cardRow1: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'nowrap' },
  cardPatient: { fontSize: 12, fontWeight: '700', color: '#111' },
  cardFlight: { fontSize: 11, color: '#555', fontWeight: '500' },
  physicianLabel: { fontSize: 11, color: '#666' },
  physicianName: { fontWeight: '700', color: '#222' },
  criticalTag: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F0',
    borderRadius: 15, borderWidth: 1, borderColor: '#FFCDD2',
    paddingHorizontal: 7, paddingVertical: 3, gap: 3,
  },
  criticalCircle: { width: 13, height: 13, borderRadius: 8, backgroundColor: '#E53935', alignItems: 'center', justifyContent: 'center' },
  criticalExcl: { color: '#fff', fontSize: 8, fontWeight: '900', lineHeight: 12 },
  criticalText: { color: '#E53935', fontSize: 10, fontWeight: '600' },
  viewCaseRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewCaseText: { color: '#1565C0', fontSize: 10, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#F0F2F5', marginVertical: 8 },
  cardRow2: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  complaintCol: { flex: 1, minWidth: 120 },
  complaintLabel: { fontSize: 8, color: '#999', marginBottom: 2 },
  complaintText: { fontSize: 10, color: '#222', fontWeight: '600', lineHeight: 14 },
  durationCol: { width: 48 },
  durationLabel: { fontSize: 7, color: '#999', marginBottom: 2 },
  durationValue: { fontSize: 10, fontWeight: '700', color: '#222' },

  vitalBox: {
    backgroundColor: '#F8F9FB', borderRadius: 10, borderWidth: 1, borderColor: '#E4E8F0',
    paddingHorizontal: 8, paddingVertical: 6, width: 95, height: 52, justifyContent: 'center',
  },
  vitalBoxWarn: { borderColor: '#FFCDD2', backgroundColor: '#FFF5F5' },
  vitalTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  vitalBoxLabel: { fontSize: 6, color: '#999', flex: 1 },
  vitalBoxValue: { fontSize: 11, fontWeight: '700', color: '#111' },
  vitalBoxValueWarn: { color: '#E53935' },
  vitalBoxUnit: { fontSize: 7, fontWeight: '400', color: '#888' },
});