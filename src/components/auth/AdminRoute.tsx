
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, loading, isAdmin, adminLoading, navigate]);

  if (loading || adminLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // This will be handled by the useEffect above, but we include it here as a fallback
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
