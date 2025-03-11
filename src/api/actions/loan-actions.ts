
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { LoanStatus, FileType, BookStatus } from '@/types';

// Interface for loan data
interface LoanData {
  id: string;
  userId: string;
  bookId: string;
  startTime: Date;
  endTime?: Date | null;
  status: LoanStatus;
  createdAt: Date;
  updatedAt: Date;
  book?: {
    id: string;
    title: string;
    author: string;
    cover: string;
    fileType: FileType;
  };
}

// Get user's active loans
export const getUserActiveLoans = async (userId: string) => {
  try {
    const loansRef = collection(db, 'loans');
    const q = query(
      loansRef,
      where('userId', '==', userId),
      where('status', '==', LoanStatus.ACTIVE)
    );
    
    const querySnapshot = await getDocs(q);
    const loans: LoanData[] = [];
    
    for (const loanDoc of querySnapshot.docs) {
      const loanData = loanDoc.data() as Omit<LoanData, 'id'>;
      
      // Get book data
      const bookRef = doc(db, 'books', loanData.bookId);
      const bookDoc = await getDoc(bookRef);
      
      if (bookDoc.exists()) {
        const bookData = bookDoc.data();
        
        loans.push({
          id: loanDoc.id,
          userId: loanData.userId,
          bookId: loanData.bookId,
          startTime: loanData.startTime,
          endTime: loanData.endTime,
          status: loanData.status,
          createdAt: loanData.createdAt,
          updatedAt: loanData.updatedAt,
          book: {
            id: bookData.id,
            title: bookData.title,
            author: bookData.author,
            cover: bookData.cover,
            fileType: bookData.fileType
          }
        });
      }
    }
    
    return loans;
  } catch (error) {
    console.error('Error getting user loans:', error);
    throw error;
  }
};

// Create a new loan
export const createLoan = async (userId: string, bookId: string, durationDays = 14) => {
  try {
    // Check if book is available
    const bookRef = doc(db, 'books', bookId);
    const bookDoc = await getDoc(bookRef);
    
    if (!bookDoc.exists()) {
      throw new Error('Book not found');
    }
    
    const bookData = bookDoc.data();
    if (bookData.status !== BookStatus.AVAILABLE) {
      throw new Error('Book is not available for loan');
    }
    
    // Check if user already has an active loan for this book
    const loansRef = collection(db, 'loans');
    const q = query(
      loansRef,
      where('userId', '==', userId),
      where('bookId', '==', bookId),
      where('status', '==', LoanStatus.ACTIVE)
    );
    
    const existingLoanSnapshot = await getDocs(q);
    if (!existingLoanSnapshot.empty) {
      throw new Error('You already have an active loan for this book');
    }
    
    // Calculate end time
    const startTime = new Date();
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + durationDays);
    
    // Create new loan
    const newLoan = {
      userId,
      bookId,
      startTime: serverTimestamp(),
      endTime: serverTimestamp(), // Will be updated with correct end time
      status: LoanStatus.ACTIVE,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const loanDoc = await addDoc(collection(db, 'loans'), newLoan);
    
    // Update end time with correct date
    await updateDoc(doc(db, 'loans', loanDoc.id), {
      endTime: endTime
    });
    
    // Update book status
    await updateDoc(bookRef, {
      status: BookStatus.BORROWED,
      updatedAt: serverTimestamp()
    });
    
    return {
      id: loanDoc.id,
      userId,
      bookId,
      startTime,
      endTime,
      status: LoanStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error creating loan:', error);
    throw error;
  }
};

// Return a book
export const returnBook = async (loanId: string) => {
  try {
    const loanRef = doc(db, 'loans', loanId);
    const loanDoc = await getDoc(loanRef);
    
    if (!loanDoc.exists()) {
      throw new Error('Loan not found');
    }
    
    const loanData = loanDoc.data() as LoanData;
    
    if (loanData.status !== LoanStatus.ACTIVE) {
      throw new Error('This book has already been returned');
    }
    
    // Update loan status
    await updateDoc(loanRef, {
      status: LoanStatus.RETURNED,
      updatedAt: serverTimestamp()
    });
    
    // Update book status
    const bookRef = doc(db, 'books', loanData.bookId);
    await updateDoc(bookRef, {
      status: BookStatus.AVAILABLE,
      updatedAt: serverTimestamp()
    });
    
    return {
      id: loanDoc.id,
      status: LoanStatus.RETURNED
    };
  } catch (error) {
    console.error('Error returning book:', error);
    throw error;
  }
};
