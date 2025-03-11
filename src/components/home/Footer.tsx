
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';

const Footer = () => {
  const { currentUser, isAdmin } = useAuth();

  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-primary">Leitura Livre</h2>
            <p className="mt-2 text-gray-600">
              Sua biblioteca online gratuita. <br />
              Acesse livros onde e quando quiser.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0">
            {isAdmin && currentUser && (
              <div className="mb-4">
                <Button asChild variant="outline" className="flex items-center">
                  <Link to="/admin/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </Button>
              </div>
            )}
            
            <nav className="flex flex-wrap gap-6">
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/biblioteca" className="text-gray-600 hover:text-primary transition-colors">
                Biblioteca
              </Link>
              <Link to="/precos" className="text-gray-600 hover:text-primary transition-colors">
                Planos
              </Link>
              <Link to="/sobre" className="text-gray-600 hover:text-primary transition-colors">
                Sobre
              </Link>
              {isAdmin && (
                <Link to="/admin/dashboard" className="text-gray-600 hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Leitura Livre. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
