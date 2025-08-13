import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import * as Contacts from 'expo-contacts';

export default function ContactsScreen({ navigation }) {

  const [contacts, setContacts] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestContactsPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      setPermissionGranted(true);
      loadContacts();
    } else {
      alert('Permission pour accéder aux contacts refusée.');
    }
  };

  const loadContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });
      if (data.length > 0) {
        setContacts(data);
      }
    } catch (err) {
      console.warn('Erreur lors du chargement des contacts', err);
    }
  };

  useEffect(() => {
    requestContactsPermission();
  }, []);

  if (!permissionGranted) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={requestContactsPermission} style={styles.button}>
          <Text style={styles.buttonText}>Autoriser l’accès aux contacts</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>📇 Mes Contacts :</Text>
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.contactItem}
          onPress={() =>
            navigation.navigate('Transfer', {
              recipient: item.phoneNumbers?.[0]?.number || '',
            })
          }
        >
          <Text style={styles.contactText}>
            {item.name} {item.phoneNumbers?.[0]?.number || ''}
          </Text>
        </TouchableOpacity>
      )}
    />
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  contactItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactText: {
    fontSize: 16,
  },
});