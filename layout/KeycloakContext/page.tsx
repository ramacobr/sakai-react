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
      .init({ onLoad: 'login-required', checkLoginIframe: false })
      .then((authenticated) => {
        if (!authenticated) {
          window.location.reload();
        } else {
          setInitialized(true);

          // Atualiza o token automaticamente a cada 60 segundos
          setInterval(() => {
            keycloak
              .updateToken(60) // tenta renovar se expira em 60s ou menos
              .then((refreshed) => {
                if (refreshed) {
                  console.log("Token renovado com sucesso");
                }
              })
              .catch(() => {
                console.error("Falha ao renovar token");
                keycloak.logout();
              });
          }, 60000); // roda a cada 1 minuto
        }
      });
    // keycloak
    //   .init({ onLoad: 'login-required' })
    //   .then((auth) => {
    //     if (!auth) {
    //       window.location.reload();
    //     } else {
    //       setInitialized(true);
    //     }
    //   });
  }, []);

  return (
    <AuthContext.Provider value={{ keycloak, initialized }}>
      {initialized ? children : <p>Carregando...</p>}
    </AuthContext.Provider>
  );
};