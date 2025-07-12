import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  startAfter,
  limitToLast,
  deleteDoc,
  increment
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Get user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
                         // Create initial user profile if it doesn't exist
             const initialProfile = {
               email: firebaseUser.email,
               name: firebaseUser.displayName || 'User',
               createdAt: serverTimestamp(),
               preferences: {
                 language: 'en',
                 notifications: true
               },
               stats: {
                 totalConversations: 0,
                 lastConversation: null
               }
             };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), initialProfile);
            setUserProfile(initialProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError('Failed to load user profile');
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up function
  const signUp = async (email, password, name) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create user account
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Update user profile with name
      await updateProfile(user, {
        displayName: name
      });

             // Create user document in Firestore
       const userProfile = {
         email: email,
         name: name,
         createdAt: serverTimestamp(),
         preferences: {
           language: 'en',
           notifications: true
         },
         stats: {
           totalConversations: 0,
           lastConversation: null
         }
       };

      await setDoc(doc(db, 'users', user.uid), userProfile);
      setUserProfile(userProfile);

      return { success: true };
    } catch (err) {
      console.error('Sign up error:', err);
      let errorMessage = 'An error occurred during sign up';
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        default:
          errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      console.error('Sign in error:', err);
      let errorMessage = 'An error occurred during sign in';
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        default:
          errorMessage = err.message;
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setError(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError('Failed to sign out');
    }
  };

  // Update user profile
  const updateUserProfile = async (updateData) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Update Firestore document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });

      // Update local state
      setUserProfile(prev => ({ ...prev, ...updateData }));

      // Update Firebase Auth profile if name changed
      if (updateData.name) {
        await updateProfile(user, {
          displayName: updateData.name
        });
      }

      return { success: true };
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMessage = 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      console.error('Password reset error:', err);
      let errorMessage = 'Failed to send password reset email';
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        default:
          errorMessage = err.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Change password
  const changePassword = async (newPassword) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      await updatePassword(user, newPassword);
      return { success: true };
    } catch (err) {
      console.error('Password change error:', err);
      let errorMessage = 'Failed to change password';
      
      switch (err.code) {
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/requires-recent-login':
          errorMessage = 'Please sign in again to change your password';
          break;
        default:
          errorMessage = err.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Save medical history entry - NEW SCALABLE VERSION
  const saveMedicalEntry = async (entry) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      // Create a new document in the medicalHistory subcollection
      const medicalHistoryRef = collection(db, 'users', user.uid, 'medicalHistory');
      
      const newEntry = {
        id: Date.now(),
        userId: user.uid,
        ...entry,
        timestamp: new Date(),
        savedAt: new Date().toISOString()
      };
      
      // Add as a separate document instead of array item
      await addDoc(medicalHistoryRef, newEntry);
      
      // Update user stats (optional - for quick stats display)
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'stats.totalConversations': increment(1),
        'stats.lastConversation': new Date(),
        updatedAt: serverTimestamp()
      });
      
      return { success: true, entryId: newEntry.id };
    } catch (err) {
      console.error('Save medical entry error:', err);
      return { success: false, error: 'Failed to save medical entry' };
    }
  };

  // Get paginated medical history - NEW FUNCTION
  const getMedicalHistory = async (limit = 20, lastDoc = null) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      const medicalHistoryRef = collection(db, 'users', user.uid, 'medicalHistory');
      
      let queryRef = query(
        medicalHistoryRef,
        orderBy('timestamp', 'desc'),
        limitToLast(limit)
      );
      
      // For pagination - start after the last document
      if (lastDoc) {
        queryRef = query(
          medicalHistoryRef,
          orderBy('timestamp', 'desc'),
          startAfter(lastDoc),
          limitToLast(limit)
        );
      }
      
      const snapshot = await getDocs(queryRef);
      
      const entries = [];
      let lastDocument = null;
      
      snapshot.forEach((doc) => {
        entries.push({
          id: doc.id,
          ...doc.data()
        });
        lastDocument = doc; // Keep track of last document for pagination
      });
      
      return { 
        success: true, 
        entries, 
        lastDocument,
        hasMore: entries.length === limit 
      };
    } catch (err) {
      console.error('Get medical history error:', err);
      return { success: false, error: 'Failed to load medical history' };
    }
  };

  // Delete medical history entry - NEW FUNCTION
  const deleteMedicalEntry = async (entryId) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      const entryRef = doc(db, 'users', user.uid, 'medicalHistory', entryId);
      await deleteDoc(entryRef);
      
      // Update user stats
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'stats.totalConversations': increment(-1),
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (err) {
      console.error('Delete medical entry error:', err);
      return { success: false, error: 'Failed to delete medical entry' };
    }
  };

  // Get auth token (for API calls)
  const getToken = async () => {
    if (user) {
      try {
        return await user.getIdToken();
      } catch (err) {
        console.error('Error getting token:', err);
        return null;
      }
    }
    return null;
  };

  const value = {
    user,
    userProfile,
    isLoading,
    error,
    signUp,
    signIn,
    signOut: signOutUser,
    updateProfile: updateUserProfile,
    resetPassword,
    changePassword,
    saveMedicalEntry,
    getMedicalHistory, // Add new function to context
    deleteMedicalEntry, // Add new function to context
    getToken,
    isAuthenticated: !!user,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 