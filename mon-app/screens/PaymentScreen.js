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
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const COLORS = {
  primary: '#4B3FF1',
  white: '#fff',
  bg: '#F7F8FA',
  button: '#4B3FF1',
  inputBorder: '#ddd',
  inputBG: '#fff',
  error: '#F15B3F',
};

const services = [
  { key: 'electricity', label: 'Électricité', icon: <Ionicons name="flash-outline" size={30} color={COLORS.primary} /> },
  { key: 'water', label: 'Eau', icon: <MaterialCommunityIcons name="water-outline" size={30} color={COLORS.primary} /> },
  { key: 'canal', label: 'Canal+', icon: <FontAwesome5 name="satellite-dish" size={30} color={COLORS.primary} /> },
  { key: 'other', label: 'Autres', icon: <Ionicons name="apps-outline" size={30} color={COLORS.primary} /> },
];

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

  const selectService = (serviceLabel) => {
    setBillDetails(serviceLabel);
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
        <Text style={styles.title}>Payer une Facture</Text>

        <View style={styles.servicesContainer}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.key}
              style={[
                styles.serviceButton,
                billDetails === service.label && { backgroundColor: COLORS.primary + '33' }, // léger fond si sélectionné
              ]}
              onPress={() => selectService(service.label)}
            >
              {service.icon}
              <Text style={styles.serviceLabel}>{service.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

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
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  serviceButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
  },
  serviceLabel: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.primary,
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
