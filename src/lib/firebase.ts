
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification
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
  increment,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
      
      // Also sync with Postgres database using server action
      await syncUserWithDatabase({
        uid: user.uid,
        email,
        name: displayName || (additionalData as { displayName?: string })?.displayName,
        role: (additionalData as { role?: string })?.role || 'USER',
        plan: (additionalData as { plan?: string })?.plan || 'FREE',
        remainingTime: 2700
      });
      
      // Send email verification if it's a new user
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (error) {
      console.error('Error creating user document', error);
    }
  }

  return userRef;
};

// Sync user with Postgres database
const syncUserWithDatabase = async (userData) => {
  try {
    const response = await fetch('/api/users/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync user with database');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error syncing user with database:', error);
    // Continue even if sync fails - we'll retry later
  }
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
    console.log('Attempting to create admin user:', email);
    
    // First check if the user already exists by email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // User exists, update role to ADMIN if needed
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      if (userData.role !== 'ADMIN') {
        await updateDoc(doc(db, 'users', userDoc.id), {
          role: 'ADMIN'
        });
        console.log('User updated to admin role');
      } else {
        console.log('User already has admin role');
      }
      return;
    }
    
    // Create new admin user
    console.log('Creating new admin user');
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
    throw error;
  }
};

// Book related functions
const addBook = async (bookData) => {
  try {
    const booksRef = collection(db, 'books');
    const bookDoc = await addDoc(booksRef, {
      ...bookData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'AVAILABLE'
    });
    
    return bookDoc.id;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

const getBooks = async () => {
  try {
    const booksRef = collection(db, 'books');
    const querySnapshot = await getDocs(booksRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting books:', error);
    throw error;
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
  sendEmailVerification,
  createUserDocument,
  checkAdminStatus,
  createAdminUser,
  addBook,
  getBooks,
  // Export Firestore functions explicitly
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  serverTimestamp,
  addDoc
};
export default app;
