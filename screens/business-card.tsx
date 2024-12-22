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
} from 'react-native';
import NfcManager, { NfcTech, NfcEvents, Ndef } from 'react-native-nfc-manager';
import ScanCard from '../assets/scan-card.svg';
import BackArrow from '../assets/icons/chevron-grey.svg';

const BusinessCardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [hasNfc, setHasNFC] = useState<boolean | null>(null);
  const [tag, setTag] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isScanning] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  const navigateToInitScreen = () => {
    setIsActionModalVisible(false);
    navigation.navigate('Init');
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
        } catch (e) {
          throw new Error('Carta non inizializzata');
        }

        if (!cardData.firstName || !cardData.lastName || !cardData.email || !cardData.number || !cardData.bio) {
          throw new Error('Carta non inizializzata');
        }

        // Gestisci i dati della carta come necessario
        setTag(cardData);
      } else {
        throw new Error('Carta non inizializzata');
      }
    } catch (ex) {
      console.warn(ex);
      if (ex instanceof Error && ex.message === 'Carta non inizializzata') {
        setModalMessage('La carta non è ancora stata inizializzata');
      } else {
        setModalMessage('Si è verificato un errore durante la lettura della carta NFC');
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
        return true; // Disattiva il pulsante "Indietro"
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
        <Text>Checking NFC support...</Text>
      </View>
    );
  }

  if (!hasNfc) {
    return (
      <View style={styles.sectionContainer}>
        <Text>NFC not supported</Text>
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
            <View style={styles.pfp}> <Text style={styles.pfpText}> { tag?.firstName?.charAt(0) + tag?.lastName?.charAt(0) || ':D' } </Text> </View>
            <Text style={styles.name}>{ tag ? (tag?.firstName + ' ' + tag?.lastName) : 'Name Surname' }</Text>
            <Text style={styles.job}>Junior Developer and High School Student</Text>
            <Text style={styles.email}>E-mail: { tag?.email || 'unset' }</Text>
            <Text style={styles.phone}>Telephone Number: { tag?.number || 'unset' }</Text>
          </View>

          <View style={styles.linksContainer}>
            <Text style={styles.linksTitle}> LINKS </Text>
            <View style={styles.links}>
              <TouchableOpacity style={styles.link} />
              <TouchableOpacity style={styles.link} />
              <TouchableOpacity style={styles.link} />
            </View>
          </View>

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
        {modalMessage === 'La carta non è ancora stata inizializzata' ? (
          <TouchableOpacity style={styles.modalBtn} onPress={navigateToInitScreen}>
            <Text style={[styles.modalBtnText, styles.initializeBtn]}> Inizializza </Text>
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
  sectionContainer: {marginTop: 30, marginHorizontal: 25},
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
  pfpText: {fontSize: 50, fontWeight: 'bold', textAlign: 'center', color: 'white'},
  name: {marginTop: 50, fontSize: 30, fontWeight: 'bold', textAlign: 'right', color: 'white'},
  job: {maxWidth: '75%', marginBottom: 25, fontSize: 17, textAlign: 'right', color: 'white'},
  email: {fontSize: 17, textAlign: 'right', color: 'white'},
  phone: {fontSize: 17, textAlign: 'right', color: 'white'},
  linksContainer: {
    width: 350,
    alignItems: 'center',
    marginVertical: 25,
    padding: 25,
    borderRadius: 10,
    backgroundColor: '#222',
  },
  linksTitle: {fontSize: 25, fontWeight: 'bold', textAlign: 'center', color: 'white'},
  links: {flexDirection: 'row', flexWrap: 'wrap', marginTop: 25},
  link: {width: 75, height: 75, margin: 12, borderRadius: '100%', backgroundColor: '#789DBC'},
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
