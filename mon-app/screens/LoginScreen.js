import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!identifier || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);

    // Simulation des identifiants
    const fakeUser = {
      identifier: 'user@example.com',
      password: '123456',
      name: 'Utilisateur Test'
    };

    setTimeout(() => {
      if (identifier === fakeUser.identifier && password === fakeUser.password) {
        console.log('Connexion simulée réussie');
        navigation.navigate('Home', { user: fakeUser });
      } else {
        Alert.alert('Erreur', 'Identifiant ou mot de passe incorrect.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Se connecter</Text>

      <TextInput
        style={styles.input}
        placeholder="Email ou numéro de téléphone"
        keyboardType="default"
        value={identifier}
        onChangeText={setIdentifier}
        accessible
        accessibilityLabel="Champ pour entrer l'email ou le numéro de téléphone"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        accessible
        accessibilityLabel="Champ pour entrer le mot de passe"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
        accessible
        accessibilityLabel="Bouton pour se connecter"
      >
        <Text style={styles.buttonText}>{loading ? 'Connexion...' : 'Connexion'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp')}
        accessible
        accessibilityLabel="Lien pour créer un compte"
      >
        <Text style={styles.link}>Créer un compte</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: {
    backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16,
  },
  button: {
    backgroundColor: '#1E90FF', padding: 15, borderRadius: 8, alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { marginTop: 20, color: '#1E90FF', textAlign: 'center' },
});
