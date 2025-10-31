import { useContext, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LocationContext } from '../context/LocationContext';

const colors = {
  background: '#f8f9fa',
  text: '#2b2d42',
  textLight: '#8d99ae',
  primary: '#4361ee',
};

export default function MapScreen() {
  const { location, isLoading, getLocation, errorMsg } = useContext(LocationContext);

  const hasCoords = Boolean(location?.coords);

  useEffect(() => {
    if (!hasCoords && !isLoading) {
      getLocation();
    }
  }, [hasCoords, isLoading, getLocation]);

  return (
    <View style={styles.container}>
      {hasCoords ? (
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Tu ubicación"
            description="Ubicación obtenida durante el registro"
          />
        </MapView>
      ) : (
        <View style={styles.feedback}>
          {isLoading ? (
            <>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.feedbackText}>Obteniendo ubicación...</Text>
            </>
          ) : (
            <>
              <Text style={styles.feedbackTitle}>Ubicación pendiente</Text>
              <Text style={styles.feedbackText}>
                {errorMsg || 'Necesitamos tu ubicación para mostrar el mapa. Presiona el botón en la pantalla de registro.'}
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedback: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 15,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
  },
});
