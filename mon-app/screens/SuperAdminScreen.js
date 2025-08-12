import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Statistiques = ({ utilisateursCount, transactionsCount, totalMontant }) => {
  return (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>📊 Statistiques clés</Text>
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: '#4caf50' }]}>
          <Text style={styles.statNumber}>{utilisateursCount}</Text>
          <Text style={styles.statLabel}>Utilisateurs</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#2196f3' }]}>
          <Text style={styles.statNumber}>{transactionsCount}</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#f44336' }]}>
          <Text style={styles.statNumber}>{totalMontant} F</Text>
          <Text style={styles.statLabel}>Montant total</Text>
        </View>
      </View>
    </View>
  );
};

const SuperAdminScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Simulons un admin connecté
  const admin = {
    name: 'Jean Dupont',
    avatarUrl: 'https://i.pravatar.cc/100', // avatar aléatoire
  };

  // Valeurs exemple, à remplacer par tes données dynamiques
  const utilisateursCount = 150;
  const transactionsCount = 3200;
  const totalMontant = '1 230 000';

  const onSearch = () => {
    console.log('Recherche:', searchQuery);
    // TODO : gérer la recherche réelle
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Oui', onPress: () => navigation.navigate('LoginScreen') }, // Adapter selon ta navigation
      ]
    );
  };

  const handleSettings = () => {
    navigation.navigate('AdminSettingsScreen'); // Adapter le nom de l'écran paramètres
  };

  const handleExport = () => {
    Alert.alert('Export', 'Fonction d\'export à implémenter');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Interface SuperAdmin</Text>

      {/* Section Profil + Actions */}
      <View style={styles.profileContainer}>
        <View style={styles.profileInfo}>
          <Image source={{ uri: admin.avatarUrl }} style={styles.avatar} />
          <Text style={styles.adminName}>Bonjour, DA </Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSettings}>
            <Ionicons name="settings-outline" size={24} color="#1e2a78" />
            <Text style={styles.actionText}>Paramètres</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
            <Ionicons name="download-outline" size={24} color="#1e2a78" />
            <Text style={styles.actionText}>Export</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#e53935" />
            <Text style={[styles.actionText, { color: '#e53935' }]}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Statistiques 
        utilisateursCount={utilisateursCount} 
        transactionsCount={transactionsCount} 
        totalMontant={totalMontant} 
      />

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={22} color="#666" style={{ marginLeft: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher utilisateur ou transaction"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={onSearch}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('UserManagementScreen')} activeOpacity={0.8}>
        <LinearGradient colors={['#0052D4', '#4364F7', '#6FB1FC']} style={styles.button}>
          <Ionicons name="people-outline" size={26} color="#fff" />
          <Text style={styles.buttonText}>Gestion des utilisateurs</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('TransactionsHistory')} activeOpacity={0.8}>
        <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.button}>
          <Ionicons name="wallet-outline" size={26} color="#fff" />
          <Text style={styles.buttonText}>Historique des transactions</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SuperAdminScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 25,
    backgroundColor: '#f0f4f8',
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e2a78',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  profileContainer: {
    marginBottom: 30,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  adminName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e2a78',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e2a78',
    marginLeft: 6,
  },
  statsContainer: {
    marginBottom: 30,
  },
  statsTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 10,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 20,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
