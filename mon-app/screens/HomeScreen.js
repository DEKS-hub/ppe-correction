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
  primaryLight: '#6979FF',
  white: '#fff',
  bg: '#F0F3FF',
  transfer: '#D1D9FF',
  payment: '#FFE6E6',
  positive: '#4BB543',
  negative: '#F15B3F',
  textDark: '#222',
  textLight: '#666',
  shadowLight: 'rgba(75, 63, 241, 0.2)',
  shadowStrong: 'rgba(75, 63, 241, 0.3)',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: 50,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: COLORS.bg,
    shadowColor: COLORS.shadowStrong,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  headerIconBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadowLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  balanceContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    marginBottom: 22,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 10,
  },
  balanceLabel: {
    color: COLORS.white,
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 6,
    fontWeight: '600',
  },
  balanceText: {
    fontSize: 42,
    color: COLORS.white,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: 1.5,
  },
  qrCode: {
    width: 110,
    height: 110,
    marginVertical: 16,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.white,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  scanText: {
    color: COLORS.white,
    fontWeight: '700',
    marginTop: 8,
    fontSize: 17,
    letterSpacing: 0.7,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 26,
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 22,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 22,
  },
  menuItem: {
    alignItems: 'center',
    width: 80,
  },
  menuIconCircle: {
    backgroundColor: COLORS.transfer,
    borderRadius: 38,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
  },
  menuText: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.textDark,
    marginLeft: 26,
    marginBottom: 12,
    marginTop: 10,
    letterSpacing: 0.4,
  },
  transactions: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: COLORS.shadowLight,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.11,
    shadowRadius: 14,
    elevation: 5,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  transactionType: {
    fontWeight: '900',
    fontSize: 16,
    color: COLORS.textDark,
    marginBottom: 3,
  },
  transactionDate: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  transactionAmount: {
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 0.6,
  },
  profileModal: {
    position: 'absolute',
    top: 100,
    left: 30,
    right: 30,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 28,
    alignItems: 'center',
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 15,
    zIndex: 100,
  },
  closeModalBtn: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 14,
    backgroundColor: COLORS.transfer,
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 12,
  },
  filterBtn: {
    marginHorizontal: 26,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 22,
    backgroundColor: COLORS.primary,
    borderRadius: 26,
    alignSelf: 'flex-start',
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  filterBtnText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 15,
  },
  filterModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModalContainer: {
    width: 300,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 26,
    alignItems: 'center',
    shadowColor: COLORS.primaryLight,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 15,
  },
  filterOptionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    width: '100%',
  },
  filterOptionBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterOptionText: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  filterOptionTextActive: {
    color: COLORS.white,
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


const TransactionItem = ({ t, userId, navigation }) => (
  <TouchableOpacity
    style={styles.transaction}
    onPress={() => navigation.navigate('TransactionDetail', { transaction: t })}
  >
    <View style={styles.transactionLeft}>
      <View
        style={[
          styles.transactionIcon,
          { backgroundColor: t.type === 'transfer' ? COLORS.transfer : COLORS.payment },
        ]}
      >
        {t.type === 'transfer' ? (
          <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
        ) : (
          <MaterialIcons name="payment" size={20} color={COLORS.negative} />
        )}
      </View>
      <View>
        <Text style={styles.transactionType}>
          {t.sender_id.toString() === userId ? 'Envoi' : 'Réception'}
        </Text>
        <Text style={styles.transactionDate}>{formatDate(t.created_at)}</Text>
      </View>
    </View>
    <Text
      style={[
        styles.transactionAmount,
        { color: t.amount < 0 ? COLORS.negative : COLORS.positive },
      ]}
    >
      {`${t.amount.toLocaleString()} F`}
    </Text>
  </TouchableOpacity>
);



const UserProfileModal = ({ visible }) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      navigation.navigate('Profile');
    }
  }, [visible]);

  return null; // Pas besoin d'afficher quoi que ce soit ici
};



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
          <TouchableOpacity onPress={refreshAll} style={{ marginTop: 10, backgroundColor: COLORS.white, padding: 8, borderRadius: 10 }}>
          <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>🔁</Text>
          </TouchableOpacity>

          <Text style={styles.balanceLabel}>Votre solde</Text>
          <Text style={styles.balanceText}>
            {solde !== null ? `${parseFloat(solde).toLocaleString()} F` : 'Chargement...'}
          </Text>
          
          
          

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
  {filteredTransactions.map((t) => (
    <TransactionItem key={t.id} t={t} userId={userId} navigation={navigation} />
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
