import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { LocationProvider } from './src/context/LocationContext';
import RegistrationScreen from './src/screens/RegistrationScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <LocationProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerShown: false
          }}>
          <Stack.Screen
            name="Registro"
            component={RegistrationScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LocationProvider>
  );
}
