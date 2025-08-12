import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SuperAdminScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interface SuperAdmin</Text>

      <TouchableOpacity 
        onPress={() => navigation.navigate('UserManagementScreen')} 
        activeOpacity={0.8}
        style={styles.buttonWrapper}
      >
        <LinearGradient colors={['#0052D4', '#4364F7', '#6FB1FC']} style={styles.button}>
          <Ionicons name="people-outline" size={26} color="#fff" />
          <Text style={styles.buttonText}>Gestion des utilisateurs</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('TransactionsHistory')} 
        activeOpacity={0.8}
        style={styles.buttonWrapper}
      >
        <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.button}>
          <Ionicons name="wallet-outline" size={26} color="#fff" />
          <Text style={styles.buttonText}>Historique des transactions</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default SuperAdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',  // Centre verticalement
    alignItems: 'center',      // Centre horizontalement
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e2a78',
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 1,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 350,
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
