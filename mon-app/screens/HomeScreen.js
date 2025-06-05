import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'; // <--- AJOUT DE 'Image' ICI
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';

const COLORS = {
  primary: '#4B3FF1',
  white: '#fff',
  bg: '#F7F8FA',
  transfer: '#E6E9FF',
  payment: '#FFE6E6',
  positive: '#4BB543',
  negative: '#F15B3F',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingTop: 50 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: COLORS.bg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  headerIconBtn: {
    padding: 4,
  },
  balanceContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 15,
    opacity: 0.8,
    marginBottom: 4,
  },
  balanceText: {
    fontSize: 34,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  qrCode: { // Style pour le conteneur du QR Code
    width: 90,
    height: 90,
    marginVertical: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff', // Fond blanc pour le conteneur, utile si le QR est transparent
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 4,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 22,
    backgroundColor: '#fff',
    marginHorizontal: 18,
    borderRadius: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  menuItem: {
    alignItems: 'center',
    width: 70,
  },
  menuIconCircle: {
    backgroundColor: COLORS.transfer,
    borderRadius: 30,
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  menuText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 24,
    marginBottom: 8,
    marginTop: 6,
    letterSpacing: 0.3,
  },
  transactions: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionType: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
  },
  transactionAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  profileModal: {
    position: 'absolute',
    top: 100,
    left: 30,
    right: 30,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 100,
  },
  closeModalBtn: {
    marginTop: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.transfer,
  },
});

// Composants secondaires
const HeaderBar = ({ onProfilePress, onSettingsPress }) => (
  <View style={styles.headerBar}>
    <TouchableOpacity onPress={onSettingsPress} style={styles.headerIconBtn}>
      <Ionicons name="settings-outline" size={26} color={COLORS.primary} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Accueil</Text>
    <TouchableOpacity onPress={onProfilePress} style={styles.headerIconBtn}>
      <Ionicons name="person-circle-outline" size={32} color={COLORS.primary} />
    </TouchableOpacity>
  </View>
);

const UserProfileModal = ({ visible, onClose }) =>
  visible ? (
    <View style={styles.profileModal}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Profil utilisateur</Text>
      <Text>Nom: DEKOUA Bienvenu</Text>
      <Text>Email: bienvenudekoua@email.com</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeModalBtn}>
        <Text style={{ color: COLORS.primary, fontWeight: 'bold', marginTop: 16 }}>Fermer</Text>
      </TouchableOpacity>
    </View>
  ) : null;

const SettingsModal = ({ visible, onClose }) =>
  visible ? (
    <View style={styles.profileModal}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Paramètres</Text>
      <Text>Notifications: Activées</Text>
      <Text>Langue: Français</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeModalBtn}>
        <Text style={{ color: COLORS.primary, fontWeight: 'bold', marginTop: 16 }}>Fermer</Text>
      </TouchableOpacity>
    </View>
  ) : null;

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
};

const TransactionItem = ({ t }) => (
  <View style={styles.transaction}>
    <View style={styles.transactionLeft}>
      <View style={[
        styles.transactionIcon,
        { backgroundColor: t.type === 'transfer' ? COLORS.transfer : COLORS.payment }
      ]}>
        {t.type === 'transfer'
          ? <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
          : <MaterialIcons name="payment" size={20} color={COLORS.negative} />}
      </View>
      <View>
        <Text style={styles.transactionType}>
          {t.type === 'transfer' ? 'Transfert' : 'Paiement'}
        </Text>
        <Text style={styles.transactionDate}>
          {formatDate(t.created_at)}
        </Text>
      </View>
    </View>
    <Text style={[
      styles.transactionAmount,
      { color: t.amount < 0 ? COLORS.negative : COLORS.positive }
    ]}>
      {`${t.amount < 0 ? '' : '+'}${t.amount.toLocaleString()} F`}
    </Text>
  </View>
);

// Composant principal
const HomeScreen = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  // const [payment, setPayment] = useState([]); // payment n'est pas utilisé, vous pourriez le supprimer si ce n'est pas prévu pour plus tard
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [qrCode, setQrCode] = useState(null); // État pour stocker la chaîne Base64 du QR Code
  const [isLoadingQrCode, setIsLoadingQrCode] = useState(true); // Pour l'état de chargement du QR Code
  const [qrCodeError, setQrCodeError] = useState(null); // Pour les erreurs de chargement du QR Code


  // Récupération du QR Code
  useEffect(() => {
    setIsLoadingQrCode(true);
    setQrCodeError(null);
    // Exemple avec ID utilisateur = 6
    fetch("http://192.168.1.122:3000/api/qrcode?id=6")
 // Assurez-vous que cet ID est dynamique si nécessaire
      .then(res => {
        console.log('Statut de la réponse API QR Code:', res.status);
        if (!res.ok) {
          // Essayer de parser le corps de l'erreur si possible
          return res.json().then(errData => {
            throw new Error(`Erreur HTTP ${res.status}: ${errData.error || 'Erreur inconnue du serveur'}`);
          }).catch(() => { // Au cas où le corps de l'erreur n'est pas JSON
            throw new Error(`Erreur HTTP ${res.status}`);
          });
        }
        return res.json();
      })
      .then(data => {
        console.log('Données QR Code reçues:', data);
        if (data.qrCode) {
          setQrCode(data.qrCode); // data.qrCode doit être une chaîne Data URL (ex: "data:image/png;base64,iVBORw0KGgo...")
        } else {
          throw new Error('Aucune donnée qrCode trouvée dans la réponse.');
        }
      })
      .catch(err => {
        console.error('Erreur API QR code:', err);
        setQrCodeError(err.message);
      })
      .finally(() => {
        setIsLoadingQrCode(false);
      });
  }, []);
  
  // Données factices pour les transactions
  useEffect(() => {
    const fakeData = [
      { id: 1, type: 'transfer', amount: 12000, created_at: '2024-05-12T10:00:00' },
      { id: 2, type: 'payment', amount: -4500, created_at: '2024-05-11T14:30:00' },
      { id: 3, type: 'transfer', amount: 12000, created_at: '2024-05-12T10:00:00' },
      { id: 4, type: 'payment', amount: -4500, created_at: '2024-05-11T14:30:00' },
      { id: 5, type: 'transfer', amount: 12000, created_at: '2024-05-12T10:00:00' },
      { id: 6, type: 'payment', amount: -4500, created_at: '2024-05-11T14:30:00' },
    ];
    setTransactions(fakeData);
  }, []);

  return (
    <View style={styles.container}>
      <HeaderBar
        onProfilePress={() => setShowProfile(true)}
        onSettingsPress={() => setShowSettings(true)}
      />

      <ScrollView>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Votre solde</Text>
          <Text style={styles.balanceText}>12 500 F</Text>
          <View style={{ alignItems: 'center' }}>
          {isLoadingQrCode ? (
            <Text>Chargement du QR Code...</Text>
          ) : qrCodeError ? (
            <Text style={{ color: 'red' }}>{qrCodeError}</Text>
          ) : (
            <QRCode value={qrCode} size={80} />
          )}
        </View>

          {qrCodeError && <Text style={{fontSize: 10, color: COLORS.white, marginTop: 4}}>{qrCodeError}</Text>}
          <Text style={styles.scanText}>Mon code QR</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Transfer')}>
            <View style={styles.menuIconCircle}>
              <Ionicons name="swap-horizontal" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Transfert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('payment')}>
            <View style={[styles.menuIconCircle, { backgroundColor: COLORS.payment }]}>
              <MaterialIcons name="payment" size={24} color={COLORS.negative} />
            </View>
            <Text style={styles.menuText}>Paiement</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Transactions récentes</Text>
        <View style={styles.transactions}>
          {transactions.map(t => (
            <TransactionItem key={t.id} t={t} />
          ))}
        </View>
      </ScrollView>

      <UserProfileModal visible={showProfile} onClose={() => setShowProfile(false)} />
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </View>
  );
};

export default HomeScreen;
