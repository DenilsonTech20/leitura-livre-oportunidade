import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { collection, getDocs } from 'firebase/firestore';

// Define types locally to avoid importing from @/types
// This resolves the TypeScript errors
type Role = 'USER' | 'ADMIN';
type Plan = 'FREE' | 'PREMIUM';
type BookStatus = 'AVAILABLE' | 'BORROWED' | 'UNAVAILABLE';
type FileType = 'PDF' | 'DOCX' | 'PPT' | 'EPUB' | 'OTHER';
type LoanStatus = 'ACTIVE' | 'RETURNED' | 'EXPIRED';

// Detect if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Import prisma safely - without causing browser issues
// This avoids direct imports that would be processed by bundlers
let prisma = null;
if (!isBrowser) {
  // Only import in Node.js environment
  import('@/lib/prisma').then(module => {
    prisma = module.default;
  }).catch(err => {
    console.error('Failed to import Prisma:', err);
  });
}

// Sync all users from Firebase to PostgreSQL
export const syncAllUsers = async () => {
  // For browser environments, use API route instead of direct Prisma access
  if (isBrowser) {
    console.log("Executing user sync via API in browser environment");
    try {
      const response = await fetch('/api/sync/users', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync users with database');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error syncing users:", error);
      toast({
        title: "Sync Failed",
        description: "Unable to sync users with database",
        variant: "destructive"
      });
      throw error;
    }
  }
  
  // Original server-side code
  try {
    console.log("Starting user sync process on server");
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    
    const results = {
      total: querySnapshot.size,
      success: 0,
      failed: 0
    };
    
    for (const userDoc of querySnapshot.docs) {
      const userData = userDoc.data();
      try {
        // Create or update user in PostgreSQL
        await prisma.user.upsert({
          where: { id: userDoc.id },
          update: {
            email: userData.email,
            name: userData.displayName || undefined,
            role: (userData.role as Role) || undefined,
            plan: (userData.plan as Plan) || undefined,
            remainingTime: userData.remainingTime || undefined,
            updatedAt: new Date()
          },
          create: {
            id: userDoc.id,
            email: userData.email,
            name: userData.displayName || 'User',
            password: '', // We don't store passwords in PostgreSQL as we use Firebase Auth
            role: (userData.role as Role) || 'USER',
            plan: (userData.plan as Plan) || 'FREE',
            remainingTime: userData.remainingTime || 2700
          }
        });
        
        results.success++;
      } catch (error) {
        console.error(`Failed to sync user ${userDoc.id}:`, error);
        results.failed++;
      }
    }
    
    console.log("User sync completed:", results);
    return results;
  } catch (error) {
    console.error("Error syncing users:", error);
    throw error;
  }
};

// Sync all books from Firebase to PostgreSQL
export const syncAllBooks = async () => {
  // For browser environments, use API route instead of direct Prisma access
  if (isBrowser) {
    console.log("Executing book sync via API in browser environment");
    try {
      const response = await fetch('/api/sync/books', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync books with database');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error syncing books:", error);
      toast({
        title: "Sync Failed",
        description: "Unable to sync books with database",
        variant: "destructive"
      });
      throw error;
    }
  }
  
  // Original server-side code
  try {
    console.log("Starting book sync process on server");
    const booksRef = collection(db, 'books');
    const querySnapshot = await getDocs(booksRef);
    
    const results = {
      total: querySnapshot.size,
      success: 0,
      failed: 0
    };
    
    for (const bookDoc of querySnapshot.docs) {
      const bookData = bookDoc.data();
      try {
        // Create or update book in PostgreSQL
        await prisma.book.upsert({
          where: { id: bookDoc.id },
          update: {
            title: bookData.title,
            author: bookData.author,
            description: bookData.description || undefined,
            cover: bookData.cover || '',
            filePath: bookData.filePath,
            fileType: (bookData.fileType as FileType) || 'PDF',
            status: (bookData.status as BookStatus) || 'AVAILABLE',
            updatedAt: new Date()
          },
          create: {
            id: bookDoc.id,
            title: bookData.title,
            author: bookData.author,
            description: bookData.description || '',
            cover: bookData.cover || '',
            filePath: bookData.filePath,
            fileType: (bookData.fileType as FileType) || 'PDF',
            status: (bookData.status as BookStatus) || 'AVAILABLE'
          }
        });
        
        results.success++;
      } catch (error) {
        console.error(`Failed to sync book ${bookDoc.id}:`, error);
        results.failed++;
      }
    }
    
    console.log("Book sync completed:", results);
    return results;
  } catch (error) {
    console.error("Error syncing books:", error);
    throw error;
  }
};

// Sync all loans from Firebase to PostgreSQL
export const syncAllLoans = async () => {
  // For browser environments, use API route instead of direct Prisma access
  if (isBrowser) {
    console.log("Executing loan sync via API in browser environment");
    try {
      const response = await fetch('/api/sync/loans', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync loans with database');
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error syncing loans:", error);
      toast({
        title: "Sync Failed",
        description: "Unable to sync loans with database",
        variant: "destructive"
      });
      throw error;
    }
  }
  
  // Original server-side code
  try {
    console.log("Starting loan sync process on server");
    const loansRef = collection(db, 'loans');
    const querySnapshot = await getDocs(loansRef);
    
    const results = {
      total: querySnapshot.size,
      success: 0,
      failed: 0
    };
    
    for (const loanDoc of querySnapshot.docs) {
      const loanData = loanDoc.data();
      try {
        // Create or update loan in PostgreSQL
        await prisma.loan.upsert({
          where: { id: loanDoc.id },
          update: {
            userId: loanData.userId,
            bookId: loanData.bookId,
            startTime: loanData.startTime.toDate(),
            endTime: loanData.endTime ? loanData.endTime.toDate() : null,
            status: (loanData.status as LoanStatus) || 'ACTIVE',
            updatedAt: new Date()
          },
          create: {
            id: loanDoc.id,
            userId: loanData.userId,
            bookId: loanData.bookId,
            startTime: loanData.startTime.toDate(),
            endTime: loanData.endTime ? loanData.endTime.toDate() : null,
            status: (loanData.status as LoanStatus) || 'ACTIVE'
          }
        });
        
        results.success++;
      } catch (error) {
        console.error(`Failed to sync loan ${loanDoc.id}:`, error);
        results.failed++;
      }
    }
    
    console.log("Loan sync completed:", results);
    return results;
  } catch (error) {
    console.error("Error syncing loans:", error);
    throw error;
  }
};

// Function to sync everything
export const syncAllData = async () => {
  // For browser environments, use API route instead of direct Prisma access
  if (isBrowser) {
    console.log("Executing full sync via API in browser environment");
    try {
      const response = await fetch('/api/sync/all', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync all data with database');
      }
      
      toast({
        title: "Sincronização Concluída",
        description: "Dados sincronizados com sucesso"
      });
      
      return await response.json();
    } catch (error: any) {
      console.error("Sync error:", error);
      toast({
        title: "Erro na sincronização",
        description: error.message || "Ocorreu um erro durante a sincronização",
        variant: "destructive"
      });
      throw error;
    }
  }
  
  // Original server-side code
  try {
    toast({
      title: "Sincronização iniciada",
      description: "Sincronizando dados do Firebase com o PostgreSQL..."
    });
    
    const userResults = await syncAllUsers();
    const bookResults = await syncAllBooks();
    const loanResults = await syncAllLoans();
    
    toast({
      title: "Sincronização concluída",
      description: `Usuários: ${userResults.success}/${userResults.total}, Livros: ${bookResults.success}/${bookResults.total}, Empréstimos: ${loanResults.success}/${loanResults.total}`
    });
    
    return {
      users: userResults,
      books: bookResults,
      loans: loanResults
    };
  } catch (error: any) {
    console.error("Sync error:", error);
    toast({
      title: "Erro na sincronização",
      description: error.message || "Ocorreu um erro durante a sincronização",
      variant: "destructive"
    });
    throw error;
  }
};
