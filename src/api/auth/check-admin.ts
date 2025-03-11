import { auth, db } from '@/lib/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkAdminStatus = async (userId: string) => {
  if (!userId) return false;
  
  try {
    // First check in Firebase
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists() && userDoc.data().role === 'ADMIN') {
      return true;
    }
    
    // Then check in Postgres as a fallback
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    return user?.role === 'ADMIN';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const isUserAdmin = async (req: Request) => {
  try {
    // This is a simplified check
    // In a real app, you'd get the user ID from a session or JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    
    const token = authHeader.split(' ')[1];
    // Validate token and get user ID
    // For now, we'll use a placeholder
    const userId = 'placeholder-user-id';
    
    return await checkAdminStatus(userId);
  } catch (error) {
    console.error('Error verifying admin status:', error);
    return false;
  }
};
