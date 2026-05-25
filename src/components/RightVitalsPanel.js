// // components/RightVitalsPanel.js
// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from "react-native";

// // SVG IMPORTS
// import Heart from "../assets/Images/Heart.svg";
// import BloodPressure from "../assets/Images/BloodPressure.svg";
// import Oxygen from "../assets/Images/Oxygen.svg";
// import RespiratoryRate from "../assets/Images/RespiratoryRate.svg";
// import Temperature from "../assets/Images/Temperature.svg";
// import Eye from "../assets/Images/eyeicon.svg";
// import Sweating from "../assets/Images/Sweating.svg";
// import ECG from "../assets/Images/ECG.svg";
// import Pain from "../assets/Images/Pain.svg";
// import Glucose from "../assets/Images/Glucose.svg";
// import AVPU from "../assets/Images/AVPU.svg";
// import Trend from "../assets/Images/Trend.svg";
// import Greycolorpicker from "../assets/Images/greycolorpicker.svg";
// import ECGGraph from "../assets/Images/ECGGraph.svg";
// import ECGGraphDark from "../assets/Images/ECGGraphDark.svg";
// import { useTheme } from "../theme/ThemeContext";
// // ─────────────────────────────────────────────
// // VITALS
// // ─────────────────────────────────────────────
// const VITALS = [
//   {
//     label: "Heart Rate",
//     value: "88",
//     unit: "bpm",
//     warn: false,
//     warningType: null,
//     showGraph: false,
//     icon: Heart,
//   },
//   {
//     label: "Blood Pressure",
//     value: "135/85",
//     unit: "mmHg",
//     warn: true,
//     warningType: "red",
//     showGraph: false,
//     icon: BloodPressure,
//   },
//   {
//     label: "Oxygen",
//     value: "95",
//     unit: "%",
//     warn: false,
//     warningType: null,
//     showGraph: false,
//     icon: Oxygen,
//   },
//   {
//     label: "Respiratory Rate",
//     value: "20",
//     unit: "/min",
//     warn: false,
//     warningType: null,
//     showGraph: false,
//     icon: RespiratoryRate,
//   },
//   {
//     label: "Temperature",
//     value: "36.8",
//     unit: "°C",
//     warn: false,
//     warningType: null,
//     showGraph: false,
//     icon: Temperature,
//   },
//   {
//     label: "Skin Color",
//     value: "Normal",
//     unit: "",
//     warn: false,
//     warningType: null,
//     showGraph: false,
//     icon: Greycolorpicker,
//   },
//   {
//     label: "Sweating",
//     value: "Mild",
//     unit: "",
//     warn: false,
//     warningType: null,
//     showGraph: false,
//     icon: Sweating,
//   },
//   {
//     label: "ECG",
//     value: "Sinus",
//     unit: "",
//     warn: false,
//     warningType: null,
//     showGraph: true,
//     icon: null,
//   },
//   {
//     label: "Pain Score",
//     value: "6/10",
//     unit: "",
//     warn: true,
//     warningType: "red",
//     showGraph: false,
//     icon: Pain,
//   },
//   {
//     label: "Blood Glucose",
//     value: "100",
//     unit: "mg/dl",
//     warn: false,
//     warningType: null,
//     showGraph: false,
//     icon: Glucose,
//   },
//   {
//     label: "AVPU Score",
//     value: "15",
//     unit: "",
//     warn: false,
//     warningType: null,
//     showGraph: false,
//     icon: AVPU,
//   },
// ];



// // ─────────────────────────────────────────────
// // VITAL CARD
// // ─────────────────────────────────────────────
// const VitalCard = ({
//   label,
//   value,
//   unit,
//   showGraph,
//   icon: Icon,
//   // theme,
// }) => {
//   const ALERT_RED = "#E81314";
//   const ALERT_ORANGE = "#FC9432";
//   const ALERT_BLUE = "#2563EB";
// const { theme, dark } = useTheme();
//   // 🎯 BORDER COLOR
//   let borderColor = theme?.rvCardBorderDefault ?? "#E6E6E6";
//   let shadeBg = "transparent";

//   if (label === "Oxygen") {
//     borderColor = ALERT_RED;
//     shadeBg = theme?.rvShadeOxygen;
//   } else if (label === "Respiratory Rate" || label === "Temperature") {
//     borderColor = ALERT_ORANGE;
//     shadeBg = theme?.rvShadeOrange;
//   } else if (label === "AVPU Score") {
//     borderColor = ALERT_BLUE;
//   }

//   const iconColor =
//     borderColor === ALERT_RED
//       ? ALERT_RED
//       : borderColor === ALERT_ORANGE
//       ? ALERT_ORANGE
//       : borderColor === ALERT_BLUE
//       ? ALERT_BLUE
//       : theme?.rvTrendsBtnIcon ?? "#C5D3E0";

//   return (
//     <View
//       style={[
//         styles.card,
//         {
//           borderLeftColor: borderColor,
//           backgroundColor: theme?.rvCardBg,
//         },
//       ]}
//     >
//       {/* 🔥 SHADE OVERLAY */}
//       {(label === "Oxygen" ||
//         label === "Respiratory Rate" ||
//         label === "Temperature") && (
//         <View
//           style={[
//             styles.shadeOverlay,
//             { backgroundColor: shadeBg },
//           ]}
//         />
//       )}

//       <View style={styles.cardContent}>
//         <Text
//           style={[
//             styles.cardLabel,
//             { color: theme?.rvCardLabel },
//           ]}
//         >
//           {label}
//         </Text>

//         <Text
//           style={[
//             styles.cardValue,
//             { color: theme?.rvCardValue },
//           ]}
//         >
//           {value}
//           {unit ? (
//             <Text
//               style={[
//                 styles.cardUnit,
//                 { color: theme?.rvCardUnit },
//               ]}
//             >
//               {" "}
//               {unit}
//             </Text>
//           ) : null}
//         </Text>
//       </View>

//    {showGraph ? (
//   dark? (
//     <ECGGraphDark width={70} height={40} />
//   ) : (
//     <ECGGraph width={70} height={40} />
//   )
// ) : (
//   <Icon width={16} height={16} fill={iconColor} />
// )}
//     </View>
//   );
// };

// // ─────────────────────────────────────────────
// // PANEL
// // ─────────────────────────────────────────────
// const RightVitalsPanel = ({
//   onShowTrends,
//   onECGPress,
//   showTrendsButton = true,
//   showHeader = false,
//   patientInfo = {},
//   onClose,
//   theme,          // ← receive theme from parent
// }) => (
//   <View style={styles.inner}>
//     {/* CONDITIONAL HEADER */}
//     {showHeader && (
//       <View style={styles.header}>
//         <View style={{ flex: 1 }}>
//           <Text style={[styles.headerTitle, { color: theme.rvHeaderTitle }]}>
//             {patientInfo.name}, {patientInfo.age} {patientInfo.gender}
//           </Text>
//           <Text style={[styles.headerSub, { color: theme.rvHeaderSub  }]}>
//             Flight {patientInfo.flight} ({patientInfo.route})
//           </Text>
//         </View>

//         <TouchableOpacity onPress={onClose}>
//           <Text style={[styles.closeBtn, { color: theme.rvHeaderClose  }]}>
//             ✕
//           </Text>
//         </TouchableOpacity>
//       </View>
//     )}

//     {/* Show Trends */}
//     {showTrendsButton && (
//       <TouchableOpacity
//         style={[
//           styles.showTrendsBtn,
//           {
//             backgroundColor: theme.rvTrendsBtnBg ,
//             borderColor: theme.rvTrendsBtnBorder ,
//           },
//         ]}
//         onPress={onShowTrends}
//         activeOpacity={0.8}
//       >
//         <Trend width={18} height={18} fill={theme.rvTrendsBtnIcon } />
//         <Text style={[styles.showTrendsText, { color: theme.rvTrendsBtnText  }]}>
//           Show Vital trends
//         </Text>
//       </TouchableOpacity>
//     )}

//     <ScrollView
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{ gap: 12 }}
//     >
//       {VITALS.map((v, i) => {
//         if (v.label === "ECG") {
//           return (
//             <TouchableOpacity key={i} activeOpacity={0.8} >
//               <VitalCard {...v} theme={theme} />
//             </TouchableOpacity>
//           );
//         }
//         return <VitalCard key={i} {...v} theme={theme}  />;
//       })}
//     </ScrollView>
//   </View>
// );

// export default RightVitalsPanel;

// // ─────────────────────────────────────────────
// // STYLES  (only layout / non-theme values here)
// // ─────────────────────────────────────────────
// const styles = StyleSheet.create({
//   inner: {
//     flex: 1,
//     gap: 0,
//     marginTop: 25,
//   },

//   shadeOverlay: {
//   ...StyleSheet.absoluteFillObject,
//   borderRadius: 10,
// },

//   // HEADER
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 2,
//   },

//   headerTitle: {
//     fontSize: 13,
//     fontWeight: "700",
//   },

//   headerSub: {
//     fontSize: 10,
//     marginBottom: 15,
//   },

//   closeBtn: {
//     fontSize: 13,
//     padding: 4,
//   },

//   showTrendsBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 15,
//     borderWidth: 1,
//     marginBottom: 10,
//     marginTop:-10
//   },

//   showTrendsText: {
//     fontSize: 10,
//     fontWeight: "700",
//   },

//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 10,
//     overflow: "hidden",
//     paddingRight: 12,
//     paddingVertical: 2,
//     borderLeftWidth: 4,
//     width: "83%",
//     alignSelf: "center",
//     marginTop:6
//   },

//   curveStrip: {
//     // decorative — width intentionally 0; left border does the visual work
//     width: 0,
//   },

//   cardContent: { flex: 1, paddingLeft: 8 },

//   cardLabel: { fontSize: 9, marginBottom: 2 },

//   cardValue: {
//     fontSize: 12,
//     fontWeight: "500",
//   },

//   cardUnit: {
//     fontSize: 12,
//     fontWeight: "400",
//   },
// });

// components/RightVitalsPanel.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";

// SVG IMPORTS
import Heart from "../assets/Images/Heart.svg";
import BloodPressure from "../assets/Images/BloodPressure.svg";
import Oxygen from "../assets/Images/Oxygen.svg";
import RespiratoryRate from "../assets/Images/RespiratoryRate.svg";
import Temperature from "../assets/Images/Temperature.svg";
import Eye from "../assets/Images/eyeicon.svg";
import Sweating from "../assets/Images/Sweating.svg";
import ECG from "../assets/Images/ECG.svg";
import Pain from "../assets/Images/Pain.svg";
import Glucose from "../assets/Images/Glucose.svg";
import AVPU from "../assets/Images/AVPU.svg";
import Trend from "../assets/Images/Trend.svg";
import Greycolorpicker from "../assets/Images/greycolorpicker.svg";
import ECGGraph from "../assets/Images/ECGGraph.svg";
import ECGGraphDark from "../assets/Images/ECGGraphDark.svg";
import { useTheme } from "../theme/ThemeContext";

// ─────────────────────────────────────────────
// VITALS
// ─────────────────────────────────────────────
const VITALS = [
  {
    label: "Heart Rate",
    value: "88",
    unit: "bpm",
    warn: false,
    warningType: null,
    showGraph: false,
    icon: Heart,
  },
  {
    label: "Blood Pressure",
    value: "135/85",
    unit: "mmHg",
    warn: true,
    warningType: "red",
    showGraph: false,
    icon: BloodPressure,
  },
  {
    label: "Oxygen",
    value: "95",
    unit: "%",
    warn: false,
    warningType: null,
    showGraph: false,
    icon: Oxygen,
  },
  {
    label: "Respiratory Rate",
    value: "20",
    unit: "/min",
    warn: false,
    warningType: null,
    showGraph: false,
    icon: RespiratoryRate,
  },
  {
    label: "Temperature",
    value: "36.8",
    unit: "°C",
    warn: false,
    warningType: null,
    showGraph: false,
    icon: Temperature,
  },
  {
    label: "Skin Color",
    value: "Normal",
    unit: "",
    warn: false,
    warningType: null,
    showGraph: false,
    icon: Greycolorpicker,
  },
  {
    label: "Sweating",
    value: "Mild",
    unit: "",
    warn: false,
    warningType: null,
    showGraph: false,
    icon: Sweating,
  },
  {
    label: "ECG",
    value: "Sinus",
    unit: "",
    warn: false,
    warningType: null,
    showGraph: true,
    icon: null,
  },
  {
    label: "Pain Score",
    value: "6/10",
    unit: "",
    warn: true,
    warningType: "red",
    showGraph: false,
    icon: Pain,
  },
  {
    label: "Blood Glucose",
    value: "100",
    unit: "mg/dl",
    warn: false,
    warningType: null,
    showGraph: false,
    icon: Glucose,
  },
  {
    label: "AVPU Score",
    value: "15",
    unit: "",
    warn: false,
    warningType: null,
    showGraph: false,
    icon: AVPU,
  },
];

// ─────────────────────────────────────────────
// VITAL CARD
// ─────────────────────────────────────────────
const VitalCard = ({
  label,
  value,
  unit,
  showGraph,
  icon: Icon,
  cardWidth,
  graphWidth,
  graphHeight,
}) => {
  const ALERT_RED = "#E81314";
  const ALERT_ORANGE = "#FC9432";
  const ALERT_BLUE = "#2563EB";

  const { theme, dark } = useTheme();

  // 🎯 BORDER COLOR
  let borderColor = theme?.rvCardBorderDefault ?? "#E6E6E6";
  let shadeBg = "transparent";

  if (label === "Oxygen") {
    borderColor = ALERT_RED;
    shadeBg = theme?.rvShadeOxygen;
  } else if (label === "Respiratory Rate" || label === "Temperature") {
    borderColor = ALERT_ORANGE;
    shadeBg = theme?.rvShadeOrange;
  } else if (label === "AVPU Score") {
    borderColor = ALERT_BLUE;
  }

  const iconColor =
    borderColor === ALERT_RED
      ? ALERT_RED
      : borderColor === ALERT_ORANGE
      ? ALERT_ORANGE
      : borderColor === ALERT_BLUE
      ? ALERT_BLUE
      : theme?.rvTrendsBtnIcon ?? "#C5D3E0";

  return (
    <View
      style={[
        styles.card,
        {
          width: cardWidth,
          borderLeftColor: borderColor,
          backgroundColor: theme?.rvCardBg,
        },
      ]}
    >
      {/* 🔥 SHADE OVERLAY */}
      {(label === "Oxygen" ||
        label === "Respiratory Rate" ||
        label === "Temperature") && (
        <View style={[styles.shadeOverlay, { backgroundColor: shadeBg }]} />
      )}

      <View style={styles.cardContent}>
        <Text
          style={[styles.cardLabel, { color: theme?.rvCardLabel }]}
          numberOfLines={1}
        >
          {label}
        </Text>

        <Text
          style={[styles.cardValue, { color: theme?.rvCardValue }]}
          numberOfLines={1}
        >
          {value}
          {unit ? (
            <Text style={[styles.cardUnit, { color: theme?.rvCardUnit }]}>
              {" "}
              {unit}
            </Text>
          ) : null}
        </Text>
      </View>

      {showGraph ? (
        dark ? (
          <ECGGraphDark width={graphWidth} height={graphHeight} />
        ) : (
          <ECGGraph width={graphWidth} height={graphHeight} />
        )
      ) : Icon ? (
        <Icon width={16} height={16} fill={iconColor} />
      ) : null}
    </View>
  );
};

// ─────────────────────────────────────────────
// PANEL
// ─────────────────────────────────────────────
const RightVitalsPanel = ({
  onShowTrends,
  onECGPress,
  showTrendsButton = true,
  showHeader = false,
  patientInfo = {},
  onClose,
  theme, // ← receive theme from parent
}) => {
  const { width } = useWindowDimensions();

  /*
    iPad/Samsung tablet responsive handling:
    - In CaseDetailScreen this panel is usually around 205–218px wide.
    - In overlay/right drawer mode it can be around 270–320px wide.
    - So we keep cards fluid instead of forcing 83%.
  */
  const isSmallTablet = width < 1050;
  const isVeryNarrow = width < 850;

  const cardWidth = isVeryNarrow ? "96%" : isSmallTablet ? "94%" : 200;
  const graphWidth = isVeryNarrow ? 58 : isSmallTablet ? 62 : 70;
  const graphHeight = isVeryNarrow ? 34 : isSmallTablet ? 36 : 40;

  const scrollGap = isVeryNarrow ? 8 : 10;

  return (
    <View style={[styles.inner, isSmallTablet && styles.innerCompact]}>
      {/* CONDITIONAL HEADER */}
      {showHeader && (
        <View style={styles.header}>
          <View style={styles.headerTextWrap}>
            <Text
              style={[styles.headerTitle, { color: theme.rvHeaderTitle }]}
              numberOfLines={1}
            >
              {patientInfo.name}, {patientInfo.age} {patientInfo.gender}
            </Text>

            <Text
              style={[styles.headerSub, { color: theme.rvHeaderSub }]}
              numberOfLines={1}
            >
              Flight {patientInfo.flight} ({patientInfo.route})
            </Text>
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeTouch}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.closeBtn, { color: theme.rvHeaderClose }]}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Show Trends */}
      {showTrendsButton && (
        <TouchableOpacity
          style={[
            styles.showTrendsBtn,
            isSmallTablet && styles.showTrendsBtnCompact,
            {
              backgroundColor: theme.rvTrendsBtnBg,
              borderColor: theme.rvTrendsBtnBorder,
            },
          ]}
          onPress={onShowTrends}
          activeOpacity={0.8}
        >
          <Trend width={18} height={18} fill={theme.rvTrendsBtnIcon} />

          <Text
            style={[
              styles.showTrendsText,
              { color: theme.rvTrendsBtnText },
            ]}
            numberOfLines={1}
          >
            Show Vital trends
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            rowGap: scrollGap,
            paddingBottom: isSmallTablet ? 16 : 20,
          },
        ]}
      >
        {VITALS.map((v, i) => {
          if (v.label === "ECG") {
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                onPress={onECGPress}
              >
                <VitalCard
                  {...v}
                  cardWidth={cardWidth}
                  graphWidth={graphWidth}
                  graphHeight={graphHeight}
                />
              </TouchableOpacity>
            );
          }

          return (
            <VitalCard
              key={i}
              {...v}
              cardWidth={cardWidth}
              graphWidth={graphWidth}
              graphHeight={graphHeight}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default RightVitalsPanel;

// ─────────────────────────────────────────────
// STYLES  (only layout / non-theme values here)
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  inner: {
    flex: 1,
    gap: 0,
    minWidth: 0,
  },

  innerCompact: {
    marginTop: 5,
  },

  shadeOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
    paddingHorizontal: 2,
    minWidth: 0,
  },

  headerTextWrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },

  headerTitle: {
    fontSize: 13,
    fontWeight: "700",
  },

  headerSub: {
    fontSize: 10,
    marginTop: 2,
    marginBottom: 6,
  },

  closeTouch: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  closeBtn: {
    fontSize: 13,
    padding: 4,
  },

  showTrendsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 13,
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 0,
    width: "94%",
    alignSelf: "center",
    minWidth: 0,
  },

  showTrendsBtnCompact: {
    width: "96%",
    paddingHorizontal: 6,
    paddingVertical: 12,
    gap: 6,
  },

  showTrendsText: {
    fontSize: 10,
    fontWeight: "700",
    flexShrink: 1,
  },

  scrollContent: {
    paddingTop: 2,
    paddingHorizontal: 0,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    paddingRight: 10,
    paddingVertical: 4,
    borderLeftWidth: 4,
    alignSelf: "center",
    minHeight: 42,
    minWidth: 0,
  },

  curveStrip: {
    // decorative — width intentionally 0; left border does the visual work
    width: 0,
  },

  cardContent: {
    flex: 1,
    paddingLeft: 8,
    minWidth: 0,
  },

  cardLabel: {
    fontSize: 9,
    marginBottom: 2,
  },

  cardValue: {
    fontSize: 12,
    fontWeight: "500",
  },

  cardUnit: {
    fontSize: 12,
    fontWeight: "400",
  },
});