import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from './ipConfig';

const COLORS = {
  primary: '#4B3FF1',
  white: '#fff',
  bg: '#F7F8FA',
  button: '#4B3FF1',
  inputBorder: '#ddd',
  inputBG: '#fff',
  error: '#F15B3F',
};

const TransferScreen = ({ navigation, route }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecipientFixed, setIsRecipientFixed] = useState(false);

  useEffect(() => {
  if (route.params?.receiverPhone) {
    setRecipient(route.params.receiverPhone);
    setIsRecipientFixed(true); // Champ non modifiable après scan QR
  } else if (route.params?.recipient) {
    setRecipient(route.params.recipient);
    setIsRecipientFixed(false); // Champ modifiable
  }
}, [route.params]);



  const handleTransfer = async () => {
    if (!amount || !recipient) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide.');
      return;
    }

    const senderId = await AsyncStorage.getItem('userId');
    if (!senderId) {
      Alert.alert('Erreur', "Utilisateur non connecté.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${IP_ADDRESS}/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId,
          receiverPhone: recipient,
          amount: numericAmount,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Succès', 'Transfert effectué avec succès.');
        setAmount('');
        if (!isRecipientFixed) setRecipient('');
        navigation.navigate('Home');
      } else {
        Alert.alert('Erreur', data.message || 'Échec du transfert.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de contacter le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}
          >
          <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Faire un Transfert</Text>

        <TextInput
          style={styles.input}
          placeholder="Montant (F CFA)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

       <View style={styles.inputRow}>
      <TextInput
        style={styles.inputFlex}
        placeholder="Numéro ou email du destinataire"
        keyboardType="default"
        value={recipient}
        onChangeText={setRecipient}
        editable={!isRecipientFixed}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Repertoire')}>
        <Ionicons name="person-add-outline" size={26} color={COLORS.primary} />
      </TouchableOpacity>
      </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleTransfer}
          disabled={loading}
        >
          <Ionicons name="send-outline" size={20} color={COLORS.white} />
          <Text style={styles.buttonText}>{loading ? 'Envoi...' : 'Envoyer'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.inputBG,
    borderColor: COLORS.inputBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.button,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputRow: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.inputBG,
  borderColor: COLORS.inputBorder,
  borderWidth: 1,
  borderRadius: 10,
  paddingHorizontal: 14,
  marginBottom: 16,
},
inputFlex: {
  flex: 1,
  paddingVertical: 12,
  fontSize: 16,
  color: '#333',
},
  icon: {
    marginLeft: 10,
  },
});

export default TransferScreen;
