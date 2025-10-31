import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { useRegistration } from '../context/RegistrationContext';
import { getDistanceInKm } from '../utils/distance';

export default function LocationScreen() {
  const { profile, setProfile } = useRegistration();

  const distance = useMemo(() => {
    if (!profile?.location) {
      return null;
    }

    return getDistanceInKm(profile.location, profile.referencePoint);
  }, [profile]);

  const refreshLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setProfile((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          location: {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          },
        };
      });

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Para la demo alcanza con ignorarlo, se podría sumar un Alert
    }
  };

  if (!profile) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Necesitamos tu registro</Text>
        <Text style={styles.emptySubtitle}>
          Volvé a la pantalla inicial para completar los datos y activar esta sección.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mi ubicación</Text>
      <Text style={styles.subtitle}>
        Estos datos se obtuvieron con Expo Location y se comparan con un punto de referencia.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Coordenadas actuales</Text>
        <Text style={styles.sectionText}>Latitud: {profile.location.latitude.toFixed(5)}</Text>
        <Text style={styles.sectionText}>Longitud: {profile.location.longitude.toFixed(5)}</Text>
        <Pressable style={styles.button} onPress={refreshLocation}>
          <Text style={styles.buttonText}>Actualizar ubicación</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Referencia</Text>
        <Text style={styles.sectionText}>{profile.referencePoint.label}</Text>
        <Text style={styles.sectionText}>
          Lat: {profile.referencePoint.latitude.toFixed(5)} | Lon: {profile.referencePoint.longitude.toFixed(5)}
        </Text>
        {distance !== null && (
          <Text style={styles.distanceText}>
            Distancia aproximada: {distance.toFixed(2)} km
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
    backgroundColor: '#f5f7fb',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    color: '#4a5568',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 12,
    shadowColor: '#00000022',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionText: {
    fontSize: 16,
    color: '#2d3748',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#2b6cb0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  distanceText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#0f9d58',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
    backgroundColor: '#f5f7fb',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
  },
});
