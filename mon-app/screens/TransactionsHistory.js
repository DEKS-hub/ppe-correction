import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import IP_ADDRESS from './ipConfig';

const SuperAdminTransactionsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const userPhonesCache = {};

  const getUserPhoneById = async (id) => {
    if (!id) return null;
    if (userPhonesCache[id]) return userPhonesCache[id];

    try {
      const res = await fetch(`${IP_ADDRESS}/users/${id}`);
      if (!res.ok) return null;
      const user = await res.json();
      userPhonesCache[id] = user.mobile;
      return user.mobile;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${IP_ADDRESS}/api/transactions`);
        const data = res.data;

        const transactionsWithPhones = await Promise.all(
          data.map(async (t) => {
            const sender_phone = await getUserPhoneById(t.sender_id);
            const receiver_phone = await getUserPhoneById(t.receiver_id);
            return { ...t, sender_phone, receiver_phone };
          })
        );

        setTransactions(transactionsWithPhones);
        setFilteredTransactions(transactionsWithPhones);
        setLoading(false);
      } catch (error) {
        console.error('Erreur chargement transactions :', error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredTransactions(transactions);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = transactions.filter(t =>
      (t.sender_name && t.sender_name.toLowerCase().includes(query)) ||
      (t.receiver_name && t.receiver_name.toLowerCase().includes(query)) ||
      (t.sender_phone && t.sender_phone.includes(query)) ||
      (t.receiver_phone && t.receiver_phone.includes(query)) ||
      (t.reference && t.reference.toLowerCase().includes(query))  // Recherche sur reference aussi
    );
    setFilteredTransactions(results);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.id}>Transaction #{item.id}</Text>

      <Text numberOfLines={1} ellipsizeMode="tail">
        Référence : {item.reference || 'N/A'}
      </Text>

      <Text numberOfLines={1} ellipsizeMode="tail">
        Expéditeur : {item.sender_phone || 'N/A'}
      </Text>

      <Text numberOfLines={1} ellipsizeMode="tail">
        Bénéficiaire : {item.receiver_phone || 'N/A'}
      </Text>

      <Text>Montant : {item.amount} FCFA</Text>
      <Text>Type : {item.transaction_type}</Text>
      <Text>Statut : {item.status}</Text>
      <Text>Date : {new Date(item.created_at).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Historique des Transactions</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Rechercher par nom, numéro ou référence"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default SuperAdminTransactionsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', paddingHorizontal: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 20, textAlign: 'center', color: '#003366' },
  searchContainer: { flexDirection: 'row', marginBottom: 15 },
  input: {
    flex: 1, backgroundColor: '#fff', borderRadius: 8,
    paddingHorizontal: 12, height: 40,
    borderWidth: 1, borderColor: '#ccc',
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#003366',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#e6f0ff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
    flexShrink: 1,
  },
  id: { fontWeight: 'bold', marginBottom: 5 },
});
