import { PrismaClient } from '@prisma/client';
import { 
  db,
  updateDoc,
  doc,
  collection,
  query,
  getDocs,
  where,
  getDoc,
  Timestamp,
  serverTimestamp
} from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

const prisma = new PrismaClient();

// Get all loans (admin view)
export const getAllLoans = async () => {
  try {
    // Get from Postgres first
    const loans = await prisma.loan.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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
    const loansSnapshot = await getDocs(loansRef);
    
    // Fetch user and book details for each loan
    const loansWithDetails = await Promise.all(
      loansSnapshot.docs.map(async (loanDoc) => {
        const loanData = loanDoc.data();
        
        // Get book data
        const bookDoc = await getDoc(doc(db, 'books', loanData.bookId));
        const bookData = bookDoc.exists() ? { id: bookDoc.id, ...bookDoc.data() } : null;
        
        // Get user data
        const userDoc = await getDoc(doc(db, 'users', loanData.userId));
        const userData = userDoc.exists() ? { 
          id: userDoc.id, 
          name: userDoc.data().displayName, 
          email: userDoc.data().email 
        } : null;
        
        return {
          id: loanDoc.id,
          ...loanData,
          book: bookData,
          user: userData
        };
      })
    );
    
    // Sort by created time descending
    return loansWithDetails.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date();
      const bTime = b.createdAt?.toDate?.() || new Date();
      return bTime.getTime() - aTime.getTime();
    });
  } catch (error) {
    console.error('Error getting all loans:', error);
    throw error;
  }
};

// Get active loans (admin view)
export const getActiveLoans = async () => {
  try {
    // Get from Postgres first
    const loans = await prisma.loan.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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
    const loansQuery = query(
      loansRef,
      where('status', '==', 'ACTIVE')
    );
    
    const loansSnapshot = await getDocs(loansQuery);
    
    // Fetch user and book details for each loan
    const loansWithDetails = await Promise.all(
      loansSnapshot.docs.map(async (loanDoc) => {
        const loanData = loanDoc.data();
        
        // Get book data
        const bookDoc = await getDoc(doc(db, 'books', loanData.bookId));
        const bookData = bookDoc.exists() ? { id: bookDoc.id, ...bookDoc.data() } : null;
        
        // Get user data
        const userDoc = await getDoc(doc(db, 'users', loanData.userId));
        const userData = userDoc.exists() ? { 
          id: userDoc.id, 
          name: userDoc.data().displayName, 
          email: userDoc.data().email 
        } : null;
        
        return {
          id: loanDoc.id,
          ...loanData,
          book: bookData,
          user: userData
        };
      })
    );
    
    // Sort by created time descending
    return loansWithDetails.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date();
      const bTime = b.createdAt?.toDate?.() || new Date();
      return bTime.getTime() - aTime.getTime();
    });
  } catch (error) {
    console.error('Error getting active loans:', error);
    throw error;
  }
};

// Force return a book (admin only)
export const adminForceReturnBook = async (loanId: string) => {
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
      title: "Livro devolvido forçadamente",
      description: "O livro foi devolvido com sucesso pelo administrador",
    });
    
    return true;
  } catch (error) {
    console.error('Error force returning book:', error);
    throw error;
  }
};

// Mark loan as expired (admin only)
export const adminMarkLoanExpired = async (loanId: string) => {
  try {
    // Get loan data
    const loanDoc = await getDoc(doc(db, 'loans', loanId));
    
    if (!loanDoc.exists()) {
      toast({
        title: "Erro ao marcar empréstimo como expirado",
        description: "Empréstimo não encontrado",
        variant: "destructive",
      });
      throw new Error('Loan not found');
    }
    
    const loanData = loanDoc.data();
    
    if (loanData.status !== 'ACTIVE') {
      toast({
        title: "Erro ao marcar empréstimo como expirado",
        description: "Este empréstimo já foi encerrado",
        variant: "destructive",
      });
      throw new Error('Loan is not active');
    }
    
    // Update loan in Firebase
    await updateDoc(doc(db, 'loans', loanId), {
      status: 'EXPIRED',
      endTime: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Update loan in Postgres
    await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: 'EXPIRED',
        endTime: new Date(),
        updatedAt: new Date()
      }
    });
    
    // Optionally, update book status to AVAILABLE or keep it as BORROWED
    await updateDoc(doc(db, 'books', loanData.bookId), {
      status: 'UNAVAILABLE',
      updatedAt: serverTimestamp()
    });
    
    // Update book in Postgres
    await prisma.book.update({
      where: { id: loanData.bookId },
      data: {
        status: 'UNAVAILABLE',
        updatedAt: new Date()
      }
    });
    
    toast({
      title: "Empréstimo marcado como expirado",
      description: "O empréstimo foi marcado como expirado com sucesso",
    });
    
    return true;
  } catch (error) {
    console.error('Error marking loan as expired:', error);
    throw error;
  }
};
