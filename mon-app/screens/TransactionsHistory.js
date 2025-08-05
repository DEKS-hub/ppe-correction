import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import IP_ADDRESS from './ipConfig'; // Assurez-vous que ipConfig.js fournit la bonne adresse IP

const SuperAdminTransactionsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${IP_ADDRESS}/api/transactions`)
      .then(response => {
        setTransactions(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur chargement transactions :', error);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.id}>Transaction #{item.id}</Text>
      <Text>Expéditeur : {item.sender_name || 'N/A'}</Text>
      <Text>Bénéficiaire : {item.receiver_name || 'N/A'}</Text>
      <Text>Montant : {item.amount} FCFA</Text>
      <Text>Type : {item.transaction_type}</Text>
      <Text>Statut : {item.status}</Text>
      <Text>Date : {new Date(item.created_at).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#003366" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default SuperAdminTransactionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#003366'
  },
  item: {
    backgroundColor: '#e6f0ff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2
  },
  id: {
    fontWeight: 'bold',
    marginBottom: 5,
  }
});
