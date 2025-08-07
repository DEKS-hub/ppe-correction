import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function requestPermissionAndLoad() {
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Permission pour lire les contacts',
            message: 'Cette app a besoin d\'accéder à vos contacts',
            buttonPositive: 'OK',
          },
        );
        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Permission contacts refusée');
          return;
        }
      }
      Contacts.getAll()
        .then(cts => {
          setContacts(cts);
        })
        .catch(e => {
          console.warn('Erreur en récupérant contacts', e);
        });
    }

    requestPermissionAndLoad();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Mes Contacts :</Text>
      <FlatList
        data={contacts}
        keyExtractor={item => item.recordID}
        renderItem={({ item }) => (
          <Text>{item.givenName} {item.familyName}</Text>
        )}
      />
    </View>
  );
}
