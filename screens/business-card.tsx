import React, { useState, useEffect } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  BackHandler,
  Linking,
} from 'react-native';
import NfcManager, { NfcTech, NfcEvents, Ndef } from 'react-native-nfc-manager';
import ScanCard from '../assets/scan-card.svg';
import BackArrow from '../assets/icons/chevron-grey.svg';
import { fieldMap } from '../environments/global';
import FacebookIcon from '../assets/icons/social/facebook.svg';
import GeneralIcon from '../assets/icons/social/general.svg';
import GithubIcon from '../assets/icons/social/github.svg';
import InstagramIcon from '../assets/icons/social/instagram.svg';
import LinkedInIcon from '../assets/icons/social/linkedin.svg';
import TelegramIcon from '../assets/icons/social/telegram.svg';
import ThreadsIcon from '../assets/icons/social/threads.svg';
import TikTokIcon from '../assets/icons/social/tiktok.svg';
import WhatsappIcon from '../assets/icons/social/whatsapp.svg';
import XIcon from '../assets/icons/social/x.svg';

const linkToSvgMap: { [key: string]: any } = {
  'facebook.com': FacebookIcon,
  'github.com': GithubIcon,
  'instagram.com': InstagramIcon,
  'linkedin.com': LinkedInIcon,
  't.me': TelegramIcon,
  'threads.net': ThreadsIcon,
  'tiktok.com': TikTokIcon,
  'wa.me': WhatsappIcon,
  'x.com': XIcon,
  'default': GeneralIcon,
};

const BusinessCardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [hasNfc, setHasNFC] = useState<boolean | null>(null);
  const [tag, setTag] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isScanning] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  const navigateToInitScreen = () => {
    setIsActionModalVisible(false);
    navigation.navigate('Choice');
  };

  const readTag = async () => {
    setIsModalVisible(true);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const scannedTag = await NfcManager.getTag();
      const ndefMessage = scannedTag?.ndefMessage;

      if (ndefMessage && ndefMessage.length > 0) {
        const text = Ndef.text.decodePayload(new Uint8Array(ndefMessage[0].payload));
        let cardData;
        try {
          cardData = JSON.parse(text);
          cardData = {
            type: cardData[fieldMap.type],
            firstName: cardData[fieldMap.firstName],
            lastName: cardData[fieldMap.lastName],
            employement: cardData[fieldMap.employement],
            placeOfEmployement: cardData[fieldMap.placeOfEmployement],
            email: cardData[fieldMap.email],
            number: cardData[fieldMap.number],
            bio: cardData[fieldMap.bio],
            links: cardData[fieldMap.links],
            companyName: cardData[fieldMap.companyName],
            partitaIVA: cardData[fieldMap.partitaIVA],
          };
        } catch (e) {
          throw new Error('Card not initialized');
        }

        if (cardData.type === '0') {
          if (!cardData.firstName || !cardData.lastName || !cardData.employement || !cardData.email || !cardData.number) {
            throw new Error('Card not initialized');
          }
        } else if (cardData.type === '1') {
          if (!cardData.companyName || !cardData.partitaIVA || !cardData.email || !cardData.number) {
            throw new Error('Card not initialized');
          }
        } else {
          throw new Error('Unrecognized card type');
        }

        setTag(cardData);
      } else {
        throw new Error('Card not initialized');
      }
    } catch (ex) {
      console.warn(ex);
      if (ex instanceof Error && ex.message === 'Card not initialized') {
        setModalMessage('The card has not been initialized yet');
      } else {
        setModalMessage('An error occurred while reading the NFC card');
      }
      setIsActionModalVisible(true);
    } finally {
      NfcManager.cancelTechnologyRequest();
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    const checkIsSupported = async () => {
      const deviceIsSupported = await NfcManager.isSupported();
      setHasNFC(deviceIsSupported);
      if (deviceIsSupported) {
        await NfcManager.start();
        await readTag();
      }
    };

    checkIsSupported();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isScanning) {
        return true;
      } else {
        navigation.goBack();
        return true;
      }
    });

    return () => {
      backHandler.remove();
    };
  }, [navigation, isScanning]);

  useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (detectedTag: any) => {
      setTag(detectedTag);
      NfcManager.setAlertMessageIOS('Tag found');
      NfcManager.unregisterTagEvent().catch(() => 0);
    });

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, []);

  if (hasNfc === null) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.textWhite}>Checking NFC support...</Text>
      </View>
    );
  }

  if (!hasNfc) {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.textWhite}>NFC not supported</Text>
      </View>
    );
  }

  return (
<SafeAreaView style={styles.container}>
  <TouchableOpacity style={styles.header} onPress={() => navigation.navigate('Home')}>
    <BackArrow style={styles.arrow} width={25} height={25} />
  </TouchableOpacity>
  <ScrollView contentInsetAdjustmentBehavior="automatic">
    <View style={styles.main}>
      <View style={styles.card}>
        <View style={styles.pfp}>
          <Text style={styles.pfpText}>{tag?.type === '0' ? (tag?.firstName?.charAt(0) + tag?.lastName?.charAt(0)) : (tag?.companyName?.charAt(0) + tag?.companyName?.charAt(1)) || ':D'}</Text>
        </View>
        <Text style={styles.name}>{tag?.type === '0' ? `${tag?.firstName.charAt(0).toUpperCase() + tag?.firstName.slice(1).toLowerCase()} ${tag?.lastName.charAt(0).toUpperCase() + tag?.lastName.slice(1).toLowerCase()}` : tag?.companyName || 'Name Surname'}</Text>
        <Text style={styles.employement}>{tag?.type === '0' ? tag?.employement : `Partita IVA: ${tag?.partitaIVA}` || 'Employment'}</Text>
        {tag?.type === 0 && tag?.placeOfEmployement?.length > 0 && (<Text style={styles.info}>Place of employment: {tag.placeOfEmployement}</Text>)}
        <Text style={styles.info}>E-mail: {tag?.email || 'unset'}</Text>
        <Text style={styles.info}>Telephone Number: {tag?.number || 'unset'}</Text>
        {tag?.type !== 0 && tag?.description?.length > 0 && (<Text style={styles.info}>Description: {tag.description}</Text>)}
      </View>
      {tag?.type === '0' && tag?.bio.length > 0 && (<Text style={styles.bio}>{tag.bio}</Text>)}


      {tag?.links && tag?.links.length > 0 && (
        <View style={styles.linksContainer}>
          <Text style={styles.linksTitle}> LINKS {tag?.link} </Text>
          <View style={styles.links}>
            {tag?.links.map((link: string, index: number) => {
              link = link.toLowerCase();
              const normalizedLink = link.startsWith('http') ? link : `https://${link}`;
              const baseLink = normalizedLink.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
              const SvgIcon = linkToSvgMap[baseLink] || linkToSvgMap.default;

              return (
                <TouchableOpacity key={index} style={styles.link} onPress={() => Linking.openURL(normalizedLink)}>
                  {React.createElement(SvgIcon, { width: 50, height: 50 })}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}


    </View>

  </ScrollView>


      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <ScanCard style={styles.image} />
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={isActionModalVisible} onRequestClose={() => setIsActionModalVisible(false)}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalText}>{modalMessage}</Text>
        {modalMessage === 'The card has not been initialized yet' ? (
          <TouchableOpacity style={styles.modalBtn} onPress={navigateToInitScreen}>
            <Text style={[styles.modalBtnText, styles.initializeBtn]}> Initialize </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.modalBtn} onPress={() => setIsActionModalVisible(false)}>
            <Text style={styles.modalBtnText}>OK</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', backgroundColor: '#010101'},
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  arrow: {position: 'absolute', left: 20, top: '50%', transform: [{ translateY: -5 }]},
  main: {height: '95%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 100},
  sectionContainer: {marginTop: 30, marginHorizontal: 25, color: 'black'},
  textWhite: {color: '#FFFFFF'},
  card: {
    width: 350,
    alignItems: 'flex-end',
    marginVertical: 25,
    padding: 25,
    borderRadius: 10,
    backgroundColor: '#222',
  },
  pfp: {
    width: 100, height: 100,
    position: 'absolute',
    top: -50, left: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    backgroundColor: '#789DBC',
  },
  pfpText: {fontSize: 50, fontWeight: 'bold', textAlign: 'center', color: 'white', textTransform: 'uppercase'},
  name: {marginTop: 50, fontSize: 30, fontWeight: 'bold', textAlign: 'right', color: 'white'},
  employement: {maxWidth: '75%', marginBottom: 25, fontSize: 17, textAlign: 'right', color: 'white'},
  info: {fontSize: 17, textAlign: 'right', color: 'white'},
  bio: {color: 'white', marginTop: -5},
  linksContainer: {
    width: 350,
    alignItems: 'center',
    marginVertical: 50,
    padding: 25,
    borderRadius: 10,
    backgroundColor: '#222',
  },
  linksTitle: {fontSize: 25, fontWeight: 'bold', textAlign: 'center', color: 'white'},
  links: {flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 25},
  link: {width: 50, height: 50, borderRadius: '100%'},
  modalContainer: {
    width: '100%', height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#010101',
  },
  modalText: {marginBottom: 20, fontSize: 20, fontWeight: 'bold', color: 'white'},
  modalBtn: {paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, backgroundColor: '#789DBC'},
  initializeBtn: {width: 100},
  modalBtnText: {width: 50, fontSize: 18, textAlign: 'center', color: 'white'},
  image: {marginVertical: 50},
});

export default BusinessCardScreen;
