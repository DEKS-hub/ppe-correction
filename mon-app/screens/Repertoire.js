// mon-app/screens/Repertoire.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from './ipConfig'; 

const Repertoire = ({ navigation, route }) => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Ton token stocké après login
        const response = await fetch(`${IP_ADDRESS}/api/users/recipients`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.status === 'ok') {
          setRecipients(result.data);
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du répertoire :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipients();
  }, []);

  const handleSelectRecipient = (email) => {
    navigation.navigate('Transfer', { recipient: email });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectRecipient(item.mobile)}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.mobile}>{item.mobile}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Chargement du répertoire...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Répertoire des utilisateurs</Text>
      <FlatList
        data={recipients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Aucun utilisateur trouvé.</Text>}
      />
    </View>
  );
};

export default Repertoire;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  item: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#555' },
  mobile: { fontSize: 13, color: '#777' },
  empty: { marginTop: 40, textAlign: 'center', fontSize: 16 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
