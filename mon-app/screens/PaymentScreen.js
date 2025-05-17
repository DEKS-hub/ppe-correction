// PaymentScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const PaymentScreen = ({ navigation }) => {
  const [billAmount, setBillAmount] = useState('');
  const [billDetails, setBillDetails] = useState('');

  const handlePayment = () => {
    if (!billAmount || !billDetails) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    Alert.alert('Paiement effectué', `Paiement de ${billAmount} pour ${billDetails}`);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payer une Facture</Text>
      <TextInput
        style={styles.input}
        placeholder="Montant de la facture"
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
      <Button title="Payer" onPress={handlePayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  input: { 
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1, 
    marginBottom: 10, 
    paddingLeft: 10, 
    borderRadius: 5, 
    backgroundColor: '#fff' 
  },
});

export default PaymentScreen;
