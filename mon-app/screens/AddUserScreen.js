// AddUserScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AddUserScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un nouvel utilisateur</Text>
      {/* Ajoute ici ton formulaire ou autres fonctionnalités */}
      <Button title="Retour" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' }
});
