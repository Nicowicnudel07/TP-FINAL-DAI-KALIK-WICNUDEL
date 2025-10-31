import { createContext, useContext, useMemo, useState } from 'react';

const RegistrationContext = createContext();

export function RegistrationProvider({ children }) {
  const [profile, setProfile] = useState(null);

  const value = useMemo(() => ({ profile, setProfile }), [profile]);

  return (
    <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);

  if (!context) {
    throw new Error('useRegistration must be used inside a RegistrationProvider');
  }

  return context;
}
