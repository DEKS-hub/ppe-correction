import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import IP_ADDRESS from './ipConfig';



const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${IP_ADDRESS}/api/users`);
      setUsers(response.data);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cet utilisateur ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${IP_ADDRESS}/api/users/${id}`);
              fetchUsers(); // Refresh list
            } catch (error) {
              Alert.alert("Erreur", "Échec de la suppression");
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>{item.nom}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditUserScreen', { user: item })}
        >
          <Text style={styles.buttonText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteUser(item.id)}
        >
          <Text style={styles.buttonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007BFF" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des utilisateurs</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.addButtonText}>+ Ajouter un utilisateur</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  userCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10
  },
  userName: { fontSize: 16, fontWeight: '600' },
  userEmail: { fontSize: 14, color: '#555' },
  actions: { flexDirection: 'row', marginTop: 10 },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5,
    marginRight: 10
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 5
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 50,
    elevation: 5
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' }
});

export default UserManagementScreen;
