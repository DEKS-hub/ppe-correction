// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './mon-app/screens/LoginScreen';
import SignUpScreen from './mon-app/screens/RegisterScreen';
import HomeScreen from './mon-app/screens/HomeScreen';
import TransferScreen from './mon-app/screens/TransferScreen';
import PaymentScreen from './mon-app/screens/PaymentScreen';
import AdminScreen from './mon-app/screens/AdminScreen';
import Repertoire from './mon-app/screens/Repertoire';  
import QrScannerScreen from './mon-app/screens/QrScannerScreen';
import SuperAdminScreen from './mon-app/screens/SuperAdminScreen';
import TransactionsHistory from './mon-app/screens/TransactionsHistory';
import UserManagementScreen from './mon-app/screens/UserManagementScreen'; // Assurez-vous que ce chemin est correct
import EditUserScreen from './mon-app/screens/EditUserScreen'; // Assurez-vous que le chemin est correct
import AddUserScreen from './mon-app/screens/AddUserScreen'; // Assurez-vous que le

// Assurez-vous que le chemin est correct



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="payment" component={PaymentScreen} />
        <Stack.Screen name="Transfer" component={TransferScreen} />
        <Stack.Screen name="AdminScreen" component={AdminScreen} />
        <Stack.Screen name="Repertoire" component={Repertoire} />
        <Stack.Screen name="QrScanner" component={QrScannerScreen} /> 
        <Stack.Screen name="SuperAdminScreen" component={SuperAdminScreen} />
        <Stack.Screen name="TransactionsHistory" component={TransactionsHistory} />
        <Stack.Screen name="UserManagementScreen" component={UserManagementScreen} /> 
        <Stack.Screen name="EditUserScreen" component={EditUserScreen} />
        <Stack.Screen name="AddUserScreen" component={AddUserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// Note: This is a basic structure. You can customize the screens and navigation as per your requirements.
