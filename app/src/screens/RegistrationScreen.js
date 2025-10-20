import { useState, useContext } from 'react';
import { StyleSheet, Text, TextInput, View, Alert, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { LocationContext } from '../context/LocationContext';
import { MaterialIcons } from '@expo/vector-icons';
import GruImage from '../../assets/gru.png';

export default function RegistrationScreen() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [location, setLocation] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const { getLocation, isLoading, errorMsg } = useContext(LocationContext);

  const handleGetLocation = async () => {
    const locationData = await getLocation();
    if (locationData) {
      setLocation(locationData);
      Alert.alert(
        'Ubicación obtenida',
        `Latitud: ${locationData.coords.latitude.toFixed(4)}\n` +
        `Longitud: ${locationData.coords.longitude.toFixed(4)}`
      );
    }
  };

  const handleRegister = () => {
    if (!name || !surname) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    if (!location) {
      Alert.alert('Error', 'Por favor obtén tu ubicación primero');
      return;
    }

    // Aquí iría la lógica de registro
    Alert.alert(
      '¡Registro exitoso!',
      `Nombre: ${name} ${surname}\n` +
      `Ubicación: ${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`,
      [
        {
          text: 'Aceptar',
          onPress: () => {
            // Limpiar formulario después de registro exitoso
            setName('');
            setSurname('');
            setLocation(null);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={GruImage} 
          style={styles.avatar} 
          resizeMode="contain"
        />
        <Text style={styles.title}>Registro de Usuario</Text>
      </View>
      <Text style={styles.paragraph}>
        Completa el formulario para registrarte. Necesitaremos acceso a tu ubicación.
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          placeholder="Ingresa tu nombre"
          placeholderTextColor={colors.textLight}
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            focusedInput === 'name' && styles.inputFocused
          ]}
          onFocus={() => setFocusedInput('name')}
          onBlur={() => setFocusedInput(null)}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Apellido</Text>
        <TextInput
          placeholder="Ingresa tu apellido"
          placeholderTextColor={colors.textLight}
          value={surname}
          onChangeText={setSurname}
          style={[
            styles.input,
            focusedInput === 'surname' && styles.inputFocused
          ]}
          onFocus={() => setFocusedInput('surname')}
          onBlur={() => setFocusedInput(null)}
        />
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationHeader}>
          <MaterialIcons name="location-on" size={20} color={colors.primary} />
          <Text style={styles.locationTitle}>Ubicación</Text>
        </View>
        <Text style={styles.locationDescription}>
          Necesitamos tu ubicación para ofrecerte una mejor experiencia.
        </Text>
        
        <TouchableOpacity 
          style={[
            styles.locationButton,
            location && styles.locationButtonActive,
            isLoading && styles.locationButtonLoading
          ]}
          onPress={handleGetLocation}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.locationButtonText}>
              {location ? 'Ubicación obtenida' : 'Obtener mi ubicación'}
              {location && <MaterialIcons name="check-circle" size={16} color="#fff" style={{ marginLeft: 8 }} />}
            </Text>
          )}
        </TouchableOpacity>
        
        {location && (
          <View style={styles.locationInfo}>
            <MaterialIcons name="my-location" size={16} color={colors.primary} />
            <Text style={styles.locationText}>
              {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
            </Text>
          </View>
        )}
      </View>

      {errorMsg && (
        <Text style={styles.errorText}>
          {errorMsg}
        </Text>
      )}

      <TouchableOpacity 
        style={[
          styles.button,
          (isLoading || !location) && styles.buttonDisabled
        ]}
        onPress={handleRegister}
        disabled={isLoading || !location}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Procesando...' : 'Crear mi cuenta'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Colores de la aplicación
const colors = {
  primary: '#4361ee',
  primaryLight: '#4895ef',
  secondary: '#3f37c9',
  success: '#4bb543',
  error: '#f72585',
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#2b2d42',
  textLight: '#8d99ae',
  border: '#e9ecef',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    color: colors.text,
    letterSpacing: 0.5,
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: colors.textLight,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: colors.text,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.card,
    color: colors.text,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inputFocused: {
    borderColor: colors.primaryLight,
    backgroundColor: '#f8f9ff',
  },
  buttonContainer: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  locationContainer: {
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  locationButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  locationText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '500',
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    padding: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  // Botón de ubicación
  locationButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  locationButtonActive: {
    backgroundColor: colors.success,
  },
  locationButtonLoading: {
    opacity: 0.8,
  },
  locationButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  locationDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
    lineHeight: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(67, 97, 238, 0.08)',
    borderRadius: 8,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: 'rgba(247, 37, 133, 0.1)',
    padding: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
