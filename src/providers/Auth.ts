import { useContext } from 'react';
import { FirebaseContext } from '../config/FirebaseConfig';
import { Auth } from 'firebase/auth';

export type User = import("firebase/auth").User;

export const useAuth = (): Auth | null => {
  const context = useContext(FirebaseContext);

  if (!context) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }

  return context.auth;
};
