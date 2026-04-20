import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const VITALS = [
  { label: 'Heart Rate',       value: '88',     unit: 'bpm',   warn: false, warningType: null,  showGraph: false, icon: 'favorite-border',                     lib: 'MI'  },
  { label: 'Blood Pressure',   value: '135/85', unit: 'mmHg',  warn: true,  warningType: 'red', showGraph: false, icon: 'radiobox-marked',                     lib: 'MCI' },
  { label: 'Oxygen',           value: '95',     unit: '%',     warn: false, warningType: null,  showGraph: false, icon: 'air',                                 lib: 'MI'  },
  { label: 'Respiratory Rate', value: '20',     unit: '/min',  warn: false, warningType: null,  showGraph: false, icon: 'arrow-top-right-thin-circle-outline', lib: 'MCI' },
  { label: 'Temperature',      value: '36.8',   unit: '°C',    warn: false, warningType: null,  showGraph: false, icon: 'thermostat',                          lib: 'MI'  },
  { label: 'Skin Color',       value: 'Normal', unit: '',      warn: false, warningType: null,  showGraph: false, icon: 'palette',                             lib: 'MI'  },
  { label: 'Sweating',         value: 'Mild',   unit: '',      warn: false, warningType: null,  showGraph: false, icon: 'water-drop',                          lib: 'MI'  },
  { label: 'ECG',              value: 'Sinus',  unit: '',      warn: false, warningType: null,  showGraph: true,  icon: 'show-chart',                          lib: 'MI'  },
  { label: 'Pain Score',       value: '6/10',   unit: '',      warn: true,  warningType: 'red', showGraph: false, icon: 'sentiment-very-dissatisfied',         lib: 'MI'  },
];

const EcgLine = () => (
  <View style={ecgStyles.wrapper}>
    <View style={ecgStyles.baseline} />
    <View style={[ecgStyles.spike, { left: '20%', height: 6  }]} />
    <View style={[ecgStyles.spike, { left: '40%', height: 20 }]} />
    <View style={[ecgStyles.spike, { left: '55%', height: 7  }]} />
    <View style={[ecgStyles.spike, { left: '70%', height: 5  }]} />
  </View>
);

const ecgStyles = StyleSheet.create({
  wrapper: {
    width: 40, height: 22,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  baseline: {
    position: 'absolute',
    left: 0, right: 0, top: 10,
    height: 1.5,
    backgroundColor: '#E81314',
  },
  spike: {
    position: 'absolute',
    width: 1.5,
    backgroundColor: '#E81314',
    bottom: 2,
  },
});

const VitalCard = ({ label, value, unit, warn, warningType, showGraph, icon, lib }) => {
  const isRed    = warn && warningType === 'red';
  const isOrange = warn && warningType === 'orange';
  const iconColor = isRed ? '#E81314' : isOrange ? '#FC9432' : '#C5D3E0';

  return (
    <View style={[
      styles.card,
      isRed    && styles.cardRed,
      isOrange && styles.cardOrange,
    ]}>
      <View style={[
        styles.accentBar,
        isRed    && styles.accentRed,
        isOrange && styles.accentOrange,
      ]} />
      <View style={styles.cardContent}>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={[styles.cardValue, isRed && styles.textRed, isOrange && styles.textOrange]}>
          {value}
          {unit ? <Text style={styles.cardUnit}> {unit}</Text> : null}
        </Text>
      </View>
      {showGraph
        ? <EcgLine />
        : lib === 'MCI'
          ? <MaterialCommunityIcons name={icon} size={14} color={iconColor} />
          : <MaterialIcons name={icon} size={14} color={iconColor} />
      }
    </View>
  );
};

// Panel renders ONLY its inner content.
// Outer wrapper with exact width/padding is applied in CaseDetailScreen.
const RightVitalsPanel = ({ onShowTrends }) => (
  <View style={styles.inner}>
    {/* Show Vital Trends button */}
    <TouchableOpacity style={styles.showTrendsBtn} onPress={onShowTrends} activeOpacity={0.8}>
      <MaterialIcons name="bar-chart" size={13} color="#1565C0" />
      <Text style={styles.showTrendsText}>Show Vital trends</Text>
    </TouchableOpacity>

    {/* Vitals list — gap: 12 between cards as per spec */}
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 12 }}
    >
      {VITALS.map((v, i) => <VitalCard key={i} {...v} />)}
    </ScrollView>
  </View>
);

export default RightVitalsPanel;

const styles = StyleSheet.create({
  // Inner content only — no width/padding here, controlled by wrapper in screen
  inner: {
    flex: 1,
    gap: 12,
  },
  showTrendsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EBF2FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  showTrendsText: {
    fontSize: 10,
    color: '#1565C0',
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    paddingRight: 8,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#EEF0F4',
  },
  cardRed:      { backgroundColor: '#FFF2F2', borderColor: '#FFCDD2' },
  cardOrange:   { backgroundColor: '#FFF5E6', borderColor: '#FFE0B2' },
  accentBar:    { width: 4, alignSelf: 'stretch', backgroundColor: '#34C759' },
  accentRed:    { backgroundColor: '#FC9432' },
  accentOrange: { backgroundColor: '#FC9432' },
  cardContent:  { flex: 1, paddingLeft: 8 },
  cardLabel:    { fontSize: 9,  color: '#9DAFC4', marginBottom: 1 },
  cardValue:    { fontSize: 12, fontWeight: '700', color: '#111' },
  cardUnit:     { fontSize: 9,  fontWeight: '400', color: '#8899AA' },
  textRed:      { color: '#E81314' },
  textOrange:   { color: '#FC9432' },
});