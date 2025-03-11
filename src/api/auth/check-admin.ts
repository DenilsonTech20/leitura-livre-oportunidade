
import { PrismaClient } from '@prisma/client';
import { auth, db, doc, getDoc } from '@/lib/firebase';

const prisma = new PrismaClient();

// Check if a user is an admin in both Firebase and Postgres
export const checkAdmin = async (userId: string) => {
  try {
    // First check in Firebase
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists() && userDoc.data().role === 'ADMIN') {
      return true;
    }
    
    // Then check in Postgres as fallback
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (user && user.role === 'ADMIN') {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Handler for API requests
export const POST = async (req: Request) => {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'User ID is required' 
      }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    const isAdmin = await checkAdmin(userId);
    
    return new Response(JSON.stringify({ 
      success: true, 
      isAdmin 
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('Error in check-admin POST handler:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Server error' 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
};

export default { POST };
