
import { createContext, useEffect, useContext, useState, useCallback } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const signup = async (email, password, name, role = 'user') => {
    setLoading(true);
    setError(null);
    try {
      // Validate role
      if (!['user', 'admin'].includes(role)) {
        throw new Error('Invalid role specified');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        role,
        balance: role === 'admin' ? 0 : 1000, // Admins start with 0 balance
        createdAt: new Date()
      });
      return userCredential;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateBalance = async (userId, newBalance) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        balance: parseFloat(newBalance)
      });
      if (currentUser?.uid === userId) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        setCurrentUser(prev => ({ ...prev, ...userDoc.data() }));
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser({ uid: user.uid, ...userDoc.data() });
          } else {
            await logout();
          }
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Auth state error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [logout]);

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      error,
      signup,
      login,
      logout,
      updateBalance,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};