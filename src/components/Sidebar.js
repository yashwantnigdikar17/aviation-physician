// components/Sidebar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NAV_ITEMS = [
  { key: 'allEvents', label: 'All Events', icon: 'event-note', screen: 'AllEvent' },
  { key: 'medicines', label: 'Medicines', icon: 'medical-services', screen: 'CaseDetail' },
  { key: 'faqs', label: 'FAQs', icon: 'help-outline', screen: 'FAQs' },
];

const Sidebar = ({ activeKey, navigation }) => (
  <View style={styles.sidebar}>
    <View style={styles.logoArea}>
    
  <Image 
    source={require('../assets/Images/logo.png')} 
    style={styles.logoImage} 
    resizeMode="contain"
  />

      <Text style={styles.logoText}>TiaTELE</Text>
    </View>
    

    <View style={styles.navList}>
      {NAV_ITEMS.map(item => {
        const isActive = item.key === activeKey;
        return (
          <TouchableOpacity
            key={item.key}
            style={[styles.navItem, isActive && styles.navItemActive]}
            activeOpacity={0.75}
            onPress={() => {
              if (item.screen === 'CaseDetail') {
                navigation.navigate('CaseDetail');
              } else if (item.screen === 'AllEvent') {
                navigation.navigate('AllEvent');
              } else {
                alert(`${item.label} screen coming soon`);
              }
            }}
          >
            
            <MaterialIcons
              name={item.icon}
              size={18}
              color={isActive ? '#1565C0' : '#9AA5B4'}
            />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
          
        );
      })}
    </View>
    {/* ✅ Logout Button HERE */}
  <View style={styles.bottomSection}>
    <TouchableOpacity
      style={styles.logoutBtn}
      onPress={() =>
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      }
    >
      <MaterialIcons name="logout" size={20} color="#d32f2f" />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  </View>


  </View>
);

export default Sidebar;

const styles = StyleSheet.create({
  sidebar: {
    width: 80,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#EEF0F4',
    alignItems: 'center',
    paddingTop: 12,
  },
  logoArea: { 
    alignItems: 'center', 
    marginBottom: 24 
  },
  logoImage: {
  width: 90,
  height: 70,
},
  logoIconBg: {
    width: 36, 
    height: 36, 
    borderRadius: 10,
    backgroundColor: '#1565C0', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 4,
  },
  logoText: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: '#1565C0', 
    letterSpacing: 0.5 
  },
  navList: { 
    width: '100%', 
    alignItems: 'center', 
    gap: 4 
  },
  navItem: {
    width: '100%', 
    alignItems: 'center', 
    paddingVertical: 10, 
    paddingHorizontal: 4, 
    gap: 4,
  },
  navItemActive: { 
    backgroundColor: '#EBF2FF', 
    borderRightWidth: 3, 
    borderRightColor: '#1565C0' 
  },
  navLabel: { 
    fontSize: 8, 
    color: '#9AA5B4', 
    fontWeight: '500', 
    textAlign: 'center' 
  },
  navLabelActive: { 
    color: '#1565C0', 
    fontWeight: '700' 
  },
  bottomSection: {
  marginTop: 'auto', // 👈 pushes to bottom
  marginBottom: 20,
  alignItems: 'center',
},

logoutBtn: {
  alignItems: 'center',
  paddingVertical: 10,
  gap: 4,
},

logoutText: {
  fontSize: 10,
  color: '#d32f2f',
  fontWeight: '600',
},
});