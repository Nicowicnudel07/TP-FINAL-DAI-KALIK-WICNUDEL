import React, { createContext, useMemo, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const value = useMemo(() => ({
    user,
    setUser,
    clearUser: () => setUser(null),
  }), [user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
