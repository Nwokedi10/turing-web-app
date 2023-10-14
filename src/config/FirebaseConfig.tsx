import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, Auth, User } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Define your Firebase config securely using environment variables, this is the best way but I left it like this because of the testing and Git will probable ignore it when I compile
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};


export const FirebaseContext = createContext<{ auth: Auth | null; user: User | null } | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
}

const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [authInstance, setAuthInstance] = useState<Auth | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const analytics = getAnalytics(app);

    setAuthInstance(auth);
    setFirebaseInitialized(true);

    const unsubscribe = auth.onAuthStateChanged((userData) => {
      setUser(userData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!firebaseInitialized) {
    return null;
  }

  return (
    <FirebaseContext.Provider value={{ auth: authInstance, user }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export { FirebaseProvider };
