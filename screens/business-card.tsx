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
  /* const [isButtonDisabled, setIsButtonDisabled] = useState(false); */
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
        }
        catch (e){ throw new Error('Carta non inizializzata'); }

        if(!cardData.balance || !cardData.cardHolder){ throw new Error('Carta non inizializzata'); }

        // Gestisci i dati della carta come necessario
        setTag(cardData);
      }
      else{ throw new Error('Carta non inizializzata'); }
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
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <TouchableOpacity style={styles.header} onPress={() => navigation.navigate('Home')}>
          <BackArrow style={styles.arrow} width={25} height={25} />
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.upper}>
            <Text style={styles.name}> {tag?.cardHolder || 'Nome Cognome'} </Text>
          </View>
          <View style={styles.lower}>
            <Text style={styles.balance}> {tag?.balance || '0.00'} </Text>
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
            <Text style={styles.modalBtnText}>Inizializza</Text>
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
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  title: {
    width: '100%',
    paddingTop: 50,
    color: 'black',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  arrow: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -5 }],
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  btn: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  textWhite: {
    color: 'white',
  },
  tagContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
  },
  tagText: {
    color: 'black',
  },
  errorContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'pink',
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },

  card: {
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    margin: 20,
    marginTop: 25,
    padding: 15,
    borderRadius: 15,
    elevation: 4,         // Android
    shadowColor: '#000',  // IOS
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  upper: {
    width: '100%',
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lower: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 75,
  },
  name: {fontSize: 16, fontWeight: 'bold', color: '#0D7C66'},
  balance: {fontSize: 50, fontWeight: 'bold', color: '#f2a900'},




  modalContainer: {
    width: '100%', height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#010101',
  },
  modalText: {marginBottom: 20, fontSize: 20, fontWeight: 'bold', color: 'white'},
  modalBtn: {paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, backgroundColor: '#789DBC'},
  modalBtnText: {width: 50, fontSize: 18, textAlign: 'center', color: 'white'},
  image: {marginVertical: 50},
});

export default BusinessCardScreen;
