
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, BookOpen, User, LogOut } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navLinks = [
    { name: "Início", href: "/" },
    { name: "Biblioteca", href: "/biblioteca" },
    { name: "Preços", href: "/precos" },
    { name: "Sobre", href: "/sobre" },
  ];

  const authLinks = currentUser ? [
    { name: "Dashboard", href: "/dashboard" },
    ...(isAdmin ? [{ name: "Admin", href: "/admin/books" }] : []),
  ] : [];

  const allNavLinks = [...navLinks, ...authLinks];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-8",
        scrolled
          ? "bg-white/80 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2 text-primary font-semibold text-lg"
        >
          <BookOpen className="h-6 w-6" />
          <span className="font-heading">Leitura Livre</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {allNavLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "text-sm transition-colors duration-200 link-hover",
                location.pathname === link.href
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                {currentUser.displayName || currentUser.email}
              </div>
              <CustomButton
                variant="ghost"
                size="sm"
                className="text-sm font-normal"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </CustomButton>
            </div>
          ) : (
            <>
              <Link to="/login">
                <CustomButton
                  variant="ghost"
                  size="sm"
                  className="text-sm font-normal"
                >
                  Entrar
                </CustomButton>
              </Link>
              <Link to="/signup">
                <CustomButton
                  size="sm"
                  className="text-sm"
                >
                  Registrar
                </CustomButton>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-slide-in py-5">
          <div className="flex flex-col space-y-3 px-5">
            {allNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "py-2 px-3 rounded-md transition-colors",
                  location.pathname === link.href
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-slate-50"
                )}
              >
                {link.name}
              </Link>
            ))}
            <hr className="my-1" />
            {currentUser ? (
              <>
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {currentUser.displayName || currentUser.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-50 rounded-md text-left"
                >
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-50 rounded-md"
                >
                  <User size={18} />
                  <span>Entrar</span>
                </Link>
                <Link to="/signup">
                  <CustomButton className="mt-2 w-full">Registrar</CustomButton>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
