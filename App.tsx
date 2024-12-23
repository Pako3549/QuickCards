import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import HomeScreen from './screens/home.tsx';
import ChoiceScreen from './screens/choice.tsx';
import BusinessCardScreen from './screens/business-card.tsx';
import FreelanceInitScreen from './screens/freelance-init.tsx';
import CompanyInitScreen from './screens/company-init.tsx';
import SettingsScreen from './screens/settings';

enableScreens();

type RootStackParamList = {
  Home: undefined,
  BusinessCard: undefined,
  ChoiceInit: undefined,
  FreelanceInit: undefined,
  CompanyInit: undefined,
  Settings: undefined,
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BusinessCard" component={BusinessCardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChoiceInit" component={ChoiceScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FreelanceInit" component={FreelanceInitScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CompanyInit" component={CompanyInitScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
