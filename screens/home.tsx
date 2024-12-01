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

type RootStackParamList = {
  Home: undefined;
  BusinessCard: undefined;
  Init: undefined;
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

      <Text style={styles.title}> QuickCards </Text>

      <TouchableOpacity style={styles.button} onPress={() => { NfcManager.cancelTechnologyRequest(); navigation.navigate('BusinessCard'); }}>
        <Text style={styles.buttonText}> Scan a business card </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {NfcManager.cancelTechnologyRequest(); navigation.navigate('Init'); }}>
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
});

export default HomeScreen;