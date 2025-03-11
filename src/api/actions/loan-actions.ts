
import { PrismaClient } from '@prisma/client';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, Timestamp, serverTimestamp, addDoc } from 'firebase/firestore';

const prisma = new PrismaClient();

// Define interface for loan data
interface LoanData {
  id: string;
  userId: string;
  bookId: string;
  startTime: Date;
  endTime?: Date | null;
  status: 'ACTIVE' | 'RETURNED' | 'EXPIRED';
  book: {
    id: string;
    title?: string;
    author?: string;
    cover?: string;
  };
  updatedAt: Date;
}

// Function to borrow a book
export const borrowBook = async (
  userId: string,
  bookId: string,
  durationInSeconds: number = 2700 // Default: 45 minutes
) => {
  try {
    // Check if user has this book already borrowed
    const existingLoan = await prisma.loan.findFirst({
      where: {
        userId,
        bookId,
        status: 'ACTIVE',
      },
    });

    if (existingLoan) {
      throw new Error('You already have this book borrowed');
    }

    // Check if book is available
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book || book.status !== 'AVAILABLE') {
      throw new Error('Book is not available for borrowing');
    }

    // Check user's remaining time
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.remainingTime <= 0 && user.plan === 'FREE') {
      throw new Error('You have no remaining time. Please upgrade your plan.');
    }

    // Calculate end time
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationInSeconds * 1000);

    // Create loan in Postgres
    const loan = await prisma.loan.create({
      data: {
        userId,
        bookId,
        startTime,
        endTime,
        status: 'ACTIVE',
      },
      include: {
        book: true,
      },
    });

    // Update book status
    await prisma.book.update({
      where: { id: bookId },
      data: { status: 'BORROWED' },
    });

    // Also create loan in Firebase
    const loansRef = collection(db, 'loans');
    await addDoc(loansRef, {
      userId,
      bookId,
      startTime: Timestamp.fromDate(startTime),
      endTime: Timestamp.fromDate(endTime),
      status: 'ACTIVE',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      ...loan,
      updatedAt: new Date() // Ensure updatedAt is always defined
    };
  } catch (error) {
    console.error('Error borrowing book:', error);
    throw error;
  }
};

// Get all active loans for a user
export const getUserActiveLoans = async (userId: string): Promise<LoanData[]> => {
  try {
    const loans = await prisma.loan.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        book: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    // Ensure all loans have updatedAt property
    return loans.map(loan => ({
      ...loan,
      updatedAt: loan.updatedAt || new Date(),
      book: {
        id: loan.book.id,
        title: loan.book.title,
        author: loan.book.author,
        cover: loan.book.cover || '',
      }
    }));
  } catch (error) {
    console.error('Error getting user active loans:', error);
    throw error;
  }
};

// Get loan history for a user
export const getUserLoanHistory = async (userId: string): Promise<LoanData[]> => {
  try {
    const loans = await prisma.loan.findMany({
      where: {
        userId,
        status: {
          in: ['RETURNED', 'EXPIRED'],
        },
      },
      include: {
        book: true,
      },
      orderBy: {
        endTime: 'desc',
      },
    });

    // Ensure all loans have updatedAt property
    return loans.map(loan => ({
      ...loan,
      updatedAt: loan.updatedAt || new Date(),
      book: {
        id: loan.book.id,
        title: loan.book.title,
        author: loan.book.author,
        cover: loan.book.cover || '',
      }
    }));
  } catch (error) {
    console.error('Error getting user loan history:', error);
    throw error;
  }
};

// Return a book
export const returnBook = async (loanId: string): Promise<LoanData> => {
  try {
    // Get the loan
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        book: true,
      },
    });

    if (!loan) {
      throw new Error('Loan not found');
    }

    if (loan.status !== 'ACTIVE') {
      throw new Error('This book has already been returned');
    }

    // Update loan status in Postgres
    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: 'RETURNED',
        endTime: new Date(),
      },
      include: {
        book: true,
      },
    });

    // Update book status
    await prisma.book.update({
      where: { id: loan.bookId },
      data: { status: 'AVAILABLE' },
    });

    // Also update in Firebase
    // Find the loan in Firebase first (we need to find by fields since IDs may be different)
    const loansRef = collection(db, 'loans');
    const q = query(
      loansRef,
      where('userId', '==', loan.userId),
      where('bookId', '==', loan.bookId),
      where('status', '==', 'ACTIVE')
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const firebaseLoanDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'loans', firebaseLoanDoc.id), {
        status: 'RETURNED',
        endTime: Timestamp.now(),
        updatedAt: serverTimestamp(),
      });
    }

    return {
      ...updatedLoan,
      updatedAt: updatedLoan.updatedAt || new Date(),
    };
  } catch (error) {
    console.error('Error returning book:', error);
    throw error;
  }
};

// Create an API endpoint to sync user loans between Firebase and Postgres
export const syncUserLoans = async (userId: string) => {
  try {
    // Get all loans from Firebase
    const loansRef = collection(db, 'loans');
    const q = query(loansRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const firebaseLoans = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get all loans from Postgres
    const postgresLoans = await prisma.loan.findMany({
      where: { userId },
    });

    // Sync Firebase loans to Postgres
    for (const firebaseLoan of firebaseLoans) {
      const matchingLoan = postgresLoans.find(
        pl => pl.bookId === firebaseLoan.bookId && 
             pl.status === firebaseLoan.status
      );

      if (!matchingLoan) {
        // Create in Postgres
        await prisma.loan.create({
          data: {
            id: firebaseLoan.id,
            userId: firebaseLoan.userId,
            bookId: firebaseLoan.bookId,
            startTime: firebaseLoan.startTime.toDate(),
            endTime: firebaseLoan.endTime ? firebaseLoan.endTime.toDate() : null,
            status: firebaseLoan.status,
          },
        });
      }
    }

    // Sync Postgres loans to Firebase
    for (const postgresLoan of postgresLoans) {
      const matchingLoan = firebaseLoans.find(
        fl => fl.bookId === postgresLoan.bookId && 
             fl.status === postgresLoan.status
      );

      if (!matchingLoan) {
        // Create in Firebase
        await addDoc(loansRef, {
          userId: postgresLoan.userId,
          bookId: postgresLoan.bookId,
          startTime: Timestamp.fromDate(postgresLoan.startTime),
          endTime: postgresLoan.endTime ? Timestamp.fromDate(postgresLoan.endTime) : null,
          status: postgresLoan.status,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }

    return { success: true, message: 'Loans synchronized successfully' };
  } catch (error) {
    console.error('Error syncing user loans:', error);
    throw error;
  }
};
