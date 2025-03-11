
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Type for the user data coming from Firebase
interface UserSyncData {
  uid: string;
  email: string;
  name?: string | null;
  role: 'USER' | 'ADMIN';
  plan: 'FREE' | 'PREMIUM';
  remainingTime: number;
}

/**
 * Syncs a user from Firebase to the Postgres database
 */
export const syncUser = async (userData: UserSyncData) => {
  try {
    console.log('Syncing user to PostgreSQL:', userData);

    // Check if user already exists in Postgres
    const existingUser = await prisma.user.findUnique({
      where: { id: userData.uid },
    });

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { id: userData.uid },
        data: {
          email: userData.email,
          name: userData.name || null,
          role: userData.role,
          plan: userData.plan,
          remainingTime: userData.remainingTime,
          updatedAt: new Date(),
        },
      });
      console.log('User updated in PostgreSQL:', updatedUser.id);
      return { success: true, user: updatedUser };
    } else {
      // Create new user
      // For a new user, we need to generate a password hash
      // This is just a placeholder - in a real app, you'd use a proper password hash
      const passwordHash = await generatePasswordHash();
      
      const newUser = await prisma.user.create({
        data: {
          id: userData.uid,
          email: userData.email,
          name: userData.name || null,
          password: passwordHash, // Required by schema
          role: userData.role,
          plan: userData.plan,
          remainingTime: userData.remainingTime,
        },
      });
      console.log('User created in PostgreSQL:', newUser.id);
      return { success: true, user: newUser };
    }
  } catch (error) {
    console.error('Error syncing user to PostgreSQL:', error);
    return { success: false, error: error.message };
  }
};

// Simple function to generate a random password hash
// In a real app, you would use a proper password hashing library
const generatePasswordHash = async (): Promise<string> => {
  return Array(64)
    .fill(0)
    .map(() => Math.random().toString(36).charAt(2))
    .join('');
};

// Handler for API requests
export const POST = async (req: Request) => {
  try {
    const userData = await req.json() as UserSyncData;
    
    if (!userData || !userData.uid || !userData.email) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid user data' 
      }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    const result = await syncUser(userData);
    
    return new Response(JSON.stringify(result), { 
      status: result.success ? 200 : 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in POST handler:', error);
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
