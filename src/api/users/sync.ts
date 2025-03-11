
import { db as firestore } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from '@/components/ui/use-toast';
import prisma from '@/lib/prisma';

// Type for the user data
interface UserData {
  uid: string;
  email: string;
  name?: string;
  role?: string;
  plan?: string;
  remainingTime?: number;
}

export async function syncUserWithDatabase(userData: UserData) {
  try {
    console.log('Syncing user data to PostgreSQL:', userData);
    
    // First update Firestore (as backup)
    try {
      const userRef = doc(firestore, 'users', userData.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Update existing document
        await setDoc(userRef, {
          ...userDoc.data(),
          email: userData.email,
          displayName: userData.name || userDoc.data().displayName,
          role: userData.role || userDoc.data().role,
          plan: userData.plan || userDoc.data().plan,
          remainingTime: userData.remainingTime ?? userDoc.data().remainingTime,
          updatedAt: new Date()
        }, { merge: true });
      } else {
        // Create new document
        await setDoc(userRef, {
          email: userData.email,
          displayName: userData.name || 'User',
          role: userData.role || 'USER',
          plan: userData.plan || 'FREE',
          remainingTime: userData.remainingTime || 2700,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error updating user in Firestore:', error);
      // Continue even if Firestore update fails
    }
    
    // Then try to sync with PostgreSQL
    try {
      // Use Prisma client directly
      const prismaUser = await prisma.user.upsert({
        where: { id: userData.uid },
        update: {
          email: userData.email,
          name: userData.name || undefined,
          role: (userData.role as any) || undefined,
          plan: (userData.plan as any) || undefined,
          remainingTime: userData.remainingTime || undefined,
          updatedAt: new Date()
        },
        create: {
          id: userData.uid,
          email: userData.email,
          name: userData.name || 'User',
          password: '', // We don't need password since we're using Firebase auth
          role: (userData.role as any) || 'USER',
          plan: (userData.plan as any) || 'FREE',
          remainingTime: userData.remainingTime || 2700
        }
      });
      
      console.log('User synced with PostgreSQL:', prismaUser);
      return { success: true, user: prismaUser };
    } catch (dbError) {
      console.error('Error syncing user with PostgreSQL:', dbError);
      // Since we've already updated Firestore, we'll consider this a partial success
      return { 
        success: false, 
        error: 'Database sync failed, but Firestore updated successfully.' 
      };
    }
  } catch (error: any) {
    console.error('Error in syncUserWithDatabase:', error);
    toast({
      title: "Error syncing user data",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return { success: false, error: error.message || 'Unknown error' };
  }
}

// This is the API route handler
export default async function handler(req: Request) {
  if (req.method === 'POST') {
    try {
      const userData = await req.json();
      const result = await syncUserWithDatabase(userData);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
        status: result.success ? 200 : 500
      });
    } catch (error: any) {
      console.error('API route error:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message || 'Unknown error' }), 
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
  } else {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }), 
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 405 
      }
    );
  }
}
