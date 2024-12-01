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

      <TouchableOpacity onPress={() => { NfcManager.cancelTechnologyRequest(); navigation.navigate('BusinessCard'); }}>
        <Text>Go to your own business card</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {NfcManager.cancelTechnologyRequest(); navigation.navigate('Init'); }}>
        <Text>Set up your own business card</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {marginTop: 50, marginBottom: 50},
  greeting: {
    marginTop: -25,
    marginBottom: 75,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D7C66',
  },
  button: {width: 300, height: 50, marginBottom: 15},
});

export default HomeScreen;
