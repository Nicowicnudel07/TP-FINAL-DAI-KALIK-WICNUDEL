import { useState, useContext } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { LocationContext } from '../context/LocationContext';

export default function RegistrationScreen() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [location, setLocation] = useState(null);
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
      <Text style={styles.title}>Registro de Usuario</Text>
      <Text style={styles.paragraph}>
        Completa el formulario para registrarte. Necesitaremos acceso a tu ubicación.
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          placeholder="Tu nombre"
          value={name}
          onChangeText={setName}
          style={styles.input}
          editable={!isLoading}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Apellido</Text>
        <TextInput
          placeholder="Tu apellido"
          value={surname}
          onChangeText={setSurname}
          style={styles.input}
        />
      </View>

      <View style={styles.locationContainer}>
        <Text style={styles.label}>Ubicación</Text>
        <View style={styles.locationButtonContainer}>
          <Button
            title={
              isLoading 
                ? 'Obteniendo ubicación...' 
                : location 
                  ? 'Ubicación obtenida ✓' 
                  : 'Obtener mi ubicación'
            }
            onPress={handleGetLocation}
            disabled={isLoading}
            color={location ? '#4CAF50' : '#007AFF'}
          />
        </View>
        {location && (
          <Text style={styles.locationText}>
            {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
          </Text>
        )}
      </View>

      {errorMsg && (
        <Text style={styles.errorText}>
          {errorMsg}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Registrarme"
          onPress={handleRegister}
          disabled={isLoading || !location}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
    lineHeight: 24,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  locationContainer: {
    marginBottom: 20,
  },
  locationButtonContainer: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  locationText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});
