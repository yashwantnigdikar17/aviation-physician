// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// ── Eye / Eye-off icon ────────────────────────────────────────────────────────
import Svg, { Path, Circle } from 'react-native-svg';

const EyeIcon = ({ visible }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    {visible ? (
      <>
        <Path
          d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
          stroke="#2563eb"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle
          cx="12"
          cy="12"
          r="3"
          stroke="#2563eb"
          strokeWidth="1.8"
        />
      </>
    ) : (
      <>
        <Path
          d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12A18.45 18.45 0 0 1 5.06 6.06M9.9 4.24A9.12 9.12 0 0 1 12 4C19 4 23 12 23 12A18.5 18.5 0 0 1 20.71 15.71"
          stroke="#2563eb"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M1 1L23 23"
          stroke="#2563eb" 
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    )}
  </Svg>
);

// ── Main LoginScreen ──────────────────────────────────────────────────────────
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('dr.johnson@telecare.com');
  const [password, setPassword] = useState('QA-B737');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    if (email === 'dr.johnson@telecare.com' && password === 'QA-B737') {
      console.log('Login successful', { email, password });
      navigation.replace('AllEvent');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Instructions to reset your password will be sent to your registered email address.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#e4eef9" translucent />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <View style={styles.logoRow}>
            <Image
              source={require('../assets/Images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View style={styles.logoTextWrap}>
              <Text style={styles.logoText}>
                <Text style={styles.logoTia}>Tia</Text>
                <Text style={styles.logoTele}>TELE</Text>
              </Text>
            </View>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Telecare Provider Portal</Text>
            <Text style={styles.cardSub}>Secure access for medical professionals</Text>

            {/* Email Field */}
            <Text style={styles.label}>Email</Text>
            <View
              style={[
                styles.inputWrap,
                emailFocused && styles.inputWrapFocused,
              ]}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#9ca3af"
                placeholder="Enter your email"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            {/* Password Field */}
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputWrap,
                passwordFocused && styles.inputWrapFocused,
              ]}>
              <TextInput
                style={[styles.input, styles.inputPassword]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#9ca3af"
                placeholder="Enter your password"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(prev => !prev)}
                activeOpacity={0.7}>
                <EyeIcon visible={showPassword} />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotWrap}
              activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              activeOpacity={0.85}>
              <Text style={styles.loginBtnText}>Login</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e4eef9',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
// Logo - Alternative tighter version
logoRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 28,
  gap: 0,
  marginRight: 35,
  
},
logoImage: {
  width: 120,  // Slightly smaller logo
  height: 85,
  marginRight: -13, // Pull text under/over the logo edge
},
logoTextWrap: {
  marginLeft: -6, // Negative margin to overlap slightly
  backgroundColor: 'transparent',
},
logoText: {
  fontSize: 26,  // Slightly smaller text
  fontWeight: '700',
  letterSpacing: -0.5,
},
logoTia: {
  color: '#1a2e4a',
},
logoTele: {
  color: '#2563eb',
},
  // Card
  card: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 36,
    shadowColor: '#1e3c78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardSub: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 28,
  },

  // Form
  label: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '400',
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f6fb',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    marginBottom: 18,
  },
  inputWrapFocused: {
    borderColor: '#2563eb',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
    color: '#111827',
  },
  inputPassword: {
    paddingRight: 48,
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },

  // Forgot
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    color: '#2563eb',
    textDecorationLine: 'underline',
  },

  // Login button
  loginBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});