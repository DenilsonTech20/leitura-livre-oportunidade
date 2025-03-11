
import { PrismaClient } from '@prisma/client';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const prisma = new PrismaClient();

export const syncUserWithDatabase = async (req: Request) => {
  try {
    const userData = await req.json();
    const { uid, email, name, role, plan, remainingTime } = userData;
    
    if (!uid || !email) {
      return new Response(JSON.stringify({ error: 'Missing required user data' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: uid },
    });
    
    let result;
    
    if (existingUser) {
      // Update user
      result = await prisma.user.update({
        where: { id: uid },
        data: {
          email,
          name: name || existingUser.name,
          role: (role as any) || existingUser.role,
          plan: (plan as any) || existingUser.plan,
          remainingTime: remainingTime || existingUser.remainingTime,
        },
      });
    } else {
      // Create user
      result = await prisma.user.create({
        data: {
          id: uid,
          email,
          name: name || 'User',
          password: '', // Password managed by Firebase
          role: (role as any) || 'USER',
          plan: (plan as any) || 'FREE',
          remainingTime: remainingTime || 2700,
        },
      });
    }
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error syncing user with database:', error);
    return new Response(JSON.stringify({ error: 'Failed to sync user with database' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// Full sync of all Firebase users to Postgres
export const syncAllUsers = async () => {
  try {
    // Get all users from Firebase
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    for (const userDoc of querySnapshot.docs) {
      const firebaseUser = userDoc.data();
      const uid = userDoc.id;
      
      // Check if this user exists in Postgres
      const existingUser = await prisma.user.findUnique({
        where: { id: uid },
      });
      
      if (!existingUser) {
        // Create in Postgres
        await prisma.user.create({
          data: {
            id: uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'User',
            password: '', // Password managed by Firebase
            role: (firebaseUser.role as any) || 'USER',
            plan: (firebaseUser.plan as any) || 'FREE',
            remainingTime: firebaseUser.remainingTime || 2700,
          },
        });
      } else {
        // Update user data
        await prisma.user.update({
          where: { id: uid },
          data: {
            email: firebaseUser.email,
            name: firebaseUser.displayName || existingUser.name,
            role: (firebaseUser.role as any) || existingUser.role,
            plan: (firebaseUser.plan as any) || existingUser.plan,
            remainingTime: firebaseUser.remainingTime || existingUser.remainingTime,
          },
        });
      }
    }
    
    return { success: true, message: 'All users synchronized successfully' };
  } catch (error) {
    console.error('Error syncing all users:', error);
    throw new Error('Failed to synchronize all users');
  }
};
