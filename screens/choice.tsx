import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  BackHandler,
} from 'react-native';
import NfcManager from 'react-native-nfc-manager';

const ChoiceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

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
      <TouchableOpacity style={styles.button} onPress={() => { NfcManager.cancelTechnologyRequest(); navigation.navigate('CompanyInit'); }}>
        <Text style={styles.buttonText}> Company </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {NfcManager.cancelTechnologyRequest(); navigation.navigate('FreelanceInit'); }}>
        <Text style={styles.buttonText}> Freelance </Text>
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

export default ChoiceScreen;
