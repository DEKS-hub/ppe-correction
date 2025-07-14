import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from './ipConfig';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${IP_ADDRESS}/login-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password }),
      });

      const result = await response.json();

      if (result.status === 'ok') {
        const userId = result.data.id;
        const token = result.data.token;
        const userType = result.data.userType;

        console.log("le user qui est retourner ",userType);

        if (userId) {
          await AsyncStorage.setItem('userId', userId.toString());
          console.log("✅ ID utilisateur stocké :", userId);
        } else {
          console.warn("⚠️ Aucun ID utilisateur trouvé dans la réponse.");
        }

        if (token) {
          await AsyncStorage.setItem('token', token);
        }

        if (userType) {
          await AsyncStorage.setItem('userType', userType);
          console.log('UserType reçu:', userType);
        }

        // Redirection selon userType, tolérance casse
        if (userType === 'Admin') {
          console.log("TEST navigation vers AdminScreen");
          navigation.navigate('AdminScreen'); // vérifie que ce nom correspond à ton écran admin
        } else {
          console.log("TEST navigation vers Home");
          navigation.navigate('Home');
        }
      } else {
        Alert.alert('Erreur', result.data || 'Identifiant ou mot de passe incorrect.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    }

    setLoading(false);
  };
// Test de redirection forcée
<TouchableOpacity onPress={() => navigation.navigate('AdminScreen')}>
  <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>
    Test Admin
  </Text>
</TouchableOpacity>

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Se connecter</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={identifier}
        onChangeText={setIdentifier}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Connexion...' : 'Connexion'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
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
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#0066cc', textAlign: 'center', marginTop: 10 },
});
