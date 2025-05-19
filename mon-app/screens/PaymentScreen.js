import React, { useState } from 'react';
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

const COLORS = {
  primary: '#4B3FF1',
  white: '#fff',
  bg: '#F7F8FA',
  button: '#4B3FF1',
  inputBorder: '#ddd',
  inputBG: '#fff',
  error: '#F15B3F',
};

const PaymentScreen = ({ navigation }) => {
  const [billAmount, setBillAmount] = useState('');
  const [billDetails, setBillDetails] = useState('');

  const handlePayment = () => {
    if (!billAmount || !billDetails) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    Alert.alert('Paiement effectué', `Paiement de ${billAmount} F pour ${billDetails}`);
    navigation.navigate('Home');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Payer une Facture</Text>

        <TextInput
          style={styles.input}
          placeholder="Montant de la facture (F CFA)"
          keyboardType="numeric"
          value={billAmount}
          onChangeText={setBillAmount}
        />

        <TextInput
          style={styles.input}
          placeholder="Détails de la facture"
          value={billDetails}
          onChangeText={setBillDetails}
        />

        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Ionicons name="card-outline" size={20} color={COLORS.white} />
          <Text style={styles.buttonText}>Payer</Text>
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
});

export default PaymentScreen;
