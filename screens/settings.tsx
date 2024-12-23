import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from 'react-native';
import BackArrow from '../assets/icons/chevron-grey.svg';

const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {

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

      <TouchableOpacity style={styles.header} onPress={() => navigation.navigate('Home')}>
        <BackArrow style={styles.arrow} width={25} height={25} />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', paddingTop: 150, backgroundColor: '#010101'},
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  arrow: {position: 'absolute', left: 20, top: '50%', transform: [{ translateY: -5 }]},
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

export default SettingsScreen;
