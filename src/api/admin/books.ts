
import { PrismaClient } from '@prisma/client';
import { 
  createBook, 
  getAllBooks, 
  getBookById, 
  updateBook, 
  deleteBook 
} from '../actions/book-actions';

const prisma = new PrismaClient();

// Book management endpoints for admin

// Get all books (admin view)
export const getAdminBooksList = async () => {
  try {
    // First try from Postgres
    const booksFromDB = await prisma.book.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (booksFromDB.length > 0) {
      return booksFromDB;
    }
    
    // If not found in Postgres, get from Firebase
    return await getAllBooks();
  } catch (error) {
    console.error('Error getting admin books list:', error);
    throw error;
  }
};

// Add a new book (admin only)
export const addBook = async (bookData: {
  title: string;
  author: string;
  description?: string;
  coverFile: File;
  bookFile: File;
}) => {
  return await createBook(bookData);
};

// Update a book (admin only)
export const adminUpdateBook = async (bookId: string, bookData: {
  title?: string;
  author?: string;
  description?: string;
  coverFile?: File;
  bookFile?: File;
  status?: 'AVAILABLE' | 'BORROWED' | 'UNAVAILABLE';
}) => {
  return await updateBook(bookId, bookData);
};

// Delete a book (admin only)
export const adminDeleteBook = async (bookId: string) => {
  return await deleteBook(bookId);
};

// Get book details (admin view)
export const getAdminBookDetails = async (bookId: string) => {
  try {
    const book = await getBookById(bookId);
    
    if (!book) {
      throw new Error('Book not found');
    }
    
    // Get active loans for this book
    const activeLoans = await prisma.loan.findMany({
      where: {
        bookId,
        status: 'ACTIVE'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    return {
      ...book,
      activeLoans
    };
  } catch (error) {
    console.error('Error getting admin book details:', error);
    throw error;
  }
};
