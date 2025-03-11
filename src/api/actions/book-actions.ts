
import { PrismaClient } from '@prisma/client';
import { db, storage, addBook as firebaseAddBook } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from '@/components/ui/use-toast';

const prisma = new PrismaClient();

// Create a new book in both Firebase and Postgres
export const createBook = async (bookData: {
  title: string;
  author: string;
  description?: string;
  coverFile: File;
  bookFile: File;
}) => {
  try {
    // Upload cover image to Firebase Storage
    const coverRef = ref(storage, `covers/${Date.now()}_${bookData.coverFile.name}`);
    await uploadBytes(coverRef, bookData.coverFile);
    const coverURL = await getDownloadURL(coverRef);
    
    // Upload book file to Firebase Storage
    const bookRef = ref(storage, `books/${Date.now()}_${bookData.bookFile.name}`);
    await uploadBytes(bookRef, bookData.bookFile);
    const bookURL = await getDownloadURL(bookRef);
    
    // Determine file type
    const fileExtension = bookData.bookFile.name.split('.').pop()?.toLowerCase();
    let fileType = 'OTHER';
    
    if (fileExtension === 'pdf') fileType = 'PDF';
    else if (fileExtension === 'docx') fileType = 'DOCX';
    else if (fileExtension === 'ppt' || fileExtension === 'pptx') fileType = 'PPT';
    else if (fileExtension === 'epub') fileType = 'EPUB';
    
    // Add to Firebase
    const firebaseBookId = await firebaseAddBook({
      title: bookData.title,
      author: bookData.author,
      description: bookData.description || '',
      cover: coverURL,
      filePath: bookURL,
      fileType,
      status: 'AVAILABLE'
    });
    
    // Add to Postgres
    const newBook = await prisma.book.create({
      data: {
        id: firebaseBookId,
        title: bookData.title,
        author: bookData.author,
        description: bookData.description || '',
        cover: coverURL,
        filePath: bookURL,
        fileType: fileType as any,
        status: 'AVAILABLE'
      }
    });
    
    toast({
      title: "Livro adicionado",
      description: "O livro foi adicionado com sucesso",
    });
    
    return newBook;
  } catch (error) {
    console.error('Error creating book:', error);
    toast({
      title: "Erro ao adicionar livro",
      description: "Tente novamente mais tarde",
      variant: "destructive",
    });
    throw error;
  }
};

// Get all books from Firebase
export const getAllBooks = async () => {
  try {
    const booksRef = collection(db, 'books');
    const querySnapshot = await getDocs(booksRef);
    
    const books = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return books;
  } catch (error) {
    console.error('Error getting books:', error);
    throw error;
  }
};

// Get book by ID
export const getBookById = async (bookId: string) => {
  try {
    // Try to get from Postgres first
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });
    
    if (book) return book;
    
    // If not found in Postgres, try Firebase
    const bookRef = doc(db, 'books', bookId);
    const bookDoc = await getDoc(bookRef);
    
    if (bookDoc.exists()) {
      return {
        id: bookDoc.id,
        ...bookDoc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting book:', error);
    throw error;
  }
};

// Update a book
export const updateBook = async (bookId: string, bookData: {
  title?: string;
  author?: string;
  description?: string;
  coverFile?: File;
  bookFile?: File;
  status?: 'AVAILABLE' | 'BORROWED' | 'UNAVAILABLE';
}) => {
  try {
    // Get current book data
    const bookRef = doc(db, 'books', bookId);
    const bookDoc = await getDoc(bookRef);
    
    if (!bookDoc.exists()) {
      throw new Error('Book not found');
    }
    
    const currentBook = bookDoc.data();
    const updateData: any = {};
    
    // Update basic fields
    if (bookData.title) updateData.title = bookData.title;
    if (bookData.author) updateData.author = bookData.author;
    if (bookData.description !== undefined) updateData.description = bookData.description;
    if (bookData.status) updateData.status = bookData.status;
    
    // Upload new cover if provided
    if (bookData.coverFile) {
      // Delete old cover if it exists
      if (currentBook.cover) {
        try {
          const oldCoverRef = ref(storage, currentBook.cover);
          await deleteObject(oldCoverRef);
        } catch (error) {
          console.error('Error deleting old cover:', error);
        }
      }
      
      // Upload new cover
      const coverRef = ref(storage, `covers/${Date.now()}_${bookData.coverFile.name}`);
      await uploadBytes(coverRef, bookData.coverFile);
      updateData.cover = await getDownloadURL(coverRef);
    }
    
    // Upload new book file if provided
    if (bookData.bookFile) {
      // Delete old file if it exists
      if (currentBook.filePath) {
        try {
          const oldFileRef = ref(storage, currentBook.filePath);
          await deleteObject(oldFileRef);
        } catch (error) {
          console.error('Error deleting old file:', error);
        }
      }
      
      // Upload new file
      const bookRef = ref(storage, `books/${Date.now()}_${bookData.bookFile.name}`);
      await uploadBytes(bookRef, bookData.bookFile);
      updateData.filePath = await getDownloadURL(bookRef);
      
      // Update file type
      const fileExtension = bookData.bookFile.name.split('.').pop()?.toLowerCase();
      let fileType = 'OTHER';
      
      if (fileExtension === 'pdf') fileType = 'PDF';
      else if (fileExtension === 'docx') fileType = 'DOCX';
      else if (fileExtension === 'ppt' || fileExtension === 'pptx') fileType = 'PPT';
      else if (fileExtension === 'epub') fileType = 'EPUB';
      
      updateData.fileType = fileType;
    }
    
    // Update in Firebase
    updateData.updatedAt = new Date();
    await updateDoc(bookRef, updateData);
    
    // Update in Postgres
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });
    
    toast({
      title: "Livro atualizado",
      description: "O livro foi atualizado com sucesso",
    });
    
    return updatedBook;
  } catch (error) {
    console.error('Error updating book:', error);
    toast({
      title: "Erro ao atualizar livro",
      description: "Tente novamente mais tarde",
      variant: "destructive",
    });
    throw error;
  }
};

// Delete a book
export const deleteBook = async (bookId: string) => {
  try {
    // Get current book data
    const bookRef = doc(db, 'books', bookId);
    const bookDoc = await getDoc(bookRef);
    
    if (!bookDoc.exists()) {
      throw new Error('Book not found');
    }
    
    const currentBook = bookDoc.data();
    
    // Delete files from storage
    if (currentBook.cover) {
      try {
        const coverRef = ref(storage, currentBook.cover);
        await deleteObject(coverRef);
      } catch (error) {
        console.error('Error deleting cover:', error);
      }
    }
    
    if (currentBook.filePath) {
      try {
        const fileRef = ref(storage, currentBook.filePath);
        await deleteObject(fileRef);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    
    // Delete from Firebase
    await deleteDoc(bookRef);
    
    // Delete from Postgres
    await prisma.book.delete({
      where: { id: bookId }
    });
    
    toast({
      title: "Livro excluído",
      description: "O livro foi excluído com sucesso",
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting book:', error);
    toast({
      title: "Erro ao excluir livro",
      description: "Tente novamente mais tarde",
      variant: "destructive",
    });
    throw error;
  }
};
