import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import IP_ADDRESS from './ipConfig';

const TransactionsHistory = () => {
  const [lastTransaction, setLastTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  axios.get(`${IP_ADDRESS}/api/transactions`)
    .then(response => {
      const sorted = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setTransactions(sorted);
    })
    .catch(error => console.error(error));
}, []);


  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#003366" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!lastTransaction) {
    return (
      <View style={styles.container}>
        <Text style={styles.noTransaction}>Aucune transaction trouvée.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dernière Transaction</Text>
      <View style={styles.item}>
        <Text style={styles.id}>Transaction #{lastTransaction.id}</Text>
        <Text>Expéditeur : {lastTransaction.sender_name || 'N/A'}</Text>
        <Text>Bénéficiaire : {lastTransaction.receiver_name || 'N/A'}</Text>
        <Text>Montant : {lastTransaction.amount} FCFA</Text>
        <Text>Type : {lastTransaction.transaction_type}</Text>
        <Text>Statut : {lastTransaction.status}</Text>
        <Text>Date : {new Date(lastTransaction.created_at).toLocaleString()}</Text>
      </View>
    </View>
  );
};

export default TransactionsHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f8',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTransaction: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#003366',
  },
  item: {
    backgroundColor: '#e6f0ff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  id: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
