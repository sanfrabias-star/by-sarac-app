import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Manejar el resultado de un login con redirect
    getRedirectResult(auth)
      .then((result) => {
        if (result && result.user) {
          console.log('Auth: Login successful via redirect.');
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error('Auth: Error getting redirect result:', error);
      })
      .finally(() => {
        // Escucha permanente de cambios de sesión
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          console.log('Auth: onAuthStateChanged ->', firebaseUser ? firebaseUser.uid : null);
          setUser(firebaseUser);
          setLoading(false);
        });

        return () => unsubscribe();
      });
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  const signOut = async () => {
    setLoading(true);
    await firebaseSignOut(auth);
    setUser(null);
    setLoading(false);
  };

  const value = { user, loading, signInWithGoogle, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
