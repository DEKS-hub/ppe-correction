import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import IP_ADDRESS from './ipConfig';

const TransactionDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { transaction } = route.params;

  const [senderNumber, setSenderNumber] = useState(null);
  const [receiverNumber, setReceiverNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        setLoading(true);
        setError(null);

        // API pour récupérer numéro par user ID
        const fetchNumber = async (userId) => {
          const res = await fetch(`${IP_ADDRESS}/users/${userId}`);
          if (!res.ok) throw new Error('Erreur récupération numéro');
          const data = await res.json();
          return data.mobile; // suppose que le champ numéro s'appelle mobile
        };

        const [senderMobile, receiverMobile] = await Promise.all([
          fetchNumber(transaction.sender_id),
          fetchNumber(transaction.receiver_id),
        ]);

        setSenderNumber(senderMobile);
        setReceiverNumber(receiverMobile);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNumbers();
  }, [transaction.sender_id, transaction.receiver_id]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#4B3FF1" />
      </TouchableOpacity>
      <Text style={styles.title}>Détails de la transaction</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4B3FF1" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.errorText}>Erreur: {error}</Text>
      ) : (
        <View style={styles.detailsBox}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{transaction.id}</Text>

          <Text style={styles.label}>Référence:</Text>
          <Text style={styles.value}>{transaction.reference || 'Non disponible'}</Text>

          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{transaction.type}</Text>

          <Text style={styles.label}>Montant:</Text>
          <Text style={[styles.value, { color: transaction.amount < 0 ? '#F15B3F' : '#4BB543' }]}>
            {transaction.amount.toLocaleString()} F
          </Text>

          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{new Date(transaction.created_at).toLocaleString()}</Text>

          <Text style={styles.label}>Expéditeur (Numéro):</Text>
          <Text style={styles.value}>{senderNumber || 'Non disponible'}</Text>

          <Text style={styles.label}>Récepteur (Numéro):</Text>
          <Text style={styles.value}>{receiverNumber || 'Non disponible'}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B3FF1',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  detailsBox: {
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#4B3FF1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    marginTop: 12,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  errorText: {
    marginTop: 40,
    color: '#F15B3F',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TransactionDetailScreen;
