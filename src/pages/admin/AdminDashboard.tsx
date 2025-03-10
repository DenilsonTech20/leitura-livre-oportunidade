
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { 
  BookOpen, 
  Users, 
  Clock, 
  BarChart as BarChartIcon, 
  RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { collection, getDocs, query, orderBy, limit, where, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeLoans: 0,
    totalLoans: 0
  });
  const [topBorrowedBooks, setTopBorrowedBooks] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [userPlans, setUserPlans] = useState([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch basic stats
      const booksCollection = collection(db, 'books');
      const usersCollection = collection(db, 'users');
      const loansCollection = collection(db, 'loans');
      
      const booksSnapshot = await getCountFromServer(booksCollection);
      const usersSnapshot = await getCountFromServer(usersCollection);
      const allLoansSnapshot = await getCountFromServer(loansCollection);
      const activeLoansSnapshot = await getCountFromServer(
        query(loansCollection, where('status', '==', 'ACTIVE'))
      );
      
      setStats({
        totalBooks: booksSnapshot.data().count,
        totalUsers: usersSnapshot.data().count,
        activeLoans: activeLoansSnapshot.data().count,
        totalLoans: allLoansSnapshot.data().count
      });
      
      // Fetch top borrowed books
      const topBooksQuery = query(
        collection(db, 'books'),
        orderBy('borrowCount', 'desc'),
        limit(5)
      );
      
      const topBooksSnapshot = await getDocs(topBooksQuery);
      const topBooks = topBooksSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().title,
        author: doc.data().author,
        count: doc.data().borrowCount || 0
      }));
      
      setTopBorrowedBooks(topBooks);
      
      // Fetch category distribution
      const categoriesSnapshot = await getDocs(collection(db, 'books'));
      const categories = categoriesSnapshot.docs.reduce((acc, doc) => {
        const fileType = doc.data().fileType || 'OTHER';
        const existingCategory = acc.find(item => item.name === fileType);
        
        if (existingCategory) {
          existingCategory.value += 1;
        } else {
          acc.push({ name: fileType, value: 1 });
        }
        
        return acc;
      }, []);
      
      setCategoryDistribution(categories);
      
      // Fetch user plans
      const usersData = await getDocs(collection(db, 'users'));
      const plans = usersData.docs.reduce((acc, doc) => {
        const plan = doc.data().plan || 'FREE';
        const existingPlan = acc.find(item => item.name === plan);
        
        if (existingPlan) {
          existingPlan.value += 1;
        } else {
          acc.push({ name: plan, value: 1 });
        }
        
        return acc;
      }, []);
      
      setUserPlans(plans);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel de Administração</h1>
        <Button onClick={fetchDashboardData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Livros</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">Livros em catálogo</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Contas registradas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Empréstimos Ativos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLoans}</div>
            <p className="text-xs text-muted-foreground">Empréstimos em andamento</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Empréstimos</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLoans}</div>
            <p className="text-xs text-muted-foreground">Desde o início</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Livros Mais Emprestados</CardTitle>
            <CardDescription>Top 5 livros por número de empréstimos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {topBorrowedBooks.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topBorrowedBooks}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${value} empréstimos`, 'Quantidade']} />
                    <Bar dataKey="count" fill="#8884d8" name="Empréstimos" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {loading ? 'Carregando...' : 'Sem dados para exibir'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Formato</CardTitle>
            <CardDescription>Tipos de arquivo de livros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {categoryDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} livros`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {loading ? 'Carregando...' : 'Sem dados para exibir'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Plan Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Planos</CardTitle>
          <CardDescription>Usuários por tipo de plano</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {userPlans.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userPlans}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userPlans.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} usuários`, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {loading ? 'Carregando...' : 'Sem dados para exibir'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
