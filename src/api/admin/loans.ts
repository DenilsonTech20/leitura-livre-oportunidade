
import { PrismaClient } from '@prisma/client';
import { db } from '@/lib/firebase';
import {
  updateDoc,
  doc,
  collection,
  query,
  getDocs,
  where,
  getDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';

const prisma = new PrismaClient();

// Define loan interface for type safety
interface Loan {
  id: string;
  userId: string;
  bookId: string;
  startTime: Date;
  endTime?: Date | null;
  status: 'ACTIVE' | 'RETURNED' | 'EXPIRED';
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  book?: {
    id: string;
    title: string;
    author: string;
    cover?: string;
  };
  updatedAt: Date;
}

// Get all loans for admin view with pagination
export const getAllLoans = async (
  page: number = 1,
  limit: number = 10,
  status?: string
): Promise<{ loans: Loan[]; total: number; pages: number }> => {
  try {
    const skip = (page - 1) * limit;

    // Build the where clause based on status filter
    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Get total count for pagination
    const total = await prisma.loan.count({ where });
    const pages = Math.ceil(total / limit);

    // Get loans with users and books
    const loans = await prisma.loan.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        book: true,
      },
      orderBy: {
        startTime: 'desc',
      },
      skip,
      take: limit,
    });

    // Ensure all loans have updatedAt
    return {
      loans: loans.map(loan => ({
        ...loan,
        updatedAt: loan.updatedAt || new Date() // Ensure updatedAt is always defined
      })),
      total,
      pages,
    };
  } catch (error) {
    console.error('Error getting all loans:', error);
    throw new Error('Failed to fetch loans');
  }
};

// Update loan status (mark as returned or expired)
export const updateLoanStatus = async (
  loanId: string,
  status: 'ACTIVE' | 'RETURNED' | 'EXPIRED'
): Promise<Loan> => {
  try {
    // Update in Postgres
    const loan = await prisma.loan.update({
      where: { id: loanId },
      data: {
        status,
        endTime: status !== 'ACTIVE' ? new Date() : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        book: true,
      },
    });

    // Update book status if needed
    if (status === 'RETURNED' || status === 'EXPIRED') {
      await prisma.book.update({
        where: { id: loan.bookId },
        data: { status: 'AVAILABLE' },
      });
    } else if (status === 'ACTIVE') {
      await prisma.book.update({
        where: { id: loan.bookId },
        data: { status: 'BORROWED' },
      });
    }

    // Also update in Firebase
    // First find the corresponding document
    const loansRef = collection(db, 'loans');
    const q = query(
      loansRef,
      where('userId', '==', loan.userId),
      where('bookId', '==', loan.bookId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const firebaseLoanDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'loans', firebaseLoanDoc.id), {
        status,
        endTime: status !== 'ACTIVE' ? Timestamp.now() : null,
        updatedAt: serverTimestamp(),
      });
    }

    return {
      ...loan,
      updatedAt: loan.updatedAt || new Date() // Ensure updatedAt is always defined
    };
  } catch (error) {
    console.error('Error updating loan status:', error);
    throw new Error('Failed to update loan status');
  }
};

// Get loan details by ID
export const getLoanById = async (loanId: string): Promise<Loan> => {
  try {
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        book: true,
      },
    });

    if (!loan) {
      throw new Error('Loan not found');
    }

    return {
      ...loan,
      updatedAt: loan.updatedAt || new Date() // Ensure updatedAt is always defined
    };
  } catch (error) {
    console.error('Error getting loan by ID:', error);
    throw new Error('Failed to fetch loan details');
  }
};

// Get summary statistics for admin dashboard
export const getLoanStats = async (): Promise<{
  total: number;
  active: number;
  returned: number;
  expired: number;
}> => {
  try {
    const total = await prisma.loan.count();
    const active = await prisma.loan.count({ where: { status: 'ACTIVE' } });
    const returned = await prisma.loan.count({ where: { status: 'RETURNED' } });
    const expired = await prisma.loan.count({ where: { status: 'EXPIRED' } });

    return {
      total,
      active,
      returned,
      expired,
    };
  } catch (error) {
    console.error('Error getting loan stats:', error);
    throw new Error('Failed to fetch loan statistics');
  }
};

// Create a sync API to ensure data consistency
export const syncLoansData = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Get all loans from Firebase
    const loansRef = collection(db, 'loans');
    const querySnapshot = await getDocs(loansRef);
    
    for (const loanDoc of querySnapshot.docs) {
      const firebaseLoan = loanDoc.data();
      
      // Convert Timestamp to Date
      const startTime = firebaseLoan.startTime.toDate();
      const endTime = firebaseLoan.endTime ? firebaseLoan.endTime.toDate() : null;
      
      // Check if this loan exists in Postgres
      const existingLoan = await prisma.loan.findFirst({
        where: {
          userId: firebaseLoan.userId,
          bookId: firebaseLoan.bookId,
          startTime,
        },
      });
      
      if (!existingLoan) {
        // Create in Postgres
        await prisma.loan.create({
          data: {
            userId: firebaseLoan.userId,
            bookId: firebaseLoan.bookId,
            startTime,
            endTime,
            status: firebaseLoan.status,
          },
        });
      } else if (existingLoan.status !== firebaseLoan.status) {
        // Update status if different
        await prisma.loan.update({
          where: { id: existingLoan.id },
          data: {
            status: firebaseLoan.status,
            endTime: firebaseLoan.endTime ? firebaseLoan.endTime.toDate() : existingLoan.endTime,
          },
        });
      }
    }
    
    return { success: true, message: 'Loans synchronized successfully' };
  } catch (error) {
    console.error('Error syncing loans data:', error);
    throw new Error('Failed to synchronize loans data');
  }
};
