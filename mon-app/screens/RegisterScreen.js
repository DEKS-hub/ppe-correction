import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as Network from 'expo-network';
const API_URL = 'http://votre-backend.com';

// En développement avec Expo, utilisez votre adresse IP locale
// Pour Android: 10.0.2.2 pour l'émulateur Android
// Pour iOS: localhost fonctionne
const getApiUrl = async () => {
  if (__DEV__) {
    const ip = await Network.getIpAddressAsync();
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000';
    } else {
      return 'http://localhost:3000';
    }
  }
  return 'https://votre-api-production.com'; // URL de production
};

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{8,}$/;
    return phoneRegex.test(phone);
  };

  const validateFields = () => {
    if (!fullName.trim()) {
      setError('Le nom complet est requis');
      return false;
    }
    if (!email.trim() || !validateEmail(email.trim())) {
      setError('Veuillez entrer une adresse email valide');
      return false;
    }
    if (!phone.trim() || !validatePhone(phone.trim())) {
      setError('Veuillez entrer un numéro de téléphone valide (minimum 8 chiffres)');
      return false;
    }
    if (!password || password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    try {
      setError(null);
      
      if (!validateFields()) {
        return;
      }

      setIsLoading(true);
      const apiUrl = await getApiUrl();
      console.log('Tentative d\'inscription sur:', apiUrl);
      const response = await axios.post(`${API_URL}/api/register`,  {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password
      });

      if (response.data) {
        Alert.alert(
          'Succès',
          'Votre compte a été créé avec succès !',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      let errorMessage = 'Une erreur est survenue lors de l\'inscription';

      if (error.response) {
        // Erreur du serveur avec réponse
        errorMessage = error.response.data?.message || 'Erreur du serveur';
      } else if (error.request) {
        // Pas de réponse du serveur
        errorMessage = 'Impossible de joindre le serveur. Vérifiez votre connexion internet.';
      }

      setError(errorMessage);
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Créer le compte</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkContainer}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.link}>Déjà un compte ? Connexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  link: {
    color: '#1E90FF',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});