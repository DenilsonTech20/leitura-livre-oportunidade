
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { BookOpen, Users, FileText, Clock } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color }: { 
  title: string; 
  value: string | number; 
  icon: React.ElementType;
  color: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} mr-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeLoans: 0,
    freeUsers: 0,
    premiumUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Get users count
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        const totalUsers = usersSnapshot.size;
        
        // Count free and premium users
        let freeUsers = 0;
        let premiumUsers = 0;
        
        usersSnapshot.forEach(doc => {
          const userData = doc.data();
          if (userData.plan === 'PREMIUM') {
            premiumUsers++;
          } else {
            freeUsers++;
          }
        });
        
        // Get books count
        const booksRef = collection(db, 'books');
        const booksSnapshot = await getDocs(booksRef);
        const totalBooks = booksSnapshot.size;
        
        // Get active loans count
        const loansRef = collection(db, 'loans');
        const activeLoansQuery = query(loansRef, where('status', '==', 'ACTIVE'));
        const activeLoansSnapshot = await getDocs(activeLoansQuery);
        const activeLoans = activeLoansSnapshot.size;
        
        setStats({
          totalUsers,
          totalBooks,
          activeLoans,
          freeUsers,
          premiumUsers
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard 
                title="Total Users" 
                value={stats.totalUsers} 
                icon={Users}
                color="bg-blue-500"
              />
              <StatsCard 
                title="Total Books" 
                value={stats.totalBooks} 
                icon={BookOpen}
                color="bg-green-500"
              />
              <StatsCard 
                title="Active Loans" 
                value={stats.activeLoans} 
                icon={FileText}
                color="bg-amber-500"
              />
              <StatsCard 
                title="Premium Users" 
                value={`${stats.premiumUsers} (${Math.round((stats.premiumUsers / (stats.totalUsers || 1)) * 100)}%)`} 
                icon={Clock}
                color="bg-purple-500"
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" asChild>
                  <a href="/admin/books">Manage Books</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/admin/users">Manage Users</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/admin/loans">View Loans</a>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
