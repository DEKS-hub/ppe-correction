import React, { useState } from 'react';
 
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Error from 'react-native-vector-icons/MaterialIcons';
import { RadioButton } from 'react-native-paper';
import IP_ADDRESS from './ipConfig';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [nameVerify, setNameVerify] = useState(false);
  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [mobile, setMobile] = useState('');
  const [mobileVerify, setMobileVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('User');
  const [secretText, setSecretText] = useState('');

  const handleRegister = async () => {
    if (!(nameVerify && emailVerify && mobileVerify && passwordVerify)) {
      Alert.alert('Erreur', 'Veuillez remplir correctement tous les champs.');
      return;
    }
    if (userType === 'Admin' && secretText !== 'Text1243') {
      Alert.alert('Erreur', "Texte secret invalide pour l'administrateur.");
      return;
    }

    try {
      const response = await axios.post(`${IP_ADDRESS}/register`, {
        name,
        email,
        mobile,
        password,
        user_type: userType,
      });
    

      if (response.data.status === 'success' || response.data.message === 'Compte créé avec succès') {
        Alert.alert('Succès', 'Inscription réussie.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Erreur', response.data.message || "Compte créé avec succès.");
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se connecter au serveur.');
      console.error(error);
    }
  };

  const handleName = (text) => {
    setName(text);
    setNameVerify(text.trim().length > 1);
  };

  const handleEmail = (text) => {
    setEmail(text);
    setEmailVerify(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(text));
  };

  const handleMobile = (text) => {
  setMobile(text);
  setMobileVerify(/^(70|71|72|73|90|91|92|96|97|98|99)\d{6}$/.test(text));
  };

  const handlePassword = (text) => {
    setPassword(text);
    setPasswordVerify(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(text));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.wrapper}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Créer un compte</Text>

        <View style={styles.radioButtonDiv}>
          <Text style={styles.radioButtonTitle}>S'inscrire comme</Text>
          <View style={styles.radioButtonInnerDiv}>
            <Text>User</Text>
            <RadioButton
              value="User"
              status={userType === 'User' ? 'checked' : 'unchecked'}
              onPress={() => setUserType('User')}
            />
          </View>
          <View style={styles.radioButtonInnerDiv}>
            <Text>Admin</Text>
            <RadioButton
              value="Admin"
              status={userType === 'Admin' ? 'checked' : 'unchecked'}
              onPress={() => setUserType('Admin')}
            />
          </View>
        </View>

        {userType === 'Admin' && (
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#420475" size={20} />
            <TextInput
              placeholder="Texte secret"
              style={styles.input}
              onChangeText={setSecretText}
              value={secretText}
            />
          </View>
        )}

        <View style={styles.action}>
          <FontAwesome name="user-o" color="#420475" size={20} />
          <TextInput
            placeholder="Nom complet"
            style={styles.input}
            onChangeText={handleName}
            value={name}
          />
          {name.length > 0 && (nameVerify ? (
            <Feather name="check-circle" color="green" size={20} />
          ) : (
            <Error name="error" color="red" size={20} />
          ))}
        </View>
        {name.length > 0 && !nameVerify && (
          <Text style={styles.errorText}>Le nom doit contenir plus d'un caractère.</Text>
        )}

        <View style={styles.action}>
          <Fontisto name="email" color="#420475" size={20} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={handleEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {email.length > 0 && (emailVerify ? (
            <Feather name="check-circle" color="green" size={20} />
          ) : (
            <Error name="error" color="red" size={20} />
          ))}
        </View>
        {email.length > 0 && !emailVerify && (
          <Text style={styles.errorText}>Entrez une adresse email valide.</Text>
        )}

        <View style={styles.action}>
          <FontAwesome name="mobile" color="#420475" size={8} />
          <TextInput
            placeholder="Numéro de téléphone"
            style={styles.input}
            onChangeText={handleMobile}
            value={mobile}
            keyboardType="phone-pad"
            maxLength={10}
          />
          {mobile.length > 0 && (mobileVerify ? (
            <Feather name="check-circle" color="green" size={20} />
          ) : (
            <Error name="error" color="red" size={20} />
          ))}
        </View>
        {mobile.length > 0 && !mobileVerify && (
          <Text style={styles.errorText}>
            Le numéro doit  etre conforme a celui utiliser sur le territoire.
          </Text>
        )}

        <View style={styles.action}>
          <FontAwesome name="lock" color="#420475" size={20} />
          <TextInput
            placeholder="Mot de passe"
            style={styles.input}
            onChangeText={handlePassword}
            value={password}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {password.length > 0 && (!showPassword ? (
              <Feather name="eye-off" color={passwordVerify ? 'green' : 'red'} size={20} />
            ) : (
              <Feather name="eye" color={passwordVerify ? 'green' : 'red'} size={20} />
            ))}
          </TouchableOpacity>
        </View>
        {password.length > 0 && !passwordVerify && (
          <Text style={styles.errorText}>
            Mot de passe avec majuscule, minuscule, chiffre, et 6+ caractères.
          </Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Déjà inscrit ? Connectez-vous ici</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F2F6FF',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
    textAlign: 'center',
  },
  radioButtonDiv: {
    marginBottom: 20,
  },
  radioButtonInnerDiv: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioButtonTitle: {
    fontWeight: '600',
    marginBottom: 5,
    fontSize: 16,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 38,
  },
  button: {
    backgroundColor: '#0066CC',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: '#0066CC',
    fontSize: 16,
    textAlign: 'center',
  },
});
