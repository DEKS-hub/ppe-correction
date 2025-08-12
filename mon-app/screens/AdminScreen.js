import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from './ipConfig';

const AdminScreen = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [solde, setSolde] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchAdminSolde = async () => {
      try {
        setLoading(true);
        const adminId = await AsyncStorage.getItem('userId');
        const res = await fetch(`${IP_ADDRESS}/api/user/${adminId}`);
        const data = await res.json();
        if (res.ok && data?.solde !== undefined) {
          setSolde(data.solde);
        } else {
          console.warn('Impossible de récupérer le solde');
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du solde :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminSolde();
  }, []);

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

    setProcessing(true);

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
        } catch (e) {
          errorMessage = `Erreur inconnue: ${responseText}`;
        }
        Alert.alert("Échec", errorMessage);
        return;
      }

      const data = JSON.parse(responseText);

      if (data.status === "ok") {
        Alert.alert("Succès", `Compte ${type} avec succès. Nouveau solde: ${data.solde} F`);
        setSolde(data.solde);
        setRecipient('');
        setAmount('');
      } else {
        Alert.alert("Erreur", data.error || `Échec de la ${type}.`);
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue : " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    setRecipient('');
    setAmount('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💼 Gestion des Comptes</Text>

      <View style={styles.soldeBox}>
        {loading ? (
          <ActivityIndicator size="small" color="#4B3FF1" />
        ) : (
          <>
            <Text style={styles.soldeLabel}>Votre solde actuel</Text>
            <Text style={styles.soldeAmount}>{solde !== null ? `${solde} F CFA` : '---'}</Text>
          </>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email ou téléphone du destinataire"
        value={recipient}
        onChangeText={setRecipient}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Montant à transférer"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4B3FF1' }]}
          onPress={() => handleTransaction('credit')}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Créditer</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#E53935' }]}
          onPress={() => handleTransaction('debit')}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Débiter</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Bouton Annuler */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={handleCancel}
        disabled={processing}
      >
        <Text style={styles.cancelButtonText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e2a78',
    marginBottom: 24,
    textAlign: 'center',
  },
  soldeBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  soldeLabel: {
    fontSize: 16,
    color: '#888',
  },
  soldeAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B3FF1',
    marginTop: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: '#FFA726',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
