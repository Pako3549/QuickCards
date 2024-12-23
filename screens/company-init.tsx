import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, BackHandler } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import ScanCard from '../assets/scan-card.svg';
import BackArrow from '../assets/icons/chevron-grey.svg';
import { fieldMap } from '../environments/global';

const CompanyInitScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [companyName, setCompanyName] = useState('');
  const [partitaIVA, setPartitaIVA] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [bio, setBio] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [linkFields, setLinkFields] = useState<string[]>([]);
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
    if (!companyName || !partitaIVA || !email || !number ) {
      setError('Fill in the required fields!');
      setModalMessage('Fill in the required fields!');
      setIsActionModalVisible(true);
      return;
    }

    setIsModalVisible(true);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const cardData = {
        [fieldMap.type]: '1',
        [fieldMap.companyName]: companyName,
        [fieldMap.partitaIVA]: partitaIVA,
        [fieldMap.email]: email,
        [fieldMap.number]: number,
        [fieldMap.bio]: bio,
        [fieldMap.links]: linkFields,
      };

      const ndefMessage = Ndef.encodeMessage([Ndef.textRecord(JSON.stringify(cardData))]);
      await NfcManager.ndefHandler.writeNdefMessage(ndefMessage);

      setModalMessage(`Initialized business card: ${companyName}`);
      setIsActionModalVisible(true);
    } catch (ex) {
      console.warn(ex);
      setModalMessage('An error occurred while writing the NFC card');
      setIsActionModalVisible(true);
    } finally {
      NfcManager.cancelTechnologyRequest();
      setIsModalVisible(false);
    }
  };

  const addLinkField = () => {
    if (linkFields.length < 3) {
      setLinkFields([...linkFields, '']);
    }
  };

  const removeLink = (index: number) => {
    const newLinks = linkFields.filter((_, i) => i !== index);
    setLinkFields(newLinks);
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...linkFields];
    newLinks[index] = value;
    setLinkFields(newLinks);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => navigation.navigate('Home')}>
        <BackArrow style={styles.arrow} width={25} height={25} />
      </TouchableOpacity>
      <View style={styles.main}>
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

        {linkFields.map((field, index) => (
          <View key={index} style={styles.linkContainer}>
            <TextInput
              style={styles.input}
              placeholder={`Link ${index + 1}`}
              value={field}
              onChangeText={(value) => updateLink(index, value)}
              keyboardType="default"
              placeholderTextColor="#AAA"
            />
            <TouchableOpacity style={styles.removeButton} onPress={() => removeLink(index)}>
              <Text style={styles.removeButtonText}>x</Text>
            </TouchableOpacity>
          </View>
        ))}

        {linkFields.length < 3 && (
          <TouchableOpacity style={styles.addLinkBtn} onPress={addLinkField}>
            <Text style={styles.addLinkText}>+</Text>
          </TouchableOpacity>
        )}

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
          <TouchableOpacity style={styles.modalBtn} onPress={() => {setIsActionModalVisible(false); if(modalMessage.startsWith('Initialized business card:')){navigation.navigate('Home');}}}>
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
  link: {width: 250},

  icon: {position: 'absolute', top: 13, left: 13},

  linkContainer: {
    width: 300,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  removeButton: {
    width: 60, height: 50,
    display: 'flex',
    alignContent: 'center',
    justifyContent : 'center',
    position: 'absolute',
    top: 0, right: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#222',
  },
  removeButtonText: {fontSize: 25, color: 'white', textAlign: 'center'},

  addLinkBtn: {
    width: 300, height: 50,
    borderRadius: 10,
    borderColor: '#222222',
    borderWidth: 3,
    borderStyle: 'dashed',
  },
  addLinkText: {color: '#222', fontSize: 37, textAlign: 'center'},

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
