
import { PrismaClient } from '@prisma/client';
import { auth, db, doc, getDoc, updateDoc } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

const prisma = new PrismaClient();

// Sync user between Firebase and Postgres
export const syncUserWithDatabase = async (userData: {
  uid: string;
  email: string;
  name?: string;
  role?: string;
  plan?: string;
  remainingTime?: number;
}) => {
  try {
    // Check if user already exists in Postgres
    const existingUser = await prisma.user.findUnique({
      where: { id: userData.uid },
    });

    if (existingUser) {
      // Update existing user
      return await prisma.user.update({
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
    } else {
      // Create new user
      return await prisma.user.create({
        data: {
          id: userData.uid,
          email: userData.email,
          name: userData.name || '',
          password: '', // Actual password is stored in Firebase
          role: userData.role as any || 'USER',
          plan: userData.plan as any || 'FREE',
          remainingTime: userData.remainingTime || 2700,
        },
      });
    }
  } catch (error) {
    console.error('Error syncing user with database:', error);
    throw error;
  }
};

// Get current user data from Postgres
export const getCurrentUserData = async (userId: string) => {
  try {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    return userData;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Update user profile in both Firebase and Postgres
export const updateUserProfile = async (userId: string, data: {
  name?: string;
  email?: string;
  plan?: 'FREE' | 'PREMIUM';
}) => {
  try {
    // Update in Postgres
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        plan: data.plan,
        updatedAt: new Date(),
      },
    });
    
    // Update in Firebase if needed
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      await updateDoc(userRef, {
        displayName: data.name,
        email: data.email,
        plan: data.plan,
      });
    }
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso",
    });
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile:', error);
    toast({
      title: "Erro ao atualizar perfil",
      description: "Tente novamente mais tarde",
      variant: "destructive",
    });
    throw error;
  }
};

// Update user's remaining time
export const updateUserRemainingTime = async (userId: string, newTime: number) => {
  try {
    // Update in Postgres
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        remainingTime: newTime,
        updatedAt: new Date(),
      },
    });
    
    // Update in Firebase
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      remainingTime: newTime,
    });
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user remaining time:', error);
    throw error;
  }
};

// Upgrade user plan
export const upgradeUserPlan = async (userId: string, plan: 'FREE' | 'PREMIUM') => {
  try {
    // Update in Postgres
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan,
        updatedAt: new Date(),
      },
    });
    
    // Update in Firebase
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      plan,
    });
    
    toast({
      title: "Plano atualizado",
      description: `Seu plano foi atualizado para ${plan}`,
    });
    
    return updatedUser;
  } catch (error) {
    console.error('Error upgrading user plan:', error);
    toast({
      title: "Erro ao atualizar plano",
      description: "Tente novamente mais tarde",
      variant: "destructive",
    });
    throw error;
  }
};
