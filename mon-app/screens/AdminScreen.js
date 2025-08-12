import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import IP_ADDRESS from './ipConfig';

const AdminScreen = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  // Récupère le destinataire depuis le scan
  useEffect(() => {
    if (route.params?.scannedRecipient) {
      setRecipient(route.params.scannedRecipient);
    }
  }, [route.params]);

  const handleTransaction = async (type) => {
    if (!recipient || !amount) {
      Alert.alert("Erreur", "Tous les champs sont requis.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Erreur", "Le montant doit être un nombre positif.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${IP_ADDRESS}/api/admin/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, amount: parsedAmount }),
      });

      const responseText = await res.text();

      if (!res.ok) {
        let errorMessage = `Erreur serveur (${res.status})`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Erreur inattendue: ${responseText.substring(0, 100)}...`;
        }
        Alert.alert("Erreur", errorMessage);
        setLoading(false);
        return;
      }

      const data = JSON.parse(responseText);
      if (data.status === "ok") {
        Alert.alert("Succès", `Compte ${type} avec succès. Nouveau solde: ${data.solde}`);
        setRecipient('');
        setAmount('');
      } else {
        Alert.alert("Erreur", data.error || `Échec de la ${type}.`);
      }
    } catch (error) {
      console.error('Erreur réseau ou de récupération:', error);
      Alert.alert("Erreur de connexion", `Impossible de se connecter au serveur. Détails: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des comptes</Text>

      <View style={styles.inputWithButton}>
        <TextInput
          style={styles.inputField}
          placeholder="Email ou numéro de téléphone du destinataire"
          value={recipient}
          onChangeText={setRecipient}
          autoCapitalize="none"
          keyboardType={/^\d+$/.test(recipient) ? 'numeric' : 'default'}
        />
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('QrScanner', { from: 'Admin' })} // 🔹 Ici, on passe le paramètre
        >
          <Icon name="camera-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

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
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Créditer</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#E53935' }]}
          onPress={() => handleTransaction('debit')}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Débiter</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },

  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  inputField: { flex: 1, padding: 12, fontSize: 16 },
  scanButton: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  button: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', marginHorizontal: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default AdminScreen;
