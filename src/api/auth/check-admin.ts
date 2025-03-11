
import { checkAdminStatus } from '@/lib/firebase';

export const checkUserAdminStatus = async (userId: string) => {
  try {
    if (!userId) {
      return { isAdmin: false };
    }
    
    // This function uses Firebase to check if user has admin role
    const isAdmin = await checkAdminStatus({ uid: userId });
    
    return { isAdmin };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false, error: 'Failed to check admin status' };
  }
};
