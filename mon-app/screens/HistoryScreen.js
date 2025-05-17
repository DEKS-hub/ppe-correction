// TransactionHistoryScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TransactionHistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des Transactions</Text>
      <Text>Liste des transactions...</Text>
      {/* Ajouter une liste de transactions ici */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
});

export default TransactionHistoryScreen;
