import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SuperAdminTransactionsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Définir l'adresse IP (à remplacer par votre adresse réelle)
  const IP_ADDRESS = 'http://votre-adresse-ip:3000';

  // Cache pour les numéros de téléphone
  const userPhonesCache = useRef({});

  const getUserPhoneById = useCallback(async (id) => {
    if (!id) return null;
    if (userPhonesCache.current[id]) return userPhonesCache.current[id];

    try {
      const res = await fetch(`${IP_ADDRESS}/users/${id}`);
      if (!res.ok) return null;
      const user = await res.json();
      userPhonesCache.current[id] = user.mobile;
      return user.mobile;
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
      return null;
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setRefreshing(true);
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
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
      Alert.alert('Erreur', 'Impossible de charger les transactions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getUserPhoneById]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
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
      (t.reference && t.reference.toLowerCase().includes(query))
    );
    setFilteredTransactions(results);
  }, [searchQuery, transactions]);

  const cancelTransaction = async (id) => {
    try {
      const res = await axios.put(`${IP_ADDRESS}/api/transactions/${id}/cancel`);
      Alert.alert('Succès', res.data.message || "Transaction annulée avec succès ✅");
      fetchTransactions();
    } catch (error) {
      console.error("Erreur annulation transaction:", error);
      const msg = error.response?.data?.message || "Erreur lors de l'annulation ❌";
      Alert.alert('Erreur', msg);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.id}>Transaction #{item.id}</Text>
      
      <Text numberOfLines={1} ellipsizeMode="tail">
        Référence : {item.reference || 'N/A'}
      </Text>

      <Text numberOfLines={1} ellipsizeMode="tail">
        Expéditeur : {item.sender_phone || item.sender_name || 'N/A'}
      </Text>

      <Text numberOfLines={1} ellipsizeMode="tail">
        Bénéficiaire : {item.receiver_phone || item.receiver_name || 'N/A'}
      </Text>

      <Text>Montant : {item.amount ? `${item.amount} FCFA` : 'N/A'}</Text>
      <Text>Type : {item.transaction_type || 'N/A'}</Text>
      <Text>Statut : {item.status || 'N/A'}</Text>
      <Text>Date : {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}</Text>

      {item.status !== "Cancelled" && item.status !== "cancelled" && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => cancelTransaction(item.id)}
        >
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      )}
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
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => setSearchQuery('')}>
          <Ionicons name={searchQuery ? "close" : "search"} size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={fetchTransactions}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f4f8', 
    paddingHorizontal: 16 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f0f4f8' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginVertical: 20, 
    textAlign: 'center', 
    color: '#003366' 
  },
  searchContainer: { 
    flexDirection: 'row', 
    marginBottom: 15,
    alignItems: 'center'
  },
  input: {
    flex: 1, 
    backgroundColor: '#fff', 
    borderRadius: 8,
    paddingHorizontal: 12, 
    height: 40,
    borderWidth: 1, 
    borderColor: '#ccc',
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#003366',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#e6f0ff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  id: { 
    fontWeight: 'bold', 
    marginBottom: 5,
    fontSize: 16
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#cc0000',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20
  }
});

export default SuperAdminTransactionsScreen;