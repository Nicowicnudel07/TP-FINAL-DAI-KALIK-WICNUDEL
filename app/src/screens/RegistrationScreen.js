import { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Camera, CameraType, CameraView } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

import { LocationContext } from '../context/LocationContext';
import { UserContext } from '../context/UserContext';
import MinionImage from '../../assets/minion.png';

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

export default function RegistrationScreen() {
  const navigation = useNavigation();
  const { getLocation, isLoading, errorMsg, location } = useContext(LocationContext);
  const { setUser } = useContext(UserContext);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [photo, setPhoto] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [cameraType, setCameraType] = useState(
    CameraType?.front ?? Camera?.Constants?.Type?.front ?? 'front'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');

      const notificationStatus = await Notifications.getPermissionsAsync();
      if (notificationStatus.status === 'granted' || notificationStatus.status === 'provisional') {
        setNotificationGranted(true);
      }

      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
    })();
  }, []);

  const ensureNotificationPermission = async () => {
    if (notificationGranted) return true;

    const request = await Notifications.requestPermissionsAsync();
    const granted = request.status === 'granted' || request.status === 'provisional';
    setNotificationGranted(granted);
    return granted;
  };

  const handleGetLocation = async () => {
    const newLocation = await getLocation();
    if (newLocation) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      Alert.alert(
        'Ubicación obtenida',
        `Latitud: ${newLocation.coords.latitude.toFixed(4)}\nLongitud: ${newLocation.coords.longitude.toFixed(4)}`
      );
    }
  };

  const openCamera = async () => {
    if (cameraPermission === false) {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso a tu cámara para capturar la foto de perfil.'
      );
      const status = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status.status === 'granted');
      if (status.status !== 'granted') {
        return;
      }
    }

    setCameraVisible(true);
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.7, skipProcessing: true });
      setPhoto(result);
      setCameraVisible(false);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No pudimos capturar la foto. Intenta nuevamente.');
    }
  };

  const flipCamera = () => {
    const FRONT = CameraType?.front ?? Camera?.Constants?.Type?.front ?? 'front';
    const BACK = CameraType?.back ?? Camera?.Constants?.Type?.back ?? 'back';
    setCameraType((current) => (current === BACK ? FRONT : BACK));
  };

  const sendFeedbackNotification = async ({ title, body }) => {
    const allowed = await ensureNotificationPermission();
    if (!allowed) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  };

  const handleErrorFeedback = async (message) => {
    await sendFeedbackNotification({
      title: 'Registro incompleto',
      body: message,
    });
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Alert.alert('Error', message);
  };

  const handleRegister = async () => {
    const missing = [];
    if (!name.trim()) missing.push('nombre');
    if (!surname.trim()) missing.push('apellido');
    if (!photo) missing.push('foto de perfil');
    if (!location?.coords) missing.push('ubicación');

    if (missing.length) {
      const message = `Necesitas completar ${missing.join(', ')} antes de continuar.`;
      await handleErrorFeedback(message);
      return;
    }

    try {
      setIsSubmitting(true);
      setUser({ name: name.trim(), surname: surname.trim(), photo });

      await sendFeedbackNotification({
        title: 'Registro exitoso',
        body: `Bienvenido/a ${name.trim()} ${surname.trim()}!`,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        '¡Registro exitoso!',
        `Nombre: ${name.trim()} ${surname.trim()}\nUbicación: ${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`,
        [
          {
            text: 'Ir a mi perfil',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error(error);
      await handleErrorFeedback('Ocurrió un error inesperado. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={photo?.uri ? { uri: photo.uri } : MinionImage}
              style={[styles.avatar, photo?.uri && styles.avatarCaptured]}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.cameraButton} onPress={openCamera} activeOpacity={0.9}>
              <MaterialCommunityIcons name="camera" size={20} color="#fff" />
              <Text style={styles.cameraButtonText}>{photo ? 'Cambiar foto' : 'Tomar foto'}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Bienvenidos a todos</Text>
          </View>

          <Text style={styles.paragraph}>
            Completa el formulario para registrarte. Necesitaremos acceso a tu cámara, notificaciones y ubicación.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              placeholder="Ingresa tu nombre"
              placeholderTextColor={colors.textLight}
              value={name}
              onChangeText={setName}
              style={[styles.input, focusedInput === 'name' && styles.inputFocused]}
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
              style={[styles.input, focusedInput === 'surname' && styles.inputFocused]}
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
                isLoading && styles.locationButtonLoading,
              ]}
              onPress={handleGetLocation}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.locationButtonContent}>
                  <Text style={styles.locationButtonText}>
                    {location ? 'Ubicación obtenida' : 'Obtener mi ubicación'}
                  </Text>
                  {location && (
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color="#fff"
                      style={styles.locationButtonIcon}
                    />
                  )}
                </View>
              )}
            </TouchableOpacity>

            {location?.coords && (
              <View style={styles.locationInfo}>
                <MaterialIcons name="my-location" size={16} color={colors.primary} />
                <Text style={styles.locationText}>
                  {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
                </Text>
              </View>
            )}
          </View>

          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.button,
              (isLoading || !location || !photo || isSubmitting) && styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading || !location || !photo || isSubmitting}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Procesando...' : 'Crear mi cuenta'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal animationType="slide" visible={cameraVisible} onRequestClose={() => setCameraVisible(false)}>
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing={cameraType}>
            <View style={styles.cameraOverlay}>
              <TouchableOpacity style={styles.closeCameraButton} onPress={() => setCameraVisible(false)}>
                <MaterialIcons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <View style={styles.cameraControls}>
                <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
                  <MaterialIcons name="flip-camera-android" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shutterButton} onPress={takePicture}>
                  <View style={styles.shutterInner} />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    padding: 24,
    paddingBottom: 40,
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
  },
  avatarCaptured: {
    borderColor: colors.success,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    gap: 8,
  },
  cameraButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 16,
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
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
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
  locationButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationButtonActive: {
    backgroundColor: colors.success,
  },
  locationButtonLoading: {
    opacity: 0.8,
  },
  locationButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
  locationButtonIcon: {
    marginLeft: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(67, 97, 238, 0.08)',
    borderRadius: 8,
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
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
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  closeCameraButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
  cameraControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
  },
  flipButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
});
