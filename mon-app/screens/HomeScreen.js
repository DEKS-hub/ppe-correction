import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'; // <--- AJOUT DE 'Image' ICI
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IP_ADDRESS from './ipConfig'	;
import { Modal } from 'react-native';
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
const TransactionItem = ({ t, userId }) => (
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
          {t.sender_id.toString() === userId ? 'Envoi' : 'Réception'}
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
      {`${t.amount.toLocaleString()} F`}
    </Text>
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
  const [solde, setSolde] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState('all'); 









  // Récupération du QR Code
// Récupération de l'userId au montage du composant
useEffect(() => {
  const fetchUserId = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    setUserId(storedUserId);
  };
  fetchUserId();
}, []);

// Récupération du QR Code
useEffect(() => {
  if (!userId) return;

  setIsLoadingQrCode(true);
  setQrCodeError(null);

  console.log("userId depuis AsyncStorage:", userId);
  console.log("URL appelée:", `${IP_ADDRESS}/api/qrcode?id=${userId}`);

  fetch(`${IP_ADDRESS}/api/qrcode?id=${userId}`)
    .then(res => {
      console.log('Statut de la réponse API QR Code:', res.status);
      if (!res.ok) {
        return res.json().then(errData => {
          throw new Error(`Erreur HTTP ${res.status}: ${errData.error || 'Erreur inconnue du serveur'}`);
        }).catch(() => {
          throw new Error(`Erreur HTTP ${res.status}`);
        });
      }
      return res.json();
    })
    .then(data => {
      console.log('Données QR Code reçues:', data);
      if (data.qrCode) {
        setQrCode(data.qrCode);
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
}, [userId]);

// Récupération de l'historique des transactions
  useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      console.log("L'historique commence déjà bien");

      const response = await fetch(`${IP_ADDRESS}/api/historique?user_id=${userId}`);
      const result = await response.json();

      if (result.status === "ok") {
        const dataWithType = result.data.map(tx => ({
          ...tx,
          type: tx.sender_id.toString() === userId ? 'transfer' : 'payment',
          amount: tx.sender_id.toString() === userId ? -tx.amount : tx.amount
        }));
        setTransactions(dataWithType);
      } else {
        console.error("Erreur côté serveur :", result.error);
      }
    } catch (err) {
      console.error("Erreur de requête transaction :", err);
    }
  };

  fetchTransactions();
}, []);

// Récupération du solde de l'utilisateur
useEffect(() => {
  const fetchSolde = async () => {
    console.log("📦 Récupération du solde de l'utilisateur...");

    try {
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        console.error("❌ userId non trouvé dans AsyncStorage");
        return;
      }

      console.log("✅ userId récupéré :", userId);

      const response = await fetch(`${IP_ADDRESS}/api/solde/${userId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erreur ${response.status} : ${errorData.error}`);
      }

      const data = await response.json();
      console.log("✅ Solde reçu :", data);

      if (data.solde !== undefined) {
        setSolde(data.solde);
      } else {
        console.error("❌ Réponse invalide : 'solde' non défini");
      }

    } catch (err) {
      console.error("❌ Erreur de récupération du solde :", err.message);
    }
  };

  fetchSolde();
}, []);

const refreshAll = async () => {
  if (!userId) return;

  console.log("🔁 Rafraîchissement en cours...");

  try {
    // Récupération du solde
    const resSolde = await fetch(`${IP_ADDRESS}/api/solde/${userId}`);
    const soldeData = await resSolde.json();
    setSolde(soldeData.solde);

    // Récupération du QR code
    const resQR = await fetch(`${IP_ADDRESS}/api/qrcode?id=${userId}`);
    const qrData = await resQR.json();
    setQrCode(qrData.qrCode);

    // Récupération des transactions
    const resHist = await fetch(`${IP_ADDRESS}/api/historique?user_id=${userId}`);
    const histData = await resHist.json();
    const dataWithType = histData.data.map(tx => ({
      ...tx,
      type: tx.sender_id.toString() === userId ? 'transfer' : 'payment',
      amount: tx.sender_id.toString() === userId ? -tx.amount : tx.amount
    }));
    setTransactions(dataWithType);

    console.log("✅ Rafraîchissement terminé");
  } catch (error) {
    console.error("❌ Erreur lors du rafraîchissement :", error);
  }
};

const filteredTransactions = transactions.filter(t => {
  if (filterType === 'all') return true;
  if(filterType === 'sent') return t.type === 'transfer';
  if(filterType === 'received') return t.type === 'payment';
});







  return (
    <View style={styles.container}>
      <HeaderBar
        onProfilePress={() => setShowProfile(true)}
        onSettingsPress={() => setShowSettings(true)}
      />

      <ScrollView>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Votre solde</Text>
          <Text style={styles.balanceText}>
            {solde !== null ? `${parseFloat(solde).toLocaleString()} F` : 'Chargement...'}
          </Text>
          
          <TouchableOpacity onPress={refreshAll} style={{ marginTop: 10, backgroundColor: COLORS.white, padding: 8, borderRadius: 10 }}>
          <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}></Text>
          </TouchableOpacity>


          <View style={{ alignItems: 'center' }}>
          {isLoadingQrCode ? (
            <Text>Chargement du QR Code...</Text>
          ) : qrCodeError ? (
            <Text style={{ color: 'red' }}>{qrCodeError}</Text>
          ) : (
            <QRCode value={qrCode} size={160} />
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
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('QrScanner')}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#D1E8FF' }]}>
              <Ionicons name="qr-code-outline" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Scanner QR</Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity
  style={{
    marginHorizontal: 24,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignSelf: 'flex-start',
  }}
  onPress={() => setShowFilterModal(true)}
>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>Filtrer</Text>
</TouchableOpacity>

{/* Titre des transactions */}
<Text style={styles.sectionTitle}>Transactions récentes</Text>

{/* Liste filtrée */}
<View style={styles.transactions}>
  {filteredTransactions.map(t => (
    <TransactionItem key={t.id} t={t} userId={userId} />
  ))}
</View>

{/* Modal du filtre */}
<Modal
  visible={showFilterModal}
  transparent
  animationType="slide"
  onRequestClose={() => setShowFilterModal(false)}
>
  <View style={{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <View style={{
      width: 280,
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Filtrer les transactions</Text>

      {['all', 'sent', 'received'].map(type => (
  <TouchableOpacity
    key={type}
    style={{
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: filterType === type ? COLORS.primary : '#eee',
      borderRadius: 10,
      marginBottom: 12,
      width: '100%',
    }}
    onPress={() => setFilterType(type)}
  >
    <Text style={{
      color: filterType === type ? 'white' : '#333',
      fontWeight: '600',
      textAlign: 'center',
    }}>
      {type === 'all' ? 'Tout' : type === 'sent' ? 'Envois' : 'Réceptions'}
    </Text>
  </TouchableOpacity>
))}


      <TouchableOpacity
        onPress={() => setShowFilterModal(false)}
        style={{
          marginTop: 10,
          backgroundColor: COLORS.transfer,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
          width: '100%',
        }}
      >
        <Text style={{ textAlign: 'center', color: COLORS.primary, fontWeight: 'bold' }}>Fermer</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      </ScrollView>
      <UserProfileModal visible={showProfile} onClose={() => setShowProfile(false)} />
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
    </View>
  );
};

export default HomeScreen;
