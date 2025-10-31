import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRegistration } from '../context/RegistrationContext';

export default function ProfileScreen() {
  const { profile } = useRegistration();

  if (!profile) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Sin datos cargados</Text>
        <Text style={styles.emptySubtitle}>
          Volvé al registro para completar tu información personal.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mi perfil</Text>
      <Text style={styles.subtitle}>Esta es la información que guardamos luego del registro.</Text>

      <View style={styles.card}>
        <Image source={{ uri: profile.photo.uri }} style={styles.avatar} />
        <Text style={styles.name}>{profile.name} {profile.surname}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ubicación guardada</Text>
        <Text style={styles.sectionText}>Latitud: {profile.location.latitude.toFixed(5)}</Text>
        <Text style={styles.sectionText}>Longitud: {profile.location.longitude.toFixed(5)}</Text>
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
    shadowColor: '#00000022',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#e2e8f0',
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  sectionText: {
    fontSize: 16,
    alignSelf: 'flex-start',
    color: '#2d3748',
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
