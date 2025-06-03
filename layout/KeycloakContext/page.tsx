import Keycloak from 'keycloak-js';
import React, { createContext, useEffect, useState } from 'react';

const keycloak = new Keycloak({
  url: process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
});

export const AuthContext = createContext({ keycloak, initialized: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    keycloak
      .init({ onLoad: 'login-required', checkLoginIframe: false })
      .then((authenticated: boolean) => {
        if (!authenticated) {
          window.location.reload();
        } else {
          setInitialized(true);

          // Atualiza o token automaticamente a cada 60 segundos
          setInterval(() => {
            keycloak
              .updateToken(60) // tenta renovar se expira em 60s ou menos
              .then((refreshed: boolean) => {
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
  }, []);

  return (
    <AuthContext.Provider value={{ keycloak, initialized }}>
      {initialized ? children : <p>Carregando...</p>}
    </AuthContext.Provider>
  );
};