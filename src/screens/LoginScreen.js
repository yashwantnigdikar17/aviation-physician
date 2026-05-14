import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, Platform, Image,
  useWindowDimensions, ScrollView, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Logo from '../assets/Images/tiatelelogo.svg';
import NotificationService from '../services/NotificationService';
import { useTheme } from '../theme/ThemeContext'; // ← adjust path if needed

/* ─── Breakpoints ─────────────────────────────────────────────────────────── */
const BREAKPOINTS = {
  phone:  600,
  tablet: 900,
};

/* ─── ThemeToggle ─────────────────────────────────────────────────────────── */
/*
 * theme tokens used:
 *   lsTogglePillBg     → pill background
 *   lsTogglePillBorder → pill border
 *   lsToggleThumb      → sliding circle fill
 *   lsToggleSunColor   → ☀ icon colour
 *   lsToggleMoonColor  → ☽ icon colour
 */
const ThemeToggle = ({ theme, dark, toggleTheme }) => (
  <TouchableOpacity
    onPress={toggleTheme}
    activeOpacity={0.8}
    style={[
      toggleStyles.pill,
      {
        backgroundColor: theme.lsTogglePillBg,
        borderColor:     theme.lsTogglePillBorder,
      },
    ]}
  >
    <Text style={[toggleStyles.sideIcon, { color: theme.lsToggleSunColor }]}>
      ☀
    </Text>

    <View
      style={[
        toggleStyles.thumb,
        {
          backgroundColor: theme.lsToggleThumb,
          transform: [{ translateX: dark ? 28 : 0 }],
        },
      ]}
    />

    <Text style={[toggleStyles.sideIcon, { color: theme.lsToggleMoonColor }]}>
      ☽
    </Text>
  </TouchableOpacity>
);

const toggleStyles = StyleSheet.create({
  pill: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    width:             66,
    height:            32,
    borderRadius:      16,
    borderWidth:       1,
    paddingHorizontal: 6,
    overflow:          'hidden',
    position:          'relative',
  },
  thumb: {
    position:     'absolute',
    left:         4,
    width:        24,
    height:       24,
    borderRadius: 12,
    shadowColor:  '#000',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation:    3,
  },
  sideIcon: {
    fontSize: 13,
    zIndex:   1,
  },
});

/* ─── InputField ──────────────────────────────────────────────────────────── */
/*
 * theme tokens used:
 *   lsInputLabel       → label text colour
 *   lsInputBg          → input background
 *   lsInputBorder      → input border
 *   lsInputText        → typed text colour
 *   lsPlaceholderText  → placeholder tint
 */
const InputField = ({
  label, value, onChangeText,
  placeholder, secureTextEntry, theme,
}) => (
  <View style={styles.inputWrapper}>
    <Text style={[styles.label, { color: theme.lsInputLabel }]}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: theme.lsInputBg,
          borderColor:     theme.lsInputBorder,
          color:           theme.lsInputText,
        },
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.lsPlaceholderText}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
  </View>
);

/* ─── FeatureItem ─────────────────────────────────────────────────────────── */
const FeatureItem = ({ icon, subtitle }) => (
  <View style={styles.featureItem}>
    <Image source={icon} style={styles.featureIconImage} resizeMode="contain" />
    <Text style={styles.featureText}>{subtitle}</Text>
  </View>
);

/* ─── Main Screen ─────────────────────────────────────────────────────────── */
export default function LoginScreen({ navigation }) {
  const { theme, dark, toggleTheme } = useTheme();

  const [email, setEmail]       = useState('dr.johnson@telecare.com');
  const [password, setPassword] = useState('QA-B737');

  const { width, height } = useWindowDimensions();

  const isWide    = width > BREAKPOINTS.tablet;
  const isMid     = width > BREAKPOINTS.phone && !isWide;
  const isPhone   = width <= BREAKPOINTS.phone;
  const layoutRow = isWide;

  const hPad = isPhone ? '5%' : isMid ? '8%' : '6%';

  /* ── Handlers ── */
  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    if (email === 'dr.johnson@telecare.com' && password === 'QA-B737') {
      console.log('Login successful', { email });
      const USER_ID = 'doctor_001';
      await NotificationService.initialize(USER_ID, navigation);
      navigation.replace('EventsScreenTable');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Instructions to reset your password will be sent to your registered email address.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
    );
  };

  /* ────────────────────────────────────────────────────────────────────────
   * LEFT PANEL
   *
   * theme tokens:
   *   lsLeftPanelBg    → panel background
   *   lsLogoMainText   → "Tia" text colour
   *   lsLogoAccentText → "TELE" accent colour
   *   lsHeadingText    → heading colour
   *   lsSubheadingText → subheading colour
   *   lsForgotText     → forgot-password link colour
   *   lsLoginBtnBg     → login button background
   *   lsLoginBtnText   → login button label
   * ──────────────────────────────────────────────────────────────────────── */
  const LeftPanel = (
    <View
      style={[
        styles.leftPanel,
        {
          flex:              layoutRow ? 0.85 : 1,
          paddingHorizontal: hPad,
          paddingVertical:   isPhone ? 32 : isMid ? 36 : 24,
          backgroundColor:   theme.lsLeftPanelBg,
        },
      ]}
    >
      {/* ── Top row: logo + toggle ── */}
      <View style={styles.topRow}>
        <View style={styles.logoRow}>
          <View style={[styles.logoIcon, { backgroundColor: theme.lsLeftPanelBg }]}>
            <Logo width={76} height={100} />
          </View>
          <Text style={[styles.logoText, { color: theme.lsLogoMainText }]}>
            Tia
            <Text style={{ color: theme.lsLogoAccentText, fontWeight: '800', letterSpacing: 1 }}>
              TELE
            </Text>
          </Text>
        </View>

        <ThemeToggle theme={theme} dark={dark} toggleTheme={toggleTheme} />
      </View>

      <Text style={[styles.heading, { color: theme.lsHeadingText }]}>
        Telecare Provider Portal
      </Text>
      <Text style={[styles.subheading, { color: theme.lsSubheadingText }]}>
        Please enter the below details to login
      </Text>

      <InputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        theme={theme}
      />

      <InputField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        theme={theme}
      />

      <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
        <Text style={[styles.forgot, { color: theme.lsForgotText }]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.loginBtn, { backgroundColor: theme.lsLoginBtnBg }]}
        onPress={handleLogin}
        activeOpacity={0.85}
      >
        <Text style={[styles.loginBtnText, { color: theme.lsLoginBtnText }]}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );

  /* ────────────────────────────────────────────────────────────────────────
   * RIGHT PANEL  (brand hero — fixed colours, no theme tokens needed)
   * ──────────────────────────────────────────────────────────────────────── */
  const RightPanel = (
    <View
      style={[
        styles.rightPanel,
        {
          flex:      layoutRow ? 1.15 : 1,
          minHeight: layoutRow ? undefined : isPhone ? 320 : 380,
          maxHeight: layoutRow ? undefined : isPhone ? 380 : 460,
        },
      ]}
    >
      <Image
        source={require('../assets/Images/doctor-patient.png')}
        style={[styles.fullImage, { height: layoutRow ? '75%' : '85%' }]}
        resizeMode="stretch"
      />

      <LinearGradient
        colors={[
          'transparent',
          'transparent',
          'rgba(21, 101, 192, 0.05)',
          'rgba(21, 101, 192, 0.15)',
          'rgba(21, 101, 192, 0.30)',
          'rgba(21, 101, 192, 0.50)',
          'rgba(21, 101, 192, 0.93)',
          'rgba(21, 101, 192, 0.93)',
          'rgba(21, 101, 192, 0.99)',
          '#1565C0ED',
          '#1565C0ED',
        ]}
        locations={[0, 0.30, 0.38, 0.44, 0.50, 0.56, 0.62, 0.68, 0.73, 0.78, 1]}
        style={styles.gradientLayer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <View
        style={[
          styles.contentSection,
          {
            paddingBottom:     layoutRow ? 90 : isPhone ? 24 : 36,
            paddingHorizontal: layoutRow ? 24 : isPhone ? 16 : 32,
          },
        ]}
      >
        <Text
          style={[
            styles.rightHeading,
            isPhone && { fontSize: 22, lineHeight: 26 },
          ]}
        >
          Real-Time Medical Support,{'\n'}When It Matters Most
        </Text>

        <Text style={styles.rightSubheading}>
          Empowering you with instant physician guidance to handle{'\n'}onboard
          medical emergencies with confidence
        </Text>

        <View style={styles.featuresRow}>
          <FeatureItem
            icon={require('../assets/Images/Safety.png')}
            subtitle={`24/7 access\n to qualified\n physicians`}
          />
          <FeatureItem
            icon={require('../assets/Images/Safety.png')}
            subtitle={`Instant\n tele-assistance\n for emergencies`}
          />
          <FeatureItem
            icon={require('../assets/Images/Safety.png')}
            subtitle={`Guided\n decision-making\n for critical care`}
          />
        </View>

        <View style={styles.dots}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={[styles.dot, i === 2 && styles.dotActive]} />
          ))}
        </View>
      </View>
    </View>
  );

  /* ── Root ── */
  return (
    <View style={[styles.container, { backgroundColor: theme.lsLeftPanelBg }]}>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.lsStatusBarBg}
      />

      {layoutRow ? (
        <View style={styles.mainRow}>
          {LeftPanel}
          {RightPanel}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.stackedContainer}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {RightPanel}
          {LeftPanel}
        </ScrollView>
      )}
    </View>
  );
}

/* ─── Styles  (no colour values here — all colours come from theme tokens) ── */
const styles = StyleSheet.create({
  container:        { flex: 1 },
  mainRow:          { flex: 1, flexDirection: 'row' },
  stackedContainer: { flexGrow: 1 },

  /* LEFT PANEL */
  leftPanel: {
    justifyContent: 'center',
  },
  topRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   32,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  logoIcon: {
    width:             90,
    height:            96,
    borderRadius:      32,
    overflow:          'hidden',
    marginRight:       12,
    justifyContent:    'center',
    alignItems:        'center',
    paddingHorizontal: 20,
  },
  logoText: {
    fontSize:   30,
    fontWeight: '800',
    lineHeight: 40,
  },

  heading:    { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  subheading: { fontSize: 12, marginBottom: 22 },

  inputWrapper: { marginBottom: 14 },
  label:        { fontSize: 12, marginBottom: 5, fontWeight: '500' },
  input: {
    borderWidth:       1,
    borderRadius:      8,
    paddingHorizontal: 12,
    paddingVertical:   Platform.OS === 'ios' ? 10 : 9,
    fontSize:          13,
  },

  forgot: {
    textAlign:    'right',
    fontSize:     12,
    marginBottom: 12,
  },

  loginBtn: {
    borderRadius:    8,
    paddingVertical: 13,
    alignItems:      'center',
    marginTop:       6,
  },
  loginBtnText: {
    fontSize:      15,
    fontWeight:    '700',
    letterSpacing: 0.5,
  },

  /* RIGHT PANEL */
  rightPanel:    { overflow: 'hidden', backgroundColor: '#1565C0ED' },
  fullImage: {
    position: 'absolute',
    top:      0,
    left:     0,
    right:    0,
    width:    '100%',
  },
  gradientLayer: {
    position: 'absolute',
    top:      0,
    left:     0,
    right:    0,
    bottom:   0,
  },
  contentSection: {
    position:  'absolute',
    bottom:    -60,
    left:      0,
    right:     0,
    paddingTop: 24,
  },
  rightHeading: {
    color:        '#fff',
    fontSize:     30,
    fontWeight:   '800',
    textAlign:    'center',
    lineHeight:   36,
    marginBottom: 14,
  },
  rightSubheading: {
    color:             'rgba(255,255,255,0.9)',
    fontSize:          11,
    textAlign:         'center',
    lineHeight:        20,
    marginBottom:      28,
    paddingHorizontal: 20,
    fontWeight:        '500',
  },
  featuresRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   24,
  },
  featureItem: {
    flex:              1,
    flexDirection:     'row',
    alignItems:        'center',
    gap:               8,
    paddingHorizontal: 6,
    marginLeft:        12,
  },
  featureIconImage: {
    width:     28,
    height:    28,
    tintColor: '#fff',
  },
  featureText: {
    flex:       1,
    color:      '#fff',
    fontSize:   10,
    fontWeight: '400',
    lineHeight: 16,
  },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: {
    width:           7,
    height:          7,
    borderRadius:    4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: { backgroundColor: '#fff', width: 20 },
});