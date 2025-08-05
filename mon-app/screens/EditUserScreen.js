// EditUserScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function EditUserScreen({ route, navigation }) {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier l'utilisateur</Text>
      <Text>Nom : {user.nom}</Text>
      <Text>Email : {user.email}</Text>
      {/* Ajoute ici ton formulaire ou autres fonctionnalités */}
      <Button title="Retour" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' }
});
