import React, { createContext, useState } from 'react';
import * as Location from 'expo-location';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = async () => {
    setIsLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      setErrorMsg('Permiso de ubicación denegado');
      setIsLoading(false);
      return null;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      return location;
    } catch (error) {
      setErrorMsg('Error al obtener la ubicación');
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        errorMsg,
        isLoading,
        getLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
