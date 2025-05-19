import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    // Simulation de chargement
    setTimeout(() => {
      // Simuler les données utilisateur
      const fakeBalance = 125000;
      const fakeTransactions = [
        { type: 'transfer', created_at: '2025-05-17T10:30:00', amount: -15000 },
        { type: 'payment', created_at: '2025-05-15T14:45:00', amount: -5000 },
        { type: 'transfer', created_at: '2025-05-14T09:20:00', amount: 25000 },
        { type: 'payment', created_at: '2025-05-12T16:00:00', amount: -10000 },
      ];

      setBalance(fakeBalance);
      setTransactions(fakeTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B3FF1" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dépôt et retrait chez tout nos agents DA Transfert</Text>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>{balance.toLocaleString()} F</Text>
        <Image
          source={require('../assets/qr-code.png')}
          style={styles.qrCode}
        />
        <Text style={styles.scanText}>Scanner</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('TransferScreen')}
        >
          <Ionicons name="swap-horizontal" size={24} color="#333" />
          <Text>Transfert</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('PaymentsScreen')}
        >
          <MaterialIcons name="payment" size={24} color="#333" />
          <Text>Paiements</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('CreditScreen')}
        >
          <FontAwesome name="credit-card" size={24} color="#333" />
          <Text>Crédit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('BankScreen')}
        >
          <Ionicons name="business" size={24} color="#333" />
          <Text>Banque</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.transactions}>
        {transactions.map((t, i) => (
          <View key={i} style={styles.transaction}>
            <Text>{t.type === 'transfer' ? 'Transfert' : 'Paiement'}</Text>
            <Text>{new Date(t.created_at).toLocaleString()}</Text>
            <Text style={{ fontWeight: 'bold', color: t.amount < 0 ? 'red' : 'green' }}>
              {`${t.amount < 0 ? '' : '+'}${t.amount.toLocaleString()} F`}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: { textAlign: 'center', fontSize: 16, marginBottom: 10 },
  balanceContainer: {
    alignItems: 'center',
    backgroundColor: '#4B3FF1',
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  balanceText: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  qrCode: { width: 100, height: 100, marginVertical: 10 },
  scanText: { color: '#fff', fontWeight: 'bold' },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  menuItem: { alignItems: 'center' },
  transactions: { paddingHorizontal: 20 },
  transaction: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
