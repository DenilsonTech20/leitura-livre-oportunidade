
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import AddBookForm from '@/components/admin/AddBookForm';
import EditBookForm from '@/components/admin/EditBookForm';
import { Book, FileType, BookStatus } from '@/types';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';

const AdminBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const booksRef = collection(db, 'books');
      const querySnapshot = await getDocs(booksRef);
      
      const fetchedBooks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];
      
      setBooks(fetchedBooks);
      setError(null);
    } catch (err) {
      console.error('Error loading books:', err);
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (book: Book) => {
    if (!confirm(`Are you sure you want to delete "${book.title}"?`)) return;
    
    try {
      // Delete book document from Firestore
      await deleteDoc(doc(db, 'books', book.id));
      
      // Delete book file from Storage
      if (book.filePath) {
        const bookFileRef = ref(storage, book.filePath);
        await deleteObject(bookFileRef);
      }
      
      // Delete book cover from Storage if it exists
      if (book.cover && book.cover.startsWith('gs://')) {
        const coverImageRef = ref(storage, book.cover);
        await deleteObject(coverImageRef);
      }
      
      toast({
        title: 'Book deleted',
        description: `"${book.title}" has been deleted successfully.`,
      });
      
      // Refresh books list
      fetchBooks();
    } catch (err) {
      console.error('Error deleting book:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete book. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getFileTypeLabel = (type: FileType) => {
    const labels = {
      [FileType.PDF]: 'PDF',
      [FileType.DOCX]: 'Word',
      [FileType.PPT]: 'PowerPoint',
      [FileType.EPUB]: 'EPUB',
      [FileType.OTHER]: 'Other'
    };
    return labels[type];
  };

  const getStatusLabel = (status: BookStatus) => {
    const labels = {
      [BookStatus.AVAILABLE]: 'Available',
      [BookStatus.BORROWED]: 'Borrowed',
      [BookStatus.UNAVAILABLE]: 'Unavailable'
    };
    return labels[status];
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Books</h1>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={fetchBooks}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Book
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Book</DialogTitle>
                </DialogHeader>
                <AddBookForm onSuccess={() => {
                  setIsAddOpen(false);
                  fetchBooks();
                }} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-md shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No books found. Add your first book!
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <img 
                        src={book.cover || '/placeholder.svg'} 
                        alt={book.title}
                        className="h-12 w-10 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{getFileTypeLabel(book.fileType)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        book.status === BookStatus.AVAILABLE 
                          ? 'bg-green-100 text-green-800' 
                          : book.status === BookStatus.BORROWED 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {getStatusLabel(book.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {book.createdAt instanceof Date 
                        ? book.createdAt.toLocaleDateString() 
                        : book.createdAt 
                          ? new Date(book.createdAt).toLocaleDateString() 
                          : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingBook(book)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Book</DialogTitle>
                            </DialogHeader>
                            {editingBook && (
                              <EditBookForm 
                                book={editingBook} 
                                onSuccess={() => {
                                  setEditingBook(null);
                                  fetchBooks();
                                }} 
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDelete(book)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminBooks;
