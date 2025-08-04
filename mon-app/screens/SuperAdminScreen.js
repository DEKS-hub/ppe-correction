import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SuperAdminScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Interface SuperAdmin</Text>

      <TouchableOpacity onPress={() => navigation.navigate('UserManagement')} activeOpacity={0.8}>
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
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: 1,
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
