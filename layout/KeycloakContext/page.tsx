// src/auth/KeycloakContext.tsx
import Keycloak from 'keycloak-js';
import React, { createContext, useEffect, useState } from 'react';

const keycloak = new Keycloak({
  url: 'http://localhost:8282',
  realm: 'quarkus',
  clientId: 'frontend-client',
});

export const AuthContext = createContext({ keycloak, initialized: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    keycloak
      .init({ onLoad: 'login-required' })
      .then((auth) => {
        if (!auth) {
          window.location.reload();
        } else {
          setInitialized(true);
        }
      });
  }, []);

  return (
    <AuthContext.Provider value={{ keycloak, initialized }}>
      {initialized ? children : <p>Carregando...</p>}
    </AuthContext.Provider>
  );
};