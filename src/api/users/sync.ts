
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// API route to sync user data from Firebase to Postgres
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const userData = await req.json();
    
    if (!userData || !userData.uid || !userData.email) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 400 }
      );
    }
    
    console.log('Syncing user with Postgres:', userData);
    
    // Attempt to find the user in Postgres
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
          role: userData.role || existingUser.role,
          plan: userData.plan || existingUser.plan,
          remainingTime: userData.remainingTime !== undefined ? userData.remainingTime : existingUser.remainingTime,
          updatedAt: new Date(),
        },
      });
      
      return NextResponse.json({ success: true, user: updatedUser });
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          id: userData.uid,
          email: userData.email,
          name: userData.name || 'User',
          password: 'firebase-auth', // Placeholder as actual auth is in Firebase
          role: userData.role || 'USER',
          plan: userData.plan || 'FREE',
          remainingTime: userData.remainingTime || 2700,
        },
      });
      
      return NextResponse.json({ success: true, user: newUser });
    }
  } catch (error) {
    console.error('Error syncing user with Postgres:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}
