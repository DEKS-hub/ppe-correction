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
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// Note: This is a basic structure. You can customize the screens and navigation as per your requirements.
