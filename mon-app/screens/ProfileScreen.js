import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from './ipConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  primary: '#4B3FF1',   
    white: '#fff',
    bg: '#F7F8FA',
    button: '#4B3FF1',
    inputBorder: '#ddd',
    inputBG: '#fff',
    error: '#F15B3F',
};


const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigation = useNavigation();


  // Charger les données utilisateur au montage
  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Erreur', 'Utilisateur non connecté');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${IP_ADDRESS}/api/user/${userId}`);
        if (!res.ok) throw new Error('Erreur lors du chargement des données');
        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        Alert.alert('Erreur', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  // Handler pour sauvegarder
  const handleSave = async () => {
    if (!userInfo) return;
    setSaving(true);
    try {
      const res = await fetch(`${IP_ADDRESS}/api/user/${userInfo.id}`, {
        method: 'PUT', // ou PATCH selon API
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour');
      Alert.alert('Succès', 'Profil mis à jour');
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#4B3FF1" style={{ flex: 1, justifyContent: 'center' }} />;

  return (
    <View style={styles.container}>
        
      <Text style={styles.title}>Mon Profil</Text>

      

      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        value={userInfo?.name || ''}
        onChangeText={(text) => setUserInfo({ ...userInfo, nom: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"

        value={userInfo?.email || ''}
        onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        keyboardType="phone-pad"
        value={userInfo?.mobile || ''}
        onChangeText={(text) => setUserInfo({ ...userInfo, telephone: text })}
      />

      <TouchableOpacity
        style={[styles.button, saving && { opacity: 0.7 }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>{saving ? 'Sauvegarde...' : 'Modifier'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
    >
        <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F7F8FA' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4B3FF1', marginBottom: 24, textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4B3FF1',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  cancelButton: {
  marginTop: 12,
  backgroundColor: '#fff0f0',
  paddingVertical: 14,
  borderRadius: 14,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: COLORS.error,
},

cancelButtonText: {
  color: COLORS.error,
  fontWeight: '700',
  fontSize: 16,
},

});

export default ProfileScreen;
