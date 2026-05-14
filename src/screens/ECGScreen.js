// screens/ECGScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import Svg, { Line, Polyline, Text as SvgText, Rect } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Sidebar from "../components/Sidebar";
import { DetailedTopBar } from "../components/TopBar";
import { useTheme } from "../theme/ThemeContext"; // ✅ USE CONTEXT
import { lightTheme } from "../theme/theme";       // ✅ fallback only
import Starsvg from "../assets/Images/twostar.svg";
// ─── ECG waveform generator ───────────────────────────────────────────────────
const generateECGPoints = (width, height, cycles = 8, pattern = "normal") => {
  const points = [];
  const baseline = height * 0.6;
  const cycleWidth = width / cycles;

  for (let c = 0; c < cycles; c++) {
    const ox = c * cycleWidth;

    points.push([ox, baseline]);
    points.push([ox + cycleWidth * 0.08, baseline]);
    points.push([ox + cycleWidth * 0.12, baseline - height * 0.08]);
    points.push([ox + cycleWidth * 0.16, baseline]);
    points.push([ox + cycleWidth * 0.22, baseline]);
    points.push([ox + cycleWidth * 0.24, baseline + height * 0.06]);

    const rHeight = pattern === "tachy" ? height * 0.65 : height * 0.55;
    points.push([ox + cycleWidth * 0.27, baseline - rHeight]);
    points.push([ox + cycleWidth * 0.3, baseline + height * 0.1]);

    const stElevation = pattern === "stemi" ? -height * 0.12 : 0;
    points.push([ox + cycleWidth * 0.35, baseline + stElevation]);
    points.push([ox + cycleWidth * 0.42, baseline + stElevation]);

    const tHeight = pattern === "stemi" ? height * 0.2 : height * 0.14;
    points.push([ox + cycleWidth * 0.5, baseline - tHeight + stElevation]);
    points.push([ox + cycleWidth * 0.58, baseline]);
    points.push([ox + cycleWidth * 0.95, baseline]);
  }

  points.push([width, baseline]);
  return points;
};

// ─── ECGChart ────────────────────────────────────────────────────────────────
const ECGChart = ({ width, height = 160, pattern = "normal", cycles = 8, timeLabels = [], t }) => {
  if (!width) return null;

  const pts = generateECGPoints(width, height, cycles, pattern);
  const polylinePoints = pts.map((p) => `${p[0]},${p[1]}`).join(" ");

  const smallGrid = 10;
  const bigGrid = 50;

  return (
    <Svg width={width} height={height + 16}>
      <Rect width={width} height={height} fill={t.ecgChartBg} />

      {[...Array(Math.ceil(width / smallGrid))].map((_, i) => (
        <Line key={i} x1={i * smallGrid} y1={0} x2={i * smallGrid} y2={height}
          stroke={t.ecgGridLight} strokeWidth="0.5" />
      ))}
      {[...Array(Math.ceil(height / smallGrid))].map((_, i) => (
        <Line key={i} x1={0} y1={i * smallGrid} x2={width} y2={i * smallGrid}
          stroke={t.ecgGridLight} strokeWidth="0.5" />
      ))}
      {[...Array(Math.ceil(width / bigGrid))].map((_, i) => (
        <Line key={`b${i}`} x1={i * bigGrid} y1={0} x2={i * bigGrid} y2={height}
          stroke={t.ecgGridBold} strokeWidth="1" />
      ))}
      {[...Array(Math.ceil(height / bigGrid))].map((_, i) => (
        <Line key={`bh${i}`} x1={0} y1={i * bigGrid} x2={width} y2={i * bigGrid}
          stroke={t.ecgGridBold} strokeWidth="1" />
      ))}

      <Polyline points={polylinePoints} fill="none" stroke="#E53935" strokeWidth="1.5" />

      {timeLabels.map((lbl, i) => (
        <SvgText key={i} x={i * bigGrid} y={height + 12} fontSize="8" fill={t.ecgTimeLabelColor}>
          {lbl}
        </SvgText>
      ))}
    </Svg>
  );
};

// ─── MeasuredChart ────────────────────────────────────────────────────────────
const MeasuredChart = ({ height, pattern, cycles, timeLabels, highlight, t }) => {
  const [w, setW] = useState(0);

  return (
    <View
      style={[
        styles.chartBox,
        { borderColor: highlight ? t.ecgHighlightBorder : t.ecgChartBorder },
        highlight && styles.highlightBox,
      ]}
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
    >
      <ECGChart width={w} height={height} pattern={pattern} cycles={cycles} timeLabels={timeLabels} t={t} />
      {highlight && (
        <View style={styles.dimensionTag}>
          <Text style={styles.dimensionText}>96.78 × 135.49</Text>
        </View>
      )}
    </View>
  );
};

// ─── Right Panel ─────────────────────────────────────────────────────────────
const CustomRightPanel = ({ t }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.rightPanel, { backgroundColor: t.ecgRightPanelBg, borderLeftColor: t.ecgRightPanelBorder }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: insets.top + 8 }}>
          <View style={[styles.measureCard, { backgroundColor: t.ecgMeasureCardBg }]}>
            <Text style={[styles.rightTitle, { color: t.ecgRightTitleColor }]}>ECG Measurements</Text>
            <View style={styles.measureGrid}>
              <View style={styles.measureCol}>
                <Text style={[styles.measure, { color: t.ecgMeasureText }]}>HR: <Text style={styles.bold}>81 bpm</Text></Text>
                <Text style={[styles.measure, { color: t.ecgMeasureText }]}>PR: <Text style={styles.bold}>164 ms</Text></Text>
                <Text style={[styles.measure, { color: t.ecgMeasureText }]}>QT: <Text style={styles.bold}>448 ms</Text></Text>
                <Text style={[styles.measure, { color: t.ecgMeasureText }]}>ST-II: <Text style={styles.bold}>+2.4 mm</Text></Text>
                <Text style={[styles.measure, { color: t.ecgMeasureText }]}>P-amp: <Text style={styles.bold}>0.18 mV</Text></Text>
                <Text style={[styles.measure, { color: t.ecgMeasureText }]}>T-inv: <Text style={styles.bold}>aVL, V1</Text></Text>
              </View>
              <View style={styles.measureCol}>
                <Text style={[styles.measure, { color: t.ecgMeasureText }]}>Axis: <Text style={styles.bold}>+105°</Text></Text>
                <Text style={[styles.measure, { color: t.ecgMeasureText }]}>QRS: <Text style={styles.bold}>92 ms</Text></Text>
                <Text style={[styles.measure, { color: t.ecgMeasureText }]}>QTC: <Text style={styles.bold}>468 ms</Text></Text>
                <Text style={[styles.measure, { color: t.ecgMeasureText }]}>ST-V5: <Text style={styles.bold}>+1.8 mm</Text></Text>
                <Text style={[styles.measure, { color: t.ecgMeasureText }]}>R-amp: <Text style={styles.bold}>1.4 mV</Text></Text>
                <Text style={[styles.measure, { color: t.ecgMeasureText }]}>Δ-wave: <Text style={styles.bold}>None</Text></Text>
              </View>
            </View>
          </View>

          <View style={[styles.aiSection, { backgroundColor: t.ecgMeasureCardBg,  borderRadius: 10, }]}>
            <View style={styles.aiHeaderContainer}>
  <View style={styles.starIcon}>
    <Starsvg />
  </View>

  <Text
    style={[
      styles.aiHeader,
      { color: t.ecgAiHeaderColor }
    ]}
  >
    AI Assist
  </Text>
</View>
            <View style={[styles.aiCard, { backgroundColor: t.ecgAiCardRed }]}>
              <Text style={[styles.aiTitle, { color: t.ecgAiTitleColor }]}>Inferior STEMI pattern — leads II, III, aVF</Text>
              <Text style={[styles.aiSub, { color: t.ecgAiSubColor }]}>ST elevation ≥2mm with reciprocal depression in aVL</Text>
            </View>
            <View style={[styles.aiCard, { backgroundColor: t.ecgAiCardYellow }]}>
              <Text style={[styles.aiTitle, { color: t.ecgAiTitleColor }]}>QTc prolongation — 468 ms</Text>
              <Text style={[styles.aiSub, { color: t.ecgAiSubColor }]}>Risk of Torsades. Avoid QT-prolonging medications</Text>
            </View>
            <View style={[styles.aiCard, { backgroundColor: t.ecgAiCardBlue }]}>
              <Text style={[styles.aiTitle, { color: t.ecgAiTitleColor }]}>Right axis deviation (+105°)</Text>
              <Text style={[styles.aiSub, { color: t.ecgAiSubColor }]}>May suggest RV strain or posterior involvement</Text>
            </View>
            <View style={[styles.aiCard, { backgroundColor: t.ecgAiCardPurple }]}>
              <Text style={[styles.aiTitle, { color: t.ecgAiTitleColor }]}>T-wave inversion in aVL, V1</Text>
              <Text style={[styles.aiSub, { color: t.ecgAiSubColor }]}>Reciprocal changes consistent with inferior event</Text>
            </View>
            <View style={[styles.aiCard, { backgroundColor: t.ecgAiCardGreen }]}>
              <Text style={[styles.aiTitle, { color: t.ecgAiTitleColor }]}>No ventricular ectopics detected</Text>
              <Text style={[styles.aiSub, { color: t.ecgAiSubColor }]}>QRS morphology normal. No bundle branch block</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function ECGScreen({ navigation }) {
  // ✅ Pull theme AND toggle from context — NO local useState for theme
  const themeCtx = useTheme();
  const t        = themeCtx?.theme ?? lightTheme;
  const dark     = themeCtx?.dark  ?? false;
  const toggleTheme = themeCtx?.toggleTheme ?? (() => {});

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.ecgSafeBg }]}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />

      <View style={styles.root}>
        {/* ✅ Sidebar gets isDark and toggleTheme from context */}
        <Sidebar
          navigation={navigation}
          isDark={dark}
          onToggleTheme={toggleTheme}
        />

        <View style={[styles.main, { backgroundColor: t.ecgMainBg }]}>
          {/* ✅ TopBar reads theme from context internally — no prop needed */}
          <DetailedTopBar navigation={navigation} />

          <ScrollView>
            <View style={styles.formContainer}>
              <View style={styles.titleRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.title, { color: t.ecgTitleColor }]}>
                    Sinus Rhythm – <Text >♥</Text> 77 BPM Average
                  </Text>
                  <Text style={[styles.subtitle, { color: t.ecgSubtitleColor }]}>
                    This ECG does not show signs of atrial fibrillation.
                  </Text>
                </View>
                <Text style={[styles.recordedText, { color: t.ecgRecordedColor }]}>
                  Recorded on 7 Aug 2024 at 10:23
                </Text>
              </View>

              <MeasuredChart height={160} pattern="normal" cycles={9} highlight t={t}
                timeLabels={["0s","1s","2s","3s","4s","5s","6s","7s","8s"]} />

              <View style={styles.leadHeaderRow}>
                <Text style={[styles.section, { color: t.ecgTitleColor }]}>12 Lead Overview</Text>
                <View style={styles.leadBadgeRow}>
                  {["Auto-gain","25mm/s","10mm/mV","OK","Artifact"].map((lbl, i, arr) => (
                    <React.Fragment key={lbl}>
                      <Text style={[styles.leadBadge, { color: t.ecgBadgeColor }]}>{lbl}</Text>
                      {i < arr.length - 1 && <Text style={[styles.dot, { color: t.ecgDotColor }]}> · </Text>}
                    </React.Fragment>
                  ))}
                </View>
              </View>

              {[1, 2, 3].map((i) => (
                <MeasuredChart key={i} height={100} pattern="normal" cycles={9} t={t} />
              ))}
            </View>
          </ScrollView>
        </View>

        <CustomRightPanel t={t} />
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1 },
  root: { flex: 1, flexDirection: "row" },
  main: { flex: 1, marginTop:20 },
  formContainer: { padding: 16 },
  title: { fontSize: 16, fontWeight: "700" },
  subtitle: { fontSize: 12, marginBottom: 10 },
  chartBox: { borderRadius: 8, borderWidth: 1, overflow: "hidden", marginBottom: 12 },
  highlightBox: { borderStyle: "dashed" },
  dimensionTag: { position: "absolute", bottom: 5, left: 5, backgroundColor: "#4A90E2", paddingHorizontal: 6, borderRadius: 4 },
  dimensionText: { color: "#fff", fontSize: 10 },
  section: { fontSize: 14, fontWeight: "700", marginTop: 10 },
  rightPanel: { width: 300, borderLeftWidth: 1, padding: 10 },
  rightTitle: { fontWeight: "800", marginBottom: 10, fontSize: 16 },
  measure: { fontSize: 12, marginBottom: 6 },
  bold: { fontWeight: "700" },
  measureGrid: { flexDirection: "row", justifyContent: "space-between" },
  measureCol: { flex: 1 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  recordedText: { fontSize: 10, marginTop: 32 },
  leadHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  leadBadgeRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  leadBadge: { fontSize: 10 },
  dot: { marginHorizontal: 3 },
  measureCard: { padding: 12, borderRadius: 10, marginBottom: 10 },
  aiSection: {padding: 12, borderRadius: 10, marginTop: 6 },
  aiHeader: { fontWeight: "700", fontSize: 13, marginBottom: 8,  },
  aiCard: { borderRadius: 8, padding: 8, marginBottom: 6 },
  aiTitle: { fontSize: 11, fontWeight: "700" },
  aiSub: { fontSize: 10 },
  heart: { color: '#ffff' },

  aiHeaderContainer: {
  flexDirection: 'row',
  alignItems: 'start',
  justifyContent: 'flex-start',
  marginBottom: 12,
},

starIcon: {
  marginRight: 6,
  justifyContent: 'flex-start',
  alignItems: 'center',
},

aiHeader: {
  fontSize: 14 ,
  fontWeight: '600',
  textAlign: 'start',
},
  
});