import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Clock, MoreHorizontal, Check, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { FileType, LoanStatus } from '@/types';

interface Loan {
  id: string;
  bookId: string;
  startTime: string;
  endTime: string | null;
  status: LoanStatus;
  book: {
    id: string;
    title: string;
    author: string;
    cover: string;
    fileType: FileType;
  };
}

const BorrowedBooks = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchLoans = async () => {
    try {
      setLoading(true);
      // This will be replaced with an actual API call
      // Mocking data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockLoans: Loan[] = [
        {
          id: '1',
          bookId: '101',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: LoanStatus.ACTIVE,
          book: {
            id: '101',
            title: 'O Alquimista',
            author: 'Paulo Coelho',
            cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            fileType: FileType.PDF
          }
        },
        {
          id: '2',
          bookId: '102',
          startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          status: LoanStatus.ACTIVE,
          book: {
            id: '102',
            title: 'Dom Casmurro',
            author: 'Machado de Assis',
            cover: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            fileType: FileType.EPUB
          }
        }
      ];
      
      setLoans(mockLoans);
      
    } catch (err) {
      console.error('Error fetching loans:', err);
      setError('Não foi possível carregar seus livros emprestados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleReadBook = (bookId: string) => {
    navigate(`/livro/${bookId}`);
  };

  const handleReturnBook = async (loanId: string, bookTitle: string) => {
    try {
      // This will be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: 'Livro devolvido com sucesso',
        description: `"${bookTitle}" foi devolvido.`,
      });
      
      // Update the local state to reflect the change
      setLoans(prev => 
        prev.map(loan => 
          loan.id === loanId 
            ? { ...loan, status: LoanStatus.RETURNED } 
            : loan
        )
      );
      
    } catch (err) {
      console.error('Error returning book:', err);
      toast({
        title: 'Erro ao devolver livro',
        description: 'Ocorreu um erro ao devolver o livro. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const getFileTypeIcon = (fileType: FileType) => {
    switch (fileType) {
      case FileType.PDF:
        return <FileText className="h-4 w-4 text-red-500" />;
      case FileType.DOCX:
        return <FileText className="h-4 w-4 text-blue-500" />;
      case FileType.PPT:
        return <FileText className="h-4 w-4 text-orange-500" />;
      case FileType.EPUB:
        return <BookOpen className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const calculateDaysLeft = (endTimeString: string | null) => {
    if (!endTimeString) return '∞';
    
    const endTime = new Date(endTimeString).getTime();
    const now = Date.now();
    const diffInDays = Math.ceil((endTime - now) / (1000 * 60 * 60 * 24));
    
    return diffInDays <= 0 ? 'Expirado' : `${diffInDays} dias`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchLoans}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Livros Emprestados</h1>
        <Button size="sm" variant="outline" onClick={fetchLoans}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {loans.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">Nenhum livro emprestado</h3>
          <p className="mt-2 text-gray-500">
            Visite a <Link to="/biblioteca" className="text-primary hover:underline">biblioteca</Link> para emprestar livros.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Livro</TableHead>
                <TableHead>Formato</TableHead>
                <TableHead>Data de Empréstimo</TableHead>
                <TableHead>Tempo Restante</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={loan.book.cover} 
                        alt={loan.book.title}
                        className="h-12 w-10 object-cover rounded"
                      />
                      <div>
                        <div className="font-medium">{loan.book.title}</div>
                        <div className="text-sm text-muted-foreground">{loan.book.author}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getFileTypeIcon(loan.book.fileType)}
                      <span className="ml-1.5">{loan.book.fileType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(loan.startTime).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 text-amber-500" />
                      {calculateDaysLeft(loan.endTime)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        loan.status === LoanStatus.ACTIVE
                          ? 'bg-green-100 text-green-800' 
                          : loan.status === LoanStatus.RETURNED
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {loan.status === LoanStatus.ACTIVE
                        ? 'Ativo' 
                        : loan.status === LoanStatus.RETURNED
                          ? 'Devolvido' 
                          : 'Expirado'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {loan.status === LoanStatus.ACTIVE ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleReadBook(loan.book.id)}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Ler agora
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReturnBook(loan.id, loan.book.title)}>
                            <Check className="h-4 w-4 mr-2" />
                            Devolver
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-sm text-gray-500">Indisponível</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BorrowedBooks;
