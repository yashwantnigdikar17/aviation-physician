
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import Sidebar from '../components/Sidebar';
import RightVitalsPanel from '../components/RightVitalsPanel';

// ─────────────────────────────────────────────
// KIT CONTENTS
// ─────────────────────────────────────────────
const KitContents = () => (
  <View style={styles.kitPanel}>
    <View style={styles.kitHeader}>
      <MaterialIcons name="auto-awesome" size={14} color="#F59E0B" />
      <Text style={styles.kitTitle}>Kit Contents</Text>
    </View>
    <Text style={styles.kitSubtitle}>Medicine and equipment in Stock</Text>

    <Text style={styles.kitSectionLabel}>Essential</Text>
    <View style={styles.kitEssentialRow}>
      <View style={styles.kitEssentialItem}>
        <MaterialIcons name="flashlight-on" size={13} color="#F59E0B" />
        <Text style={styles.kitEssentialText}>Pen Torch</Text>
      </View>
      <View style={styles.kitEssentialItem}>
        <MaterialCommunityIcons name="pulse" size={13} color="#E53935" />
        <Text style={styles.kitEssentialText}>Pulse Ox</Text>
      </View>
    </View>

    <Text style={styles.kitSectionLabel}>Medication</Text>

    <View style={styles.medicationCard}>
      <View style={styles.medAvatar}>
        <Text style={styles.medAvatarText}>M</Text>
      </View>
      <View>
        <Text style={styles.medName}>Atropine</Text>
        <Text style={styles.medDetail}>600mcg /ml  ampoule</Text>
      </View>
    </View>

    <View style={styles.medicationRow}>
      <View style={styles.medDot} />
      <Text style={styles.medicationRowText}>Aspirin 300 mg tablets</Text>
    </View>

    <TouchableOpacity style={styles.findMedBtn} activeOpacity={0.8}>
      <Text style={styles.findMedBtnText}>Find Medicine in Kit</Text>
    </TouchableOpacity>
  </View>
);

// ─────────────────────────────────────────────
// INSTRUCTION CARDS
// ─────────────────────────────────────────────
const INSTRUCTIONS = [
  { icon: 'airline-seat-flat', title: 'Lay the passenger flat', desc: 'Rest the passenger on the floor —\nnot seated',  color: '#1565C0', bg: '#EBF2FF' },
  { icon: 'arrow-downward',    title: 'Gently lower to floor',  desc: 'Support head & neck.\nDo NOT leave seated.',      color: '#F59E0B', bg: '#EBF2FF' },
  { icon: 'accessibility',     title: 'Raise legs 30–45 cm',    desc: 'Use a bag, pillow, or rolled\nblanket.',          color: '#F59E0B', bg: '#EBF2FF' },
  { icon: 'checkroom',         title: 'Loosen tight clothing',  desc: 'Collar, belt, tie — let blood\nflow freely.',    color: '#1565C0', bg: '#EBF2FF' },
];

const InstructionCard = ({ icon, title, desc, color, bg }) => (
  <View style={[styles.instrCard, { backgroundColor: bg }]}>
    <View style={[styles.instrIconWrap, { backgroundColor: color + '20' }]}>
      <MaterialIcons name={icon} size={16} color={color} />
    </View>
    <Text style={styles.instrTitle}>{title}</Text>
    <Text style={styles.instrDesc}>{desc}</Text>
  </View>
);

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────
export default function CaseDetailScreen({ navigation }) {
  
  const [message, setMessage] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.root}>

        {/* ── Sidebar ── */}
        <Sidebar activeKey="medicines" navigation={navigation} />

        {/* ── Everything right of sidebar ── */}
        <View style={styles.mainContent}>

          {/* ── Patient Header ── */}
          <View style={styles.patientHeader}>
            <View style={styles.patientAvatar}>
              <MaterialIcons name="person" size={26} color="#999" />
            </View>
            <View>
              <Text style={styles.patientName}>John Smith, 58 M</Text>
              <Text style={styles.patientFlight}>Flight AA1234, SYD → LAX</Text>
            </View>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
  style={styles.joinNowBtn}
  activeOpacity={0.8}
  onPress={() =>
    navigation.navigate('Meeting', {
      roomId: 'test123',
      userName: 'Sakshi',
    })
  }
>
              <MaterialIcons name="videocam" size={14} color="#fff" />
              <Text style={styles.joinNowText}>Join Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.8}>
              <MaterialIcons name="notifications-none" size={18} color="#555" />
            </TouchableOpacity>
            </View>
          {/* ── 3-Column Body ── */}
          <View style={styles.body}>

            {/* ── LEFT: Scroll content + input ── */}
            <View style={styles.leftPanel}>
              <ScrollView
                style={styles.chatScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
              >
                {/* Chief Complaint Card */}
                <View style={styles.card}>
                  <Text style={styles.cardSectionLabel}>Chief Complaint</Text>
                  <Text style={styles.cardBodyText}>
                    Chest tightness, shortness of breath, mild dizziness onset
                  </Text>
                  <TouchableOpacity style={styles.viewMoreRow}>
                    <Text style={styles.viewMoreText}>View more</Text>
                    <MaterialIcons name="add" size={14} color="#1565C0" />
                  </TouchableOpacity>
                </View>

                {/* Patient Avatar Bubble */}
                <View style={styles.patientAvatarBubble}>
                  <View style={styles.patientAvatarCircle}>
                    <MaterialIcons name="person" size={32} color="#999" />
                  </View>
                </View>

                {/* Instructions Card */}
                <View style={styles.card}>
                  <Text style={styles.cardSectionLabel}>Instructions</Text>
                  <View style={styles.pathwayHeader}>
                    <Text style={styles.pathwayTitle}>Pathway A </Text>
                    <View style={styles.pathwayBadge}>
                      <Text style={styles.pathwayBadgeText}>• Vasovagal</Text>
                    </View>
                  </View>
                  <Text style={styles.pathwaySubtitle}>
                    Below instructions will go to Crew for guidance
                  </Text>
                  <View style={styles.instrGrid}>
                    {INSTRUCTIONS.map((instr, i) => (
                      <InstructionCard key={i} {...instr} />
                    ))}
                  </View>
                  <Text style={styles.instrFooter}>
                    Dr. Sarah Johnson • 14/03/2026 • 14:28
                  </Text>
                </View>
              </ScrollView>

              {/* Chat Input Bar */}
              <View style={styles.chatInputBar}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Click on the mic & start dictating or Type here"
                  placeholderTextColor="#AAB4C2"
                  value={message}
                  onChangeText={setMessage}
                />
                <TouchableOpacity style={styles.iconCircleBtn} activeOpacity={0.7}>
                  <MaterialIcons name="mic" size={17} color="#6B7A8D" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendBtn} activeOpacity={0.8}>
                  <MaterialIcons name="send" size={13} color="#fff" />
                  <Text style={styles.sendBtnText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── MIDDLE: Kit Contents ── */}
            <KitContents />

            {/* ── RIGHT: Vitals Panel — exact spec: width 228, pad 39 24 ── */}
            <View style={styles.rightPanelWrapper}>
              <RightVitalsPanel onShowTrends={() => alert('Show Vital trends')} />
            </View>

          </View>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F0F4FA',
  },
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },

  // ── Patient Header ──
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    
    borderBottomColor: '#E8ECF0',
    gap: 10,
  },
  patientAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E0E5EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientName:   { fontSize: 15, fontWeight: '700', color: '#111' },
  patientFlight: { fontSize: 11, color: '#888', marginTop: 1 },
  joinNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1565C0',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  joinNowText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F4FA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E7EF',
  },

  // ── Body ──
  body: {
    flex: 1,
    flexDirection: 'row',
  },

  // ── Left Panel ──
  leftPanel: {
    flex: 1,                    // takes all remaining space after kit + vitals
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
  chatScroll: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
  },

  // Card
  card: {
    backgroundColor: '#F6F9FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8ECF0',
    elevation: 1,
  },
  cardSectionLabel: { fontSize: 13, fontWeight: '700', color: '#111', marginBottom: 6 },
  cardBodyText:     { fontSize: 12, color: '#444', lineHeight: 18 },
  viewMoreRow:      { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 2 },
  viewMoreText:     { fontSize: 11, color: '#1565C0', fontWeight: '600' },

  patientAvatarBubble: { paddingLeft: 4, marginBottom: 10 },
  patientAvatarCircle: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: '#E0E5EC',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },

  pathwayHeader:   { flexDirection: 'row', alignItems: 'center', marginBottom: 2, gap: 4 },
  pathwayTitle:    { fontSize: 12, fontWeight: '700', color: '#111' },
  pathwayBadge:    { backgroundColor: '#EBF2FF', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  pathwayBadgeText:{ fontSize: 11, color: '#1565C0', fontWeight: '600' },
  pathwaySubtitle: { fontSize: 11, color: '#888', marginBottom: 12 },

  instrGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  instrCard: { width: '47.5%', borderRadius: 10, padding: 10, minHeight: 90 },
  instrIconWrap: {
    width: 30, height: 30, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  instrTitle:  { fontSize: 10, fontWeight: '700', color: '#111', marginBottom: 3 },
  instrDesc:   { fontSize: 9, color: '#555', lineHeight: 13 },
  instrFooter: { fontSize: 9, color: '#999', marginTop: 10 },

  // ── Chat Input ──
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8ECF0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  chatInput: { flex: 1, fontSize: 12, color: '#333', paddingVertical: 0 },
  iconCircleBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#F0F4FA',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#E0E7EF',
  },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#1565C0', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  sendBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // ── Kit Panel ──
  kitPanel: {
    width: 220,
    backgroundColor: '#fff',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E8ECF0',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexShrink: 0,
  },
  kitHeader:       { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  kitTitle:        { fontSize: 13, fontWeight: '700', color: '#111' },
  kitSubtitle:     { fontSize: 10, color: '#999', marginBottom: 12 },
  kitSectionLabel: { fontSize: 10, color: '#AAA', fontWeight: '600', marginBottom: 8, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  kitEssentialRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  kitEssentialItem: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#F5F8FA', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 6,
    borderWidth: 1, borderColor: '#E8ECF0',
  },
  kitEssentialText: { fontSize: 10, color: '#333', fontWeight: '600' },
  medicationCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFBF0',
    borderRadius: 12, borderWidth: 1, borderColor: '#FFE5B0',
    padding: 10, gap: 10, marginBottom: 10,
  },
  medAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F59E0B',
    alignItems: 'center', justifyContent: 'center',
  },
  medAvatarText:     { color: '#fff', fontWeight: '800', fontSize: 18 },
  medName:           { fontSize: 12, fontWeight: '700', color: '#111' },
  medDetail:         { fontSize: 10, color: '#888', marginTop: 2 },
  medicationRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  medDot:            { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF9A9A' },
  medicationRowText: { fontSize: 11, color: '#444' },
  findMedBtn:        { backgroundColor: '#1565C0', borderRadius: 22, paddingVertical: 11, alignItems: 'center' },
  findMedBtnText:    { color: '#fff', fontSize: 12, fontWeight: '700' },

  // ── Right Vitals Panel wrapper — EXACT SPEC ──
  // width: 228, padding: 39px 24px, gap: 12px, background: #F5F8FF
  rightPanelWrapper: {
    width: 228,
    backgroundColor: '#F5F8FF',
    borderLeftWidth: 1,
    borderLeftColor: '#E8ECF0',
    paddingTop: 39,
    paddingRight: 24,
    paddingBottom: 39,
    paddingLeft: 24,
    flexShrink: 0,
  },
});