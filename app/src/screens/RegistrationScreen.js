import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { useCameraPermissions } from 'expo-camera';

import CameraModal from '../components/CameraModal';
import { useRegistration } from '../context/RegistrationContext';

const CLUB_COORDINATES = {
  latitude: -34.6037,
  longitude: -58.3816,
  label: 'Obelisco (punto de referencia)',
};

export default function RegistrationScreen({ navigation }) {
  const { setProfile } = useRegistration();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (cameraPermission && cameraPermission.granted) {
      return;
    }

    requestCameraPermission();
  }, [cameraPermission, requestCameraPermission]);

  const canSubmit = useMemo(() => {
    return name.trim() && surname.trim() && photo && location;
  }, [name, surname, photo, location]);

  const handleOpenCamera = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara para tomar tu foto.');
        return;
      }
    }

    setCameraVisible(true);
  };

  const handleCapture = (capturedPhoto) => {
    setPhoto(capturedPhoto);
    setCameraVisible(false);
  };

  const handleGetLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'No podemos obtener tu ubicación sin permisos.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      Alert.alert('Error', 'No pudimos obtener tu ubicación. Intentalo nuevamente.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const sendFeedback = async ({ title, body, success }) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });

    const hapticType = success
      ? Haptics.NotificationFeedbackType.Success
      : Haptics.NotificationFeedbackType.Error;
    await Haptics.notificationAsync(hapticType);
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      await sendFeedback({
        title: 'Registro incompleto',
        body: 'Revisá los campos obligatorios y volvé a intentarlo.',
        success: false,
      });
      return;
    }

    const profileData = {
      name: name.trim(),
      surname: surname.trim(),
      photo,
      location,
      referencePoint: CLUB_COORDINATES,
    };

    setProfile(profileData);
    await sendFeedback({
      title: '¡Registro completado!',
      body: 'Tus datos quedaron guardados correctamente.',
      success: true,
    });

    navigation.replace('MainTabs');
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear mi perfil</Text>
        <Text style={styles.subtitle}>
          Completá tus datos, tomá una foto y compartí tu ubicación para habilitar la app.
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            placeholder="Pérez"
            value={surname}
            onChangeText={setSurname}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Selfie de perfil</Text>
          {photo ? (
            <Image source={{ uri: photo.uri }} style={styles.preview} />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Text style={styles.placeholderText}>Sin foto todavía</Text>
            </View>
          )}
          <Pressable style={styles.secondaryButton} onPress={handleOpenCamera}>
            <Text style={styles.secondaryButtonText}>Tomar foto</Text>
          </Pressable>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Ubicación actual</Text>
          {location ? (
            <View style={styles.locationBox}>
              <Text style={styles.locationText}>
                Lat: {location.latitude.toFixed(5)} | Lon: {location.longitude.toFixed(5)}
              </Text>
            </View>
          ) : (
            <View style={styles.locationBox}>
              <Text style={styles.placeholderText}>Todavía no capturamos tu ubicación</Text>
            </View>
          )}
          <Pressable style={styles.secondaryButton} onPress={handleGetLocation} disabled={loadingLocation}>
            <Text style={styles.secondaryButtonText}>
              {loadingLocation ? 'Obteniendo ubicación...' : 'Obtener ubicación'}
            </Text>
          </Pressable>
        </View>

        <Pressable style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Confirmar registro</Text>
        </Pressable>
      </ScrollView>

      <CameraModal visible={cameraVisible} onClose={() => setCameraVisible(false)} onCapture={handleCapture} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2d3748',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
  },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 12,
  },
  previewPlaceholder: {
    height: 220,
    borderRadius: 16,
    backgroundColor: '#edf2f7',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#718096',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#2b6cb0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  locationBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#0f9d58',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.75,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
