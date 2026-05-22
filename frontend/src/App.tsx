"""
Frontend Entry Point - Role-Based Authentication & Routing
Firebase Phone OTP + Dynamic Dashboard Navigation
"""

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';

// Import Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Import Screens
import LoginScreen from './screens/LoginScreen';
import CustomerDashboard from './views/customer/dashboard';
import HotelKitchen from './views/hotel/kitchen';
import DriverLogistics from './views/driver/logistics';

const Stack = createNativeStackNavigator();

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };

// ============================================
// Role-Based Navigator
// ============================================

const RoleBasedNavigator = ({ userRole, onLogout }) => {
  switch (userRole) {
    case 'customer':
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="CustomerDashboard"
            component={CustomerDashboard}
            options={{ 
              title: 'Customer Dashboard',
              headerRight: () => (
                <TouchableOpacity onPress={onLogout} style={{ marginRight: 10 }}>
                  <Text style={{ color: '#007AFF', fontSize: 16 }}>Logout</Text>
                </TouchableOpacity>
              )
            }}
          />
        </Stack.Navigator>
      );
    
    case 'hotel':
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="HotelKitchen"
            component={HotelKitchen}
            options={{ 
              title: 'Kitchen Management',
              headerRight: () => (
                <TouchableOpacity onPress={onLogout} style={{ marginRight: 10 }}>
                  <Text style={{ color: '#007AFF', fontSize: 16 }}>Logout</Text>
                </TouchableOpacity>
              )
            }}
          />
        </Stack.Navigator>
      );
    
    case 'driver':
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="DriverLogistics"
            component={DriverLogistics}
            options={{ 
              title: 'Delivery Tracking',
              headerRight: () => (
                <TouchableOpacity onPress={onLogout} style={{ marginRight: 10 }}>
                  <Text style={{ color: '#007AFF', fontSize: 16 }}>Logout</Text>
                </TouchableOpacity>
              )
            }}
          />
        </Stack.Navigator>
      );
    
    default:
      return null;
  }
};

// ============================================
// Main App Component
// ============================================

export default function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in
        try {
          // Fetch user role from Firestore
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const role = userDocSnap.data().role;
            setUserRole(role);
            setUser(firebaseUser);
          } else {
            console.warn('User document not found in Firestore');
            setUser(null);
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUser(null);
          setUserRole(null);
        }
      } else {
        // User is logged out
        setUser(null);
        setUserRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user && userRole ? (
        // User is authenticated, show role-based navigator
        <RoleBasedNavigator userRole={userRole} onLogout={handleLogout} />
      ) : (
        // User is not authenticated, show login screen
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}