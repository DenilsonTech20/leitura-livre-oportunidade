
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  increment
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Helper function to create user document in Firestore
const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = Timestamp.now();

    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        role: 'USER',
        plan: 'FREE',
        remainingTime: 2700, // 45 minutes in seconds
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user document', error);
    }
  }

  return userRef;
};

// Check if user is admin
const checkAdminStatus = async (user) => {
  if (!user) return false;
  
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data().role === 'ADMIN';
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Create admin user if it doesn't exist
const createAdminUser = async (email, password) => {
  try {
    // Check if user exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // User exists, update role to ADMIN if needed
      const userDoc = querySnapshot.docs[0];
      if (userDoc.data().role !== 'ADMIN') {
        await updateDoc(doc(db, 'users', userDoc.id), {
          role: 'ADMIN'
        });
      }
      return;
    }
    
    // Create new admin user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await createUserDocument(user, {
      displayName: 'Admin',
      role: 'ADMIN',
      plan: 'PREMIUM'
    });
    
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

export { 
  app, 
  auth, 
  db,
  storage, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  googleProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  createUserDocument,
  checkAdminStatus,
  createAdminUser
};
export default app;
