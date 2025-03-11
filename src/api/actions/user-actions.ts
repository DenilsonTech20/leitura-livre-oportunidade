
import { PrismaClient } from '@prisma/client';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const prisma = new PrismaClient();

// Function to sync user data between Firebase and PostgreSQL
export const syncUserWithDatabase = async (userData: {
  uid: string;
  email: string;
  name?: string;
  role?: string;
  plan?: string;
  remainingTime?: number;
}) => {
  try {
    console.log('Syncing user with database:', userData);

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
          name: userData.name || existingUser.name,
          role: userData.role as any || existingUser.role,
          plan: userData.plan as any || existingUser.plan,
          remainingTime: userData.remainingTime || existingUser.remainingTime,
          updatedAt: new Date(),
        },
      });
      console.log('User updated in Postgres:', updatedUser.id);
      return updatedUser;
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          id: userData.uid,
          email: userData.email,
          name: userData.name || 'User',
          password: '', // Password is managed by Firebase Auth
          role: userData.role as any || 'USER',
          plan: userData.plan as any || 'FREE',
          remainingTime: userData.remainingTime || 2700,
        },
      });
      console.log('User created in Postgres:', newUser.id);
      return newUser;
    }
  } catch (error) {
    console.error('Error syncing user with Postgres database:', error);
    throw new Error('Failed to sync user with database');
  }
};

// Function to update user's remaining time
export const updateUserRemainingTime = async (
  userId: string,
  newRemainingTime: number
) => {
  try {
    // Update in Firebase
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { remainingTime: newRemainingTime });

    // Update in Postgres
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { remainingTime: newRemainingTime },
    });

    return updatedUser;
  } catch (error) {
    console.error('Error updating user remaining time:', error);
    throw new Error('Failed to update user remaining time');
  }
};

// Function to get user data from Postgres
export const getUserFromDatabase = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch (error) {
    console.error('Error getting user from database:', error);
    throw new Error('Failed to get user from database');
  }
};

// Create or update admin user in Postgres
export const createAdminUserInDatabase = async (
  email: string,
  name: string,
  firebaseUid: string
) => {
  try {
    // Check if admin already exists by email
    const existingAdmin = await prisma.user.findFirst({
      where: { email },
    });

    if (existingAdmin) {
      // Update role to ADMIN if needed
      if (existingAdmin.role !== 'ADMIN') {
        const updatedUser = await prisma.user.update({
          where: { id: existingAdmin.id },
          data: { role: 'ADMIN', plan: 'PREMIUM' },
        });
        console.log('User updated to admin in Postgres:', updatedUser.id);
        return updatedUser;
      }
      console.log('User already has admin role in Postgres');
      return existingAdmin;
    }

    // Create new admin user in Postgres
    const newAdmin = await prisma.user.create({
      data: {
        id: firebaseUid,
        email,
        name,
        password: '',
        role: 'ADMIN',
        plan: 'PREMIUM',
        remainingTime: 0, // Admin doesn't need time limits
      },
    });
    console.log('Admin created in Postgres:', newAdmin.id);
    return newAdmin;
  } catch (error) {
    console.error('Error creating admin user in database:', error);
    throw new Error('Failed to create admin user in database');
  }
};
