import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, BackHandler } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import ScanCard from '../assets/scan-card.svg';
import BackArrow from '../assets/icons/chevron-grey.svg';

const CompanyInitScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [companyName, setCompanyName] = useState('');
  const [partitaIVA, setPartitaIVA] = useState('');
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
    if (!companyName || !partitaIVA || !email || !number || !bio) {
      setError('Tutti i campi sono obbligatori');
      setModalMessage('Tutti i campi sono obbligatori');
      setIsActionModalVisible(true);
      return;
    }

    setIsModalVisible(true);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const cardData = {
        companyName,
        partitaIVA,
        email,
        number,
        bio,
      };

      const ndefMessage = Ndef.encodeMessage([Ndef.textRecord(JSON.stringify(cardData))]);
      await NfcManager.ndefHandler.writeNdefMessage(ndefMessage);

      setModalMessage(`Carta inizializzata: ${cardData.companyName}`);
      setIsActionModalVisible(true);
    } catch (ex) {
      console.warn(ex);
      setModalMessage('Si è verificato un errore durante la scrittura della carta NFC');
      setIsActionModalVisible(true);
    } finally {
      NfcManager.cancelTechnologyRequest();
      setIsModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => navigation.navigate('Home')}>
        <BackArrow style={styles.arrow} width={25} height={25} />
      </TouchableOpacity>
      <View style={styles.main}>
        {/* <Text style={styles.title}> Inizializza carta </Text> */}
        <View>
          <TextInput style={styles.input} placeholder="Company Name" value={companyName} onChangeText={setCompanyName} keyboardType="default" placeholderTextColor="#AAA" />
        </View>
        <View>
          <TextInput style={styles.input} placeholder="Partita IVA" value={partitaIVA} onChangeText={setPartitaIVA} keyboardType="default" placeholderTextColor="#AAA" />
        </View>
        <View>
          <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="default" placeholderTextColor="#AAA" />
        </View>
        <View>
          <TextInput style={styles.input} placeholder="Telephone Number" value={number} onChangeText={setNumber} keyboardType="numeric" placeholderTextColor="#AAA" />
        </View>
        <View>
          <TextInput style={styles.input} placeholder="Bio" value={bio} onChangeText={setBio} keyboardType="default" placeholderTextColor="#AAA" />
        </View>

        <Text style={styles.linksTitle}> Links </Text>

        <TextInput style={styles.input} placeholder="Link" value={bio} onChangeText={setBio} keyboardType="default" placeholderTextColor="#AAA" />
        <TextInput style={styles.input} placeholder="Link" value={bio} onChangeText={setBio} keyboardType="default" placeholderTextColor="#AAA" />
        <TextInput style={styles.input} placeholder="Link" value={bio} onChangeText={setBio} keyboardType="default" placeholderTextColor="#AAA" />

        <TouchableOpacity style={styles.setUpBtn} onPress={handleWriteCard}>
          <Text style={styles.setUpBtnText}> Set up </Text>
        </TouchableOpacity>
      </View>


      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <ScanCard style={styles.image} />
        </View>
      </Modal>
      <Modal animationType="slide" transparent={true} visible={isActionModalVisible} onRequestClose={() => setIsActionModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <TouchableOpacity style={styles.modalBtn} onPress={() => {setIsActionModalVisible(false); navigation.navigate('Home');}}>
            <Text style={styles.modalBtnText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
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
  main: {height: '95%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 75},

  linksTitle: {margin: 15, fontSize: 35, fontWeight: 'bold', textAlign: 'center', color: 'white'},
  input: {
    width: 300,
    height: 50,
    color: 'white',
    borderRadius: 10,
    marginBottom: 12,
    paddingLeft: 20,
    paddingHorizontal: 8,
    backgroundColor: '#222',
  },
  icon: {position: 'absolute', top: 13, left: 13},

  setUpBtn: {
    width: 300, height: 75,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#789DBC',
    marginTop: 25,
    borderRadius: 10,
    marginVertical: 10,
  },
  setUpBtnText: {fontSize: 25, fontWeight: 'bold', textAlign: 'center', color: 'white'},


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

export default CompanyInitScreen;
