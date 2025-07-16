import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import IP_ADDRESS from './ipConfig'; // Assurez-vous que ipConfig.js fournit la bonne adresse IP

const AdminScreen = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransaction = async (type) => {
    if (!recipient || !amount) {
      Alert.alert("Erreur", "Tous les champs sont requis.");
      return;
    }

    // Validation de base pour le montant afin d'éviter d'envoyer des valeurs non numériques
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Erreur", "Le montant doit être un nombre positif.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${IP_ADDRESS}/api/admin/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient, amount: parsedAmount }), // Utilisation du montant analysé
      });

      // Lire le corps de la réponse une seule fois, en tant que texte
      const responseText = await res.text();

      // Vérifier si la réponse a été réussie (statut 200-299)
      if (!res.ok) {
        let errorMessage = `Erreur serveur (${res.status})`;
        try {
          // Tenter d'analyser le texte en JSON
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch (jsonParseError) {
          // Si ce n'est pas du JSON, utiliser le texte brut
          errorMessage = `Erreur inattendue: ${responseText.substring(0, 100)}... (Vérifiez la console du serveur)`;
        }
        Alert.alert("Erreur", errorMessage);
        setLoading(false);
        return;
      }

      // Si la réponse est OK, analyser le texte en JSON
      const data = JSON.parse(responseText);

      if (data.status === "ok") {
        Alert.alert("Succès", `Compte ${type} avec succès. Nouveau solde: ${data.solde}`);
        setRecipient('');
        setAmount('');
      } else {
        // Cela gère les cas où le serveur renvoie le statut 200 mais avec status: 'error' en JSON
        Alert.alert("Erreur", data.error || `Échec de la ${type}.`);
      }
    } catch (error) {
      // Cela intercepte les erreurs réseau (par exemple, serveur inaccessible, IP_ADDRESS incorrecte)
      console.error('Erreur réseau ou de récupération:', error);
      Alert.alert("Erreur de connexion", `Impossible de se connecter au serveur. Vérifiez votre IP_ADDRESS et la disponibilité du serveur. Détails: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des comptes</Text>

      <TextInput
        style={styles.input}
        placeholder="Email ou numéro de téléphone du destinataire"
        value={recipient}
        onChangeText={setRecipient}
        autoCapitalize="none" // Important pour la saisie d'e-mail
        keyboardType={/^\d+$/.test(recipient) ? 'numeric' : 'default'} // Type de clavier dynamique
      />

      <TextInput
        style={styles.input}
        placeholder="Montant"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4B3FF1' }]}
          onPress={() => handleTransaction('credit')}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Créditer</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#E53935' }]}
          onPress={() => handleTransaction('debit')}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Débiter</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5', // Arrière-plan clair pour un meilleur contraste
  },
  title: {
    fontSize: 26, // Titre légèrement plus grand
    fontWeight: 'bold',
    marginBottom: 30, // Plus d'espace sous le titre
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd', // Couleur de bordure plus claire
    padding: 12, // Plus de rembourrage
    marginBottom: 20, // Plus d'espace entre les entrées
    borderRadius: 10, // Coins plus arrondis
    backgroundColor: '#fff', // Arrière-plan blanc pour les entrées
    fontSize: 16,
    shadowColor: '#000', // Ombre subtile pour les entrées
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribuer les boutons uniformément
    marginTop: 10, // Espace au-dessus des boutons
  },
  button: {
    flex: 1,
    padding: 16, // Plus de rembourrage pour les boutons
    borderRadius: 12, // Boutons plus arrondis
    alignItems: 'center',
    marginHorizontal: 8, // Plus de marge entre les boutons
    shadowColor: '#000', // Ombre pour les boutons
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18, // Texte plus grand pour les boutons
  },
});

export default AdminScreen;
