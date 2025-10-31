import { useContext } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { UserContext } from '../context/UserContext';
import { LocationContext } from '../context/LocationContext';

const colors = {
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#2b2d42',
  textLight: '#8d99ae',
  primary: '#4361ee',
  border: '#e9ecef',
};

export default function ProfileScreen() {
  const { user } = useContext(UserContext);
  const { location } = useContext(LocationContext);

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No hay datos de registro disponibles. Completa el formulario para comenzar.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        {user.photo?.uri && (
          <Image source={{ uri: user.photo.uri }} style={styles.avatar} />
        )}
        <Text style={styles.title}>{user.name} {user.surname}</Text>
        <Text style={styles.subtitle}>Registro completado correctamente</Text>

        {location?.coords && (
          <View style={styles.locationBox}>
            <Text style={styles.locationTitle}>Última ubicación</Text>
            <Text style={styles.locationText}>
              Lat: {location.coords.latitude.toFixed(4)}
            </Text>
            <Text style={styles.locationText}>
              Lng: {location.coords.longitude.toFixed(4)}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textLight,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  locationBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f1f3ff',
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textLight,
    fontSize: 16,
    lineHeight: 24,
  },
});
