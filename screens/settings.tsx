import React, { useEffect } from 'react';
import {View, TouchableOpacity, StyleSheet, BackHandler, Text, Linking} from 'react-native';
import BackArrow from '../assets/icons/chevron-grey.svg';
import GithubIcon from '../assets/icons/social/github.svg';
import LinkedInIcon from '../assets/icons/social/linkedin.svg';
import TelegramIcon from '../assets/icons/social/telegram.svg';

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
          {'\n'}{'\n'}
          Unauthorized copying, distribution, modification, or any other use of the content provided on this application is strictly prohibited without prior written consent from QuickCards.
          {'\n'}{'\n'}
          For permissions or any other inquiries, please contact us at the contacts below.
        </Text>
        <View style={styles.authorsContainer}>
          <Text style={styles.title}>Authors</Text>
            <View style={styles.authors}>
              <View style={styles.author}>
                <View style={styles.icons}>
                  <GithubIcon width={50} onPress={() => openGitHubProfile('https://github.com/Pako3549')} />
                  <TelegramIcon width={50} onPress={() => openGitHubProfile('https://t.me/pako3549')} />
                </View>
                <Text style={styles.authorText}> pako3549 </Text>
              </View>
              <View style={styles.author}>
                <View style={styles.icons}>
                  <GithubIcon width={50} onPress={() => openGitHubProfile('https://github.com/gkkconan')} />
                  <LinkedInIcon width={50} onPress={() => openGitHubProfile('https://www.linkedin.com/in/gkkconan/')} />
                </View>
                <Text style={styles.authorText}> gkkconan </Text>
              </View>
            </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#010101', padding: 20},
  header: {flexDirection: 'row', alignItems: 'center', marginTop: 40},
  
  arrow: {position: 'absolute', left: 20, top: '50%', transform: [{ translateY: -5 }]},
  content: {flex: 1, justifyContent: 'flex-start', alignItems: 'center', marginTop: 75},
  title: {fontSize: 30, fontWeight: 'bold', color: 'white', marginBottom: 20},
  text: {width: '90%', fontSize: 16, color: 'white', textAlign: 'center', marginBottom: 10},

  authorsContainer: {alignItems: 'center', marginTop: 100},
  authors: {flexDirection: 'row', gap: 50},
  author: {alignItems: 'center'},
  icons: {flexDirection: 'row', gap: 15},
  authorText: {marginTop: -10, color: 'white'},
});

export default SettingsScreen;
