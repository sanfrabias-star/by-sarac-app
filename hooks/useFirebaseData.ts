import { useEffect, useState, useCallback } from 'react';
import { 
  doc, 
  onSnapshot, 
  setDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { type Section } from '../types';

interface MonthData {
  income: number;
  sections: Section[];
}

interface AppData {
  [month: string]: MonthData;
}

export const useFirebaseData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AppData>({});
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!user) {
      setData({});
      setLoading(false);
      return;
    }

    setLoading(true);
    const userDocRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data() as { expenseData?: AppData };
          setData(userData.expenseData || {});
        } else {
          setData({});
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading data from Firestore:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const saveData = useCallback(
    async (newData: AppData) => {
      if (!user || !newData) return;

      setSyncing(true);
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(
          userDocRef,
          {
            expenseData: newData,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving data to Firestore:', error);
      } finally {
        setTimeout(() => setSyncing(false), 500);
      }
    },
    [user]
  );

  return { data, loading, syncing, saveData };
};
