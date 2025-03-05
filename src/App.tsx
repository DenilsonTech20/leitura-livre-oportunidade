
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

// For a real app, we'd have user context/provider here
// and store auth state, subscription info, etc.

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/emprestados" element={<BorrowedBooks />} />
          <Route path="/dashboard/historico" element={<History />} />
          <Route path="/dashboard/configuracoes" element={<Settings />} />
          
          {/* Book Reader */}
          <Route path="/livro/:bookId" element={<ReadBook />} />
          
          {/* Account Management */}
          <Route path="/account/subscription" element={<Subscription />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
