
import { auth, getDoc, doc, db } from '@/lib/firebase';

export const checkIfUserIsAdmin = async (userId?: string) => {
  try {
    if (!userId) {
      // If userId is not provided, check the current authenticated user
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        return false;
      }
      
      userId = currentUser.uid;
    }
    
    // Check admin status in Firestore
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return false;
    }
    
    return userDoc.data().role === 'ADMIN';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const requireAdmin = async (req: Request) => {
  // This is a server-side function to protect API routes
  // Get the Firebase ID token from the Authorization header
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: Missing or invalid token');
  }
  
  const token = authHeader.split('Bearer ')[1];
  
  try {
    // Verify the token with Firebase Admin SDK
    // Note: This would normally use Firebase Admin SDK
    // Since we don't have it set up here, we're using a simplified check
    // that just verifies the user is admin in Firestore
    
    // For a real implementation, you would use:
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // const userId = decodedToken.uid;
    
    // For now, we'll use the token as the userId (this is NOT secure)
    const userId = token;
    
    const isAdmin = await checkIfUserIsAdmin(userId);
    
    if (!isAdmin) {
      throw new Error('Forbidden: Admin access required');
    }
    
    return userId;
  } catch (error) {
    console.error('Error requiring admin:', error);
    throw new Error('Unauthorized: Invalid token');
  }
};
