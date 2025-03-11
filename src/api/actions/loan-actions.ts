
import { PrismaClient } from '@prisma/client';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { toast } from '@/components/ui/use-toast';

const prisma = new PrismaClient();

// Borrow a book
export const borrowBook = async (userId: string, bookId: string) => {
  try {
    // Check if book is available
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
    
    if (bookData.status !== 'AVAILABLE') {
      toast({
        title: "Erro ao emprestar livro",
        description: "Este livro não está disponível para empréstimo",
        variant: "destructive",
      });
      throw new Error('Book is not available');
    }
    
    // Check if user has active loans
    const userLoansRef = collection(db, 'loans');
    const userLoansQuery = query(
      userLoansRef,
      where('userId', '==', userId),
      where('status', '==', 'ACTIVE')
    );
    
    const userLoansSnapshot = await getDocs(userLoansQuery);
    
    // Check user plan and loan limits
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
    const isPremium = userData.plan === 'PREMIUM';
    
    if (!isPremium && userLoansSnapshot.size >= 2) {
      toast({
        title: "Limite de empréstimos atingido",
        description: "Usuários gratuitos podem emprestar até 2 livros simultaneamente. Faça upgrade para o plano premium!",
        variant: "destructive",
      });
      throw new Error('Loan limit reached');
    }
    
    // Create loan in Firebase
    const loanData = {
      userId,
      bookId,
      startTime: serverTimestamp(),
      endTime: null,
      status: 'ACTIVE',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const loanRef = await addDoc(collection(db, 'loans'), loanData);
    
    // Create loan in Postgres
    const newLoan = await prisma.loan.create({
      data: {
        id: loanRef.id,
        userId,
        bookId,
        status: 'ACTIVE'
      }
    });
    
    // Update book status
    await updateDoc(doc(db, 'books', bookId), {
      status: 'BORROWED',
      updatedAt: serverTimestamp()
    });
    
    // Update book in Postgres
    await prisma.book.update({
      where: { id: bookId },
      data: {
        status: 'BORROWED',
        updatedAt: new Date()
      }
    });
    
    toast({
      title: "Livro emprestado",
      description: "O livro foi emprestado com sucesso",
    });
    
    return newLoan;
  } catch (error) {
    console.error('Error borrowing book:', error);
    throw error;
  }
};

// Return a book
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
    
    const loanData = loanDoc.data();
    
    if (loanData.status !== 'ACTIVE') {
      toast({
        title: "Erro ao devolver livro",
        description: "Este empréstimo já foi encerrado",
        variant: "destructive",
      });
      throw new Error('Loan is not active');
    }
    
    // Update loan in Firebase
    await updateDoc(doc(db, 'loans', loanId), {
      status: 'RETURNED',
      endTime: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Update loan in Postgres
    await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: 'RETURNED',
        endTime: new Date(),
        updatedAt: new Date()
      }
    });
    
    // Update book status
    await updateDoc(doc(db, 'books', loanData.bookId), {
      status: 'AVAILABLE',
      updatedAt: serverTimestamp()
    });
    
    // Update book in Postgres
    await prisma.book.update({
      where: { id: loanData.bookId },
      data: {
        status: 'AVAILABLE',
        updatedAt: new Date()
      }
    });
    
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
        status: 'ACTIVE'
      },
      include: {
        book: true
      }
    });
    
    if (loans.length > 0) {
      return loans;
    }
    
    // If not found in Postgres, try Firebase
    const loansRef = collection(db, 'loans');
    const loansQuery = query(
      loansRef,
      where('userId', '==', userId),
      where('status', '==', 'ACTIVE')
    );
    
    const loansSnapshot = await getDocs(loansQuery);
    
    // Fetch book details for each loan
    const loansWithBooks = await Promise.all(
      loansSnapshot.docs.map(async (loanDoc) => {
        const loanData = loanDoc.data();
        const bookDoc = await getDoc(doc(db, 'books', loanData.bookId));
        
        return {
          id: loanDoc.id,
          ...loanData,
          book: bookDoc.exists() ? { id: bookDoc.id, ...bookDoc.data() } : null
        };
      })
    );
    
    return loansWithBooks;
  } catch (error) {
    console.error('Error getting user loans:', error);
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
        status: {
          in: ['RETURNED', 'EXPIRED']
        }
      },
      include: {
        book: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    if (loans.length > 0) {
      return loans;
    }
    
    // If not found in Postgres, try Firebase
    const loansRef = collection(db, 'loans');
    const loansQuery = query(
      loansRef,
      where('userId', '==', userId),
      where('status', 'in', ['RETURNED', 'EXPIRED'])
    );
    
    const loansSnapshot = await getDocs(loansQuery);
    
    // Fetch book details for each loan
    const loansWithBooks = await Promise.all(
      loansSnapshot.docs.map(async (loanDoc) => {
        const loanData = loanDoc.data();
        const bookDoc = await getDoc(doc(db, 'books', loanData.bookId));
        
        return {
          id: loanDoc.id,
          ...loanData,
          book: bookDoc.exists() ? { id: bookDoc.id, ...bookDoc.data() } : null
        };
      })
    );
    
    // Sort by updated time descending
    return loansWithBooks.sort((a, b) => {
      const aTime = a.updatedAt?.toDate?.() || new Date();
      const bTime = b.updatedAt?.toDate?.() || new Date();
      return bTime.getTime() - aTime.getTime();
    });
  } catch (error) {
    console.error('Error getting user loan history:', error);
    throw error;
  }
};
