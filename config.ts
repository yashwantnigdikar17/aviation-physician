import { Platform } from 'react-native';

// Set this when using a physical device (same WiFi as your backend machine), e.g. 'http://192.168.1.5:5000'
// https://jitsiapi.databin.in/
// const DEV_BACKEND_OVERRIDE = 'http://103.171.55.14:9200'; // no trailing slash
const DEV_BACKEND_OVERRIDE = 'https://tiajitsistg.tiatech.net/'; // no trailing slash
  // const DEV_BACKEND_OVERRIDE = 'http://192.168.1.33:9200'; // no trailing slash
//  const DEV_BACKEND_OVERRIDE = 'http://10.91.103.128:9200'; // no trailing slash
const getApiBaseUrl = () => {
  if (DEV_BACKEND_OVERRIDE) return DEV_BACKEND_OVERRIDE.replace(/\/+$/, '');
  if (__DEV__ && Platform.OS === 'android') {
    return 'http://10.0.2.2:5000'; // Android emulator → host machine
  }
  return 'http://103.141.116.109:5000';
};

export const API_BASE_URL = getApiBaseUrl();
