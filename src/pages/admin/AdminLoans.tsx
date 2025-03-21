
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import { Loan, LoanStatus } from '@/types';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { collection, getDocs, doc, updateDoc, query, orderBy, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

interface LoanWithRelations extends Loan {
  user: {
    id: string;
    name: string;
    email: string;
  };
  book: {
    id: string;
    title: string;
    author: string;
  };
}

const AdminLoans = () => {
  const [loans, setLoans] = useState<LoanWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get loans from Firestore instead of API
      const loansRef = collection(db, 'loans');
      const q = query(loansRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const loansData: LoanWithRelations[] = [];
      
      for (const loanDoc of querySnapshot.docs) {
        const loanData = loanDoc.data();
        
        // Get user data
        const userRef = doc(db, 'users', loanData.userId);
        const userDoc = await getDoc(userRef);
        
        // Get book data
        const bookRef = doc(db, 'books', loanData.bookId);
        const bookDoc = await getDoc(bookRef);
        
        if (userDoc.exists() && bookDoc.exists()) {
          const userData = userDoc.data();
          const bookData = bookDoc.data();
          
          loansData.push({
            id: loanDoc.id,
            userId: loanData.userId,
            bookId: loanData.bookId,
            startTime: loanData.startTime.toDate(),
            endTime: loanData.endTime ? loanData.endTime.toDate() : null,
            status: loanData.status,
            createdAt: loanData.createdAt.toDate(),
            updatedAt: loanData.updatedAt.toDate(),
            user: {
              id: userDoc.id,
              name: userData.displayName || 'Unknown User',
              email: userData.email || 'No email'
            },
            book: {
              id: bookDoc.id,
              title: bookData.title || 'Unknown Book',
              author: bookData.author || 'Unknown Author'
            }
          });
        }
      }
      
      setLoans(loansData);
    } catch (err) {
      console.error('Error loading loans:', err);
      setError('Error loading loans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleStatusChange = async (id: string, status: LoanStatus) => {
    try {
      const loanRef = doc(db, 'loans', id);
      
      await updateDoc(loanRef, {
        status,
        updatedAt: new Date()
      });
      
      toast({
        title: "Status updated",
        description: `Loan status has been updated to ${status.toLowerCase()}.`,
      });
      
      fetchLoans();
    } catch (err) {
      console.error('Error updating loan status:', err);
      setError('Failed to update loan status. Please try again.');
      
      toast({
        title: "Update failed",
        description: "Failed to update loan status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusLabel = (status: LoanStatus) => {
    const labels = {
      ACTIVE: 'Ativo',
      RETURNED: 'Devolvido',
      EXPIRED: 'Expirado'
    };
    return labels[status];
  };

  const getStatusBadgeClass = (status: LoanStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'RETURNED':
        return 'bg-blue-100 text-blue-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('pt-BR');
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Empréstimos</h1>
          <Button onClick={fetchLoans}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-md shadow">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Livro</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Data de início</TableHead>
                  <TableHead>Data de término</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Nenhum empréstimo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  loans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{loan.book.title}</div>
                          <div className="text-sm text-muted-foreground">{loan.book.author}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{loan.user.name}</div>
                          <div className="text-sm text-muted-foreground">{loan.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(loan.startTime)}</TableCell>
                      <TableCell>{formatDate(loan.endTime)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(loan.status)}`}>
                          {getStatusLabel(loan.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {loan.status === LoanStatus.ACTIVE && (
                              <DropdownMenuItem onClick={() => handleStatusChange(loan.id, LoanStatus.RETURNED)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Marcar como devolvido</span>
                              </DropdownMenuItem>
                            )}
                            {loan.status === LoanStatus.ACTIVE && (
                              <DropdownMenuItem onClick={() => handleStatusChange(loan.id, LoanStatus.EXPIRED)}>
                                <Clock className="mr-2 h-4 w-4" />
                                <span>Marcar como expirado</span>
                              </DropdownMenuItem>
                            )}
                            {loan.status !== LoanStatus.ACTIVE && (
                              <DropdownMenuItem onClick={() => handleStatusChange(loan.id, LoanStatus.ACTIVE)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                <span>Reativar empréstimo</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLoans;
