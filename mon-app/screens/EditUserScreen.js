// EditUserScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import IP_ADDRESS from './ipConfig';

export default function EditUserScreen({ route, navigation }) {
  const { user } = route.params;

  const [nom, setNom] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nom.trim() || !email.trim()) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires.');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${IP_ADDRESS}/users/${user.id}`, {
        nom,
        email
      });

      Alert.alert('Succès', 'Utilisateur mis à jour avec succès.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', "Impossible de mettre à jour l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier l'utilisateur</Text>

      <Text style={styles.label}>Nom :</Text>
      <TextInput
        style={styles.input}
        value={nom}
        onChangeText={setNom}
        placeholder="Entrez le nom"
      />

      <Text style={styles.label}>Email :</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Entrez l'email"
        keyboardType="email-address"
      />

      <Button
        title={loading ? 'Sauvegarde...' : 'Enregistrer'}
        onPress={handleSave}
        disabled={loading}
      />

      <View style={{ marginTop: 10 }}>
        <Button title="Annuler" color="gray" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    marginBottom: 10
  }
});
