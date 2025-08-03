import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Platform, Linking } from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { useState } from 'react';

export default function QrScannerScreen({ navigation }) {
	const [permission, requestPermission] = useCameraPermissions();
	const isPermissionGranted = permission?.granted;
	const [dataScanned, setDataScanned] = useState(null);

	const handleQrData = (data) => {
		if (data.startsWith('http') || data.startsWith('https')) {
			Linking.openURL(data).catch(err => console.error('Erreur ouverture URL:', err));
		} else {
			setDataScanned(data);
			// 🔁 tu peux ici ajouter un traitement (ex: rediriger vers une page de paiement)
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

	if (dataScanned) {
		return (
			<SafeAreaView style={styles.container}>
				<Text>QR Code scanné : {dataScanned}</Text>
				<TouchableOpacity onPress={() => setDataScanned(null)} style={styles.button}>
					<Text style={styles.buttonText}>Scanner un autre QR Code</Text>
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
				onBarcodeScanned={({ data }) => {
					if (data) handleQrData(data);
				}}
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
