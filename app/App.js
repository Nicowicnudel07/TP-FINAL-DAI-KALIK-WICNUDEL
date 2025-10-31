import { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

import { RegistrationProvider, useRegistration } from './src/context/RegistrationContext';
import RegistrationScreen from './src/screens/RegistrationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LocationScreen from './src/screens/LocationScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { profile } = useRegistration();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { paddingVertical: 8, height: 64 },
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'person-circle-outline';

          if (route.name === 'Perfil') {
            iconName = profile ? 'person-circle-outline' : 'person-circle';
          }

          if (route.name === 'Ubicación') {
            iconName = 'location-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0f9d58',
        tabBarInactiveTintColor: '#4a5568',
      })}
    >
      <Tab.Screen name="Perfil" component={ProfileScreen} />
      <Tab.Screen name="Ubicación" component={LocationScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Registro" component={RegistrationScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

async function configureNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) {
    await Notifications.requestPermissionsAsync();
  }
}

export default function App() {
  useEffect(() => {
    configureNotifications();
  }, []);

  return (
    <RegistrationProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </RegistrationProvider>
  );
}
