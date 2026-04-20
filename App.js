import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import  LoginScreen  from './src/screens/LoginScreen';
import Alleventsscreen from './src/screens/Alleventsscreen';


import MeetingScreen from './src/screens/MeetingScreen';
import CaseDetailScreen from './src/screens/CaseDetailScreen';





const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false, animation: 'fade' }}
      >
      <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AllEvent" component={Alleventsscreen} />

       
      
        <Stack.Screen name="Meeting" component={MeetingScreen} />
         
        <Stack.Screen name="CaseDetail" component={CaseDetailScreen} />

       

      </Stack.Navigator>
    </NavigationContainer>
  );
}