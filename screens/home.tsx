import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  BackHandler,
} from 'react-native';
import NfcManager from 'react-native-nfc-manager';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import SettingsIcon from '../assets/icons/settings.svg';

type RootStackParamList = {
  Home: undefined,
  BusinessCard: undefined,
  ChoiceInit: undefined,
  FreelanceInit: undefined,
  CompanyInit: undefined,
  Settings: undefined,
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
        <SettingsIcon width={25} height={25} />
      </TouchableOpacity>
      <Text style={styles.title}> QuickCards </Text>

      <TouchableOpacity style={styles.button} onPress={() => { NfcManager.cancelTechnologyRequest(); navigation.navigate('BusinessCard'); }}>
        <Text style={styles.buttonText}> Scan a business card </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {NfcManager.cancelTechnologyRequest(); navigation.navigate('ChoiceInit'); }}>
        <Text style={styles.buttonText}> Set up your own business card </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', paddingTop: 150, backgroundColor: '#010101'},
  title: {marginBottom: 150, fontSize: 50, fontWeight: 'bold', color: 'white'},
  button: {
    width: 300, height: 125,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    borderRadius: 10,
    backgroundColor: '#222',
  },
  buttonText: {width: '75%', fontSize: 25, fontWeight: 'bold', textAlign: 'center', color: 'white'},
  settingsButton: {position: 'absolute', top: 40, right: 20},
});

export default HomeScreen;
