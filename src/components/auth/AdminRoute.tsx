
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { currentUser, loading, isAdmin, adminLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Once we've confirmed the user is logged in but NOT an admin, redirect them
    if (!loading && !adminLoading && currentUser && !isAdmin) {
      console.log('User is not an admin, redirecting to dashboard');
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar a área administrativa.",
        variant: "destructive"
      });
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, loading, isAdmin, adminLoading, navigate]);

  // Show loading spinner while checking auth and admin status
  if (loading || adminLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no user is authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is not an admin, the useEffect above will handle redirection,
  // but we include this as an immediate response as well
  if (!isAdmin) {
    console.log('Not admin, redirecting immediately');
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and is an admin, render children
  return <>{children}</>;
};

export default AdminRoute;
