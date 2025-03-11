
import { PrismaClient } from '@prisma/client';
import { 
  db, 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  Timestamp, 
  serverTimestamp, 
  query, 
  where, 
  getDocs 
} from '@/lib/firebase';
import { LoanStatus, BookStatus } from '@/types';
import { toast } from '@/components/ui/use-toast';

const prisma = new PrismaClient();

// Add type definitions to avoid errors
interface LoanData {
  id: string;
  userId: string;
  bookId: string;
  startTime: Date | any; // Handle Firebase Timestamp
  endTime?: Date | any | null;
  status: LoanStatus;
  book?: {
    id: string;
    title?: string;
    author?: string;
    cover?: string;
    status?: BookStatus;
  };
  user?: {
    id: string;
    name?: string;
    email?: string;
  };
  createdAt?: Date | any;
  updatedAt?: Date | any;
}

// Borrow a book
export const borrowBook = async (userId: string, bookId: string, durationInSeconds: number = 2700) => {
  try {
    // Check if the book is available
    const bookDoc = await getDoc(doc(db, 'books', bookId));
    
    if (!bookDoc.exists()) {
      toast({
        title: "Erro ao emprestar livro",
        description: "Livro não encontrado",
        variant: "destructive",
      });
      throw new Error('Book not found');
    }
    
    const bookData = bookDoc.data();
    
    if (bookData.status !== BookStatus.AVAILABLE) {
      toast({
        title: "Erro ao emprestar livro",
        description: "Este livro não está disponível para empréstimo",
        variant: "destructive",
      });
      throw new Error('Book is not available');
    }
    
    // Check if user has an active loan for this book
    const loansRef = collection(db, 'loans');
    const q = query(
      loansRef,
      where('userId', '==', userId),
      where('bookId', '==', bookId),
      where('status', '==', LoanStatus.ACTIVE)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      toast({
        title: "Erro ao emprestar livro",
        description: "Você já possui um empréstimo ativo para este livro",
        variant: "destructive",
      });
      throw new Error('User already has an active loan for this book');
    }
    
    // Get current user data to check plan and remaining time
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      toast({
        title: "Erro ao emprestar livro",
        description: "Usuário não encontrado",
        variant: "destructive",
      });
      throw new Error('User not found');
    }
    
    const userData = userDoc.data();
    
    if (userData.plan !== 'PREMIUM' && userData.remainingTime <= 0) {
      toast({
        title: "Tempo esgotado",
        description: "Você não possui tempo restante para empréstimos. Faça upgrade para o plano premium ou aguarde a renovação do seu tempo.",
        variant: "destructive",
      });
      throw new Error('User has no remaining time for loans');
    }
    
    // Calculate loan duration based on plan
    const loanDuration = userData.plan === 'PREMIUM' ? 604800 : durationInSeconds; // 7 days for premium, or specified duration
    
    // Create a new loan in Firebase
    const loanData = {
      userId,
      bookId,
      startTime: serverTimestamp(),
      status: LoanStatus.ACTIVE,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const loanRef = await addDoc(collection(db, 'loans'), loanData);
    
    // Update book status
    await updateDoc(doc(db, 'books', bookId), {
      status: BookStatus.BORROWED,
      updatedAt: serverTimestamp()
    });
    
    // Update user's remaining time if they're on the free plan
    if (userData.plan !== 'PREMIUM') {
      const newRemainingTime = Math.max(0, userData.remainingTime - durationInSeconds);
      await updateDoc(doc(db, 'users', userId), {
        remainingTime: newRemainingTime,
        updatedAt: serverTimestamp()
      });
    }
    
    // Try to create in Postgres too
    try {
      await prisma.loan.create({
        data: {
          id: loanRef.id,
          userId,
          bookId,
          startTime: new Date(),
          status: LoanStatus.ACTIVE,
        }
      });
      
      await prisma.book.update({
        where: { id: bookId },
        data: {
          status: BookStatus.BORROWED,
          updatedAt: new Date()
        }
      });
      
      if (userData.plan !== 'PREMIUM') {
        await prisma.user.update({
          where: { id: userId },
          data: {
            remainingTime: Math.max(0, userData.remainingTime - durationInSeconds),
            updatedAt: new Date()
          }
        });
      }
    } catch (dbError) {
      console.error('Error creating loan in Postgres:', dbError);
      // Continue even if Postgres fails - we have the Firebase record
    }
    
    toast({
      title: "Livro emprestado",
      description: "Você agora pode ler este livro",
    });
    
    return {
      id: loanRef.id,
      ...loanData,
      book: {
        id: bookId,
        title: bookData.title,
        author: bookData.author,
        cover: bookData.cover
      }
    };
  } catch (error) {
    console.error('Error borrowing book:', error);
    throw error;
  }
};

// Return a borrowed book
export const returnBook = async (loanId: string) => {
  try {
    // Get loan data
    const loanDoc = await getDoc(doc(db, 'loans', loanId));
    
    if (!loanDoc.exists()) {
      toast({
        title: "Erro ao devolver livro",
        description: "Empréstimo não encontrado",
        variant: "destructive",
      });
      throw new Error('Loan not found');
    }
    
    const loanData = loanDoc.data() as LoanData;
    
    if (loanData.status !== LoanStatus.ACTIVE) {
      toast({
        title: "Erro ao devolver livro",
        description: "Este empréstimo já foi encerrado",
        variant: "destructive",
      });
      throw new Error('Loan is not active');
    }
    
    // Update loan in Firebase
    await updateDoc(doc(db, 'loans', loanId), {
      status: LoanStatus.RETURNED,
      endTime: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Update book status
    await updateDoc(doc(db, 'books', loanData.bookId), {
      status: BookStatus.AVAILABLE,
      updatedAt: serverTimestamp()
    });
    
    // Update in Postgres
    try {
      await prisma.loan.update({
        where: { id: loanId },
        data: {
          status: LoanStatus.RETURNED,
          endTime: new Date(),
          updatedAt: new Date()
        }
      });
      
      await prisma.book.update({
        where: { id: loanData.bookId },
        data: {
          status: BookStatus.AVAILABLE,
          updatedAt: new Date()
        }
      });
    } catch (dbError) {
      console.error('Error updating loan in Postgres:', dbError);
      // Continue even if Postgres fails - we have the Firebase record
    }
    
    toast({
      title: "Livro devolvido",
      description: "O livro foi devolvido com sucesso",
    });
    
    return true;
  } catch (error) {
    console.error('Error returning book:', error);
    throw error;
  }
};

// Get user's active loans
export const getUserActiveLoans = async (userId: string) => {
  try {
    // Get from Postgres first
    const loans = await prisma.loan.findMany({
      where: {
        userId,
        status: LoanStatus.ACTIVE
      },
      include: {
        book: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (loans.length > 0) {
      return loans;
    }
    
    // If not found in Postgres, try Firebase
    const loansRef = collection(db, 'loans');
    const q = query(
      loansRef,
      where('userId', '==', userId),
      where('status', '==', LoanStatus.ACTIVE)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Fetch book details for each loan
    const loansWithBookDetails: LoanData[] = await Promise.all(
      querySnapshot.docs.map(async (loanDoc) => {
        const loanData = loanDoc.data() as LoanData;
        
        // Get book data
        const bookDoc = await getDoc(doc(db, 'books', loanData.bookId));
        const bookData = bookDoc.exists() ? { id: bookDoc.id, ...bookDoc.data() } : { id: loanData.bookId };
        
        return {
          id: loanDoc.id,
          ...loanData,
          book: bookData
        };
      })
    );
    
    // Sort by created time descending
    return loansWithBookDetails.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date();
      const bTime = b.createdAt?.toDate?.() || new Date();
      return bTime.getTime() - aTime.getTime();
    });
  } catch (error) {
    console.error('Error getting user active loans:', error);
    throw error;
  }
};

// Get user's loan history
export const getUserLoanHistory = async (userId: string) => {
  try {
    // Get from Postgres first
    const loans = await prisma.loan.findMany({
      where: {
        userId,
      },
      include: {
        book: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (loans.length > 0) {
      return loans;
    }
    
    // If not found in Postgres, try Firebase
    const loansRef = collection(db, 'loans');
    const q = query(
      loansRef,
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Fetch book details for each loan
    const loansWithBookDetails: LoanData[] = await Promise.all(
      querySnapshot.docs.map(async (loanDoc) => {
        const loanData = loanDoc.data() as LoanData;
        
        // Get book data
        const bookDoc = await getDoc(doc(db, 'books', loanData.bookId));
        const bookData = bookDoc.exists() ? { id: bookDoc.id, ...bookDoc.data() } : { id: loanData.bookId };
        
        return {
          id: loanDoc.id,
          ...loanData,
          book: bookData,
          updatedAt: loanData.updatedAt || loanData.createdAt // Ensure updatedAt exists
        };
      })
    );
    
    // Sort by updated time descending
    return loansWithBookDetails.sort((a, b) => {
      const aTime = a.updatedAt?.toDate?.() || new Date();
      const bTime = b.updatedAt?.toDate?.() || new Date();
      return bTime.getTime() - aTime.getTime();
    });
  } catch (error) {
    console.error('Error getting user loan history:', error);
    throw error;
  }
};
