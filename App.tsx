import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import HomeScreen from './screens/home.tsx';
import BusinessCardScreen from './screens/business-card.tsx';
import InitScreen from './screens/init.tsx';

enableScreens();

type RootStackParamList = {
  Home: undefined;
  BusinessCard: undefined;
  Init: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BusinessCard" component={BusinessCardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Init" component={InitScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
