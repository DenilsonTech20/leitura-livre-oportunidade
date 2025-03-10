
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import Index from "./pages/Index";
import Biblioteca from "./pages/Biblioteca";
import Precos from "./pages/Precos";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import BorrowedBooks from "./pages/dashboard/BorrowedBooks";
import History from "./pages/dashboard/History";
import Settings from "./pages/dashboard/Settings";
import Sobre from "./pages/Sobre";
import ReadBook from "./pages/book/ReadBook";
import Subscription from "./pages/account/Subscription";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminLoans from "./pages/admin/AdminLoans";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";
import { useEffect } from "react";
import { createAdminUser } from "./lib/firebase";

const queryClient = new QueryClient();

const App = () => {
  // Create admin user on app initialization
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        await createAdminUser("denilsonvines@gmail.com", "Admin0123");
      } catch (error) {
        console.error("Error creating admin user:", error);
      }
    };

    initializeAdmin();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/biblioteca" element={<Biblioteca />} />
                <Route path="/precos" element={<Precos />} />
                <Route path="/sobre" element={<Sobre />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Dashboard Routes - Protected */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/dashboard/emprestados" element={<PrivateRoute><BorrowedBooks /></PrivateRoute>} />
                <Route path="/dashboard/historico" element={<PrivateRoute><History /></PrivateRoute>} />
                <Route path="/dashboard/configuracoes" element={<PrivateRoute><Settings /></PrivateRoute>} />
                
                {/* Book Reader - Protected */}
                <Route path="/livro/:bookId" element={<PrivateRoute><ReadBook /></PrivateRoute>} />
                
                {/* Account Management - Protected */}
                <Route path="/account/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
                
                {/* Admin Routes - Protected and Admin Only */}
                <Route path="/admin" element={<AdminRoute><Navigate to="/admin/dashboard" replace /></AdminRoute>} />
                <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/books" element={<AdminRoute><AdminBooks /></AdminRoute>} />
                <Route path="/admin/loans" element={<AdminRoute><AdminLoans /></AdminRoute>} />
                
                {/* Catch-all Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
