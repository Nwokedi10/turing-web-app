import React, { useEffect, useContext, ReactNode } from 'react';
import { FirebaseContext } from '../config/FirebaseConfig';
import { Auth } from 'firebase/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const firebaseContext = useContext(FirebaseContext);

  useEffect(() => {
    if (!firebaseContext) {
      return;
    }

    const { auth } = firebaseContext;

    if (auth && auth.currentUser) {
      const { currentUser } = auth;
      if (currentUser.emailVerified) {
        document.cookie = "uid=currentUser.uid; expires=Sun, 01 Jan 2023 00:00:00 UTC; path=/";
      } 
    }
  }, [firebaseContext]);

  return <>{children}</>;
};
