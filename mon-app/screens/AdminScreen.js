import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import IP_ADDRESS from './ipConfig';

const AdminScreen = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransaction = async (type) => {
    if (!recipient || !amount) {
      Alert.alert("Erreur", "Tous les champs sont requis.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${IP_ADDRESS}/api/admin/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, amount: parseFloat(amount) }),
      });

      const data = await res.json();

      if (data.status === "ok") {
        Alert.alert("Succès", `Compte ${type} avec succès.`);
        setRecipient('');
        setAmount('');
      } else {
        Alert.alert("Erreur", data.error || `Échec de la ${type}.`);
      }
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des comptes</Text>

      <TextInput
        style={styles.input}
        placeholder="Email ou ID de l'utilisateur"
        value={recipient}
        onChangeText={setRecipient}
      />

      <TextInput
        style={styles.input}
        placeholder="Montant"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4B3FF1' }]}
          onPress={() => handleTransaction('credit')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Créditer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#E53935' }]}
          onPress={() => handleTransaction('debit')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Débiter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 16, borderRadius: 8 },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default AdminScreen;
