import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Button, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function QrScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    try {
      const parsed = JSON.parse(data);
      const receiverPhone = parsed.receiverPhone;

      if (!receiverPhone) {
        throw new Error("QR code invalide");
      }

      // Redirige vers l'écran de transfert avec le numéro du destinataire
      navigation.navigate("TransfertScreen", { receiverPhone });

    } catch (error) {
      Alert.alert("Erreur", "QR code invalide.");
    }
  };

  if (hasPermission === null) return <Text>Demande d'autorisation...</Text>;
  if (hasPermission === false) return <Text>Accès caméra refusé</Text>;

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title="Scanner à nouveau" onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
