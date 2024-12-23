import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Text,
  Linking,
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

  const openGitHubProfile = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => navigation.goBack()}>
        <BackArrow style={styles.arrow} width={25} height={25} />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>Copyright Information</Text>
        <Text style={styles.text}>
          © 2024 QuickCards. All rights reserved.
        </Text>
        <Text style={styles.text}>
          Unauthorized copying, distribution, modification, or any other use of the content provided on this application is strictly prohibited without prior written consent from QuickCards.
        </Text>
        <Text style={styles.text}>
          For permissions or any other inquiries, please contact us at bellarosa.pasquale@gmail.com
        </Text>
        <Text style={styles.title}>Authors</Text>
        <Text style={styles.text} onPress={() => openGitHubProfile('https://github.com/Pako3549')}>
          Pako3549 - https://github.com/Pako3549
        </Text>
        <Text style={styles.text} onPress={() => openGitHubProfile('https://github.com/gkkconan')}>
          gkkconan - https://github.com/gkkconan
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#010101', padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  arrow: { position: 'absolute', left: 20, top: '50%', transform: [{ translateY: -5 }] },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 30, fontWeight: 'bold', color: 'white', marginBottom: 20 },
  text: { fontSize: 16, color: 'white', textAlign: 'center', marginBottom: 10 },
});

export default SettingsScreen;
