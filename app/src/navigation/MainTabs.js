import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useContext } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import ProfileScreen from '../screens/ProfileScreen';
import MapScreen from '../screens/MapScreen';
import { UserContext } from '../context/UserContext';

const Tab = createBottomTabNavigator();

const palette = {
  primary: '#4361ee',
  textLight: '#8d99ae',
  card: '#ffffff',
  border: '#e9ecef',
};

const screenOptions = () => ({
  headerShown: false,
  tabBarActiveTintColor: palette.primary,
  tabBarInactiveTintColor: palette.textLight,
  tabBarStyle: {
    backgroundColor: palette.card,
    borderTopColor: palette.border,
    paddingBottom: 4,
    height: 64,
  },
});

export default function MainTabs() {
  const { user } = useContext(UserContext);

  return (
    <Tab.Navigator screenOptions={screenOptions()}>
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
          tabBarLabel: user?.name ? user.name : 'Perfil',
        }}
      />
      <Tab.Screen
        name="Mapa"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
