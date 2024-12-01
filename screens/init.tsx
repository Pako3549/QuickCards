import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, BackHandler } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import ScanCard from '../assets/scan-card.svg';
import BackArrow from '../assets/icons/chevron-grey.svg';

const InitScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [bio, setBio] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [_error, setError] = useState('');

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  const handleWriteCard = async () => {
    if (!firstName || !lastName || !email || !number || !bio) {
      setError('Tutti i campi sono obbligatori');
      setModalMessage('Tutti i campi sono obbligatori');
      setIsActionModalVisible(true);
      return;
    }

    setIsModalVisible(true);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const cardData = {
        firstName: '',
        lastname: '',
        email: '',
        number: '',
        bio: '',
      };

      const ndefMessage = Ndef.encodeMessage([Ndef.textRecord(JSON.stringify(cardData))]);
      await NfcManager.ndefHandler.writeNdefMessage(ndefMessage);

      setModalMessage(`Carta inizializzata: ${cardData.firstName} ${cardData.lastname}`);
      setIsActionModalVisible(true);
    } catch (ex) {
      console.warn(ex);
      setModalMessage('Si è verificato un errore durante la scrittura della carta NFC');
      setIsActionModalVisible(true);
    } finally {
      NfcManager.cancelTechnologyRequest();
      setIsModalVisible(false);
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => navigation.navigate('Home')}>
        <BackArrow style={styles.arrow} width={25} height={25} />
      </TouchableOpacity>
      <View style={styles.main}>
        <Text style={styles.title}> Inizializza carta </Text>
        <View>
          <TextInput style={styles.input} placeholder="Nome" value={firstName} onChangeText={setFirstName} keyboardType="default" placeholderTextColor="#AAA" />
        </View>
        <View>
          <TextInput style={styles.input} placeholder="Cognome" value={lastName} onChangeText={setLastName} keyboardType="default" placeholderTextColor="#AAA" />
        </View>
        <View>
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="default" placeholderTextColor="#AAA" />
        </View>
        <View>
          <TextInput style={styles.input} placeholder="Telephone Number" value={number} onChangeText={setNumber} keyboardType="numeric" placeholderTextColor="#AAA" />
        </View>
        <View>
          <TextInput style={styles.input} placeholder="Bio" value={bio} onChangeText={setBio} keyboardType="default" placeholderTextColor="#AAA" />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleWriteCard}>
          <Text style={styles.buttonText}>Inizializza</Text>
        </TouchableOpacity>
      </View>
      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScanCard style={styles.image} />
          </View>
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={isActionModalVisible} onRequestClose={() => setIsActionModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => {setIsActionModalVisible(false); navigation.navigate('Home');}}>
              <Text style={styles.closeButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  arrow: {
    position: 'absolute',
    left: 20,
    top: '50%',
    transform: [{ translateY: -5 }],
  },
  main: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 150,
  },
  title: {
    width: '100%',
    paddingBottom: 25,
    color: 'black',
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: 300,
    height: 50,
    backgroundColor: '#eee',
    color: '#000',
    borderRadius: 10,
    marginBottom: 12,
    paddingLeft: 50,
    paddingHorizontal: 8,
  },
  icon: {position: 'absolute', top: 13, left: 13},
  button: {
    width: '45%', height: 50,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#0D7C66',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  closeButton: {
    backgroundColor: '#0D7C66',
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    width: 50,
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  image: {
    marginBottom: 50,
    marginTop: 50,
  },
});

export default InitScreen;
