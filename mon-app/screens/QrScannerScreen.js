import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { useState } from 'react';
import IP_ADDRESS from './ipConfig';

export default function QrScannerScreen({ navigation }) {
	const [permission, requestPermission] = useCameraPermissions();
	const isPermissionGranted = permission?.granted;
	const [scanned, setScanned] = useState(false);

	const handleQrData = async (data) => {
 		 if (scanned) return;
		 console.log("QR Code scanné :", data);
 		 setScanned(true);

  		try {
    const response = await fetch(`${IP_ADDRESS}/users/by-qrcode/${data}`);
    const user = await response.json();

    if (!response.ok) {
      throw new Error(user.message || 'Utilisateur non trouvé');
    }

    // Envoie le vrai numéro à TransferScreen
    navigation.navigate('Transfer', { receiverPhone: user.mobile });

  } catch (error) {
    console.error(error);
    alert('Erreur : ' + error.message);
    setScanned(false); // Permet de re-scanner
  }
};


	if (!isPermissionGranted) {
		return (
			<SafeAreaView style={styles.container}>
				<TouchableOpacity onPress={requestPermission} style={styles.button}>
					<Text style={styles.buttonText}>Autoriser la caméra</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={StyleSheet.absoluteFillObject}>
			{Platform.OS === 'android' && <StatusBar hidden />}
			<CameraView
				style={StyleSheet.absoluteFillObject}
				facing='back'
				onBarcodeScanned={({ data }) => handleQrData(data)}
			/>

			<View style={styles.scanInstructionsContainer}>
				<Text style={styles.scanInstructionsText}>
					Placez le QR code dans le cadre pour scanner
				</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	button: {
		backgroundColor: '#007BFF',
		padding: 10,
		borderRadius: 5,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
	},
	scanInstructionsContainer: {
		position: "absolute",
		bottom: 100,
		left: 0,
		right: 0,
		alignItems: "center",
	},
	scanInstructionsText: {
		color: "white",
		fontSize: 16,
		fontWeight: "500",
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
	},
});
