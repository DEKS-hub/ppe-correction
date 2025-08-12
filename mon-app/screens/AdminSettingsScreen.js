// src/screens/AdminSettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminSettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres Administrateur</Text>
      {/* Tu peux ajouter ici des options de paramètres */}
    </View>
  );
};

export default AdminSettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
