
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup
} from 'firebase/auth';
import { 
  auth, 
  googleProvider, 
  createUserDocument, 
  checkAdminStatus 
} from '@/lib/firebase';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  adminLoading: boolean;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  loginWithGoogle: () => Promise<FirebaseUser>;
  signup: (email: string, password: string, name: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed, user:", user?.email);
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
        // Check admin status
        setAdminLoading(true);
        try {
          const adminStatus = await checkAdminStatus(user);
          console.log("Admin status for", user.email, ":", adminStatus);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } finally {
          setAdminLoading(false);
        }
      } else {
        setIsAdmin(false);
        setAdminLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Você está sendo redirecionado.",
      });
      return response.user;
    } catch (error: any) {
      let message = "Erro ao fazer login";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "Email ou senha incorretos";
      } else if (error.code === 'auth/configuration-not-found') {
        message = "Erro de configuração do Firebase. Contate o administrador.";
      } else if (error.code === 'auth/invalid-credential') {
        message = "Credenciais inválidas. Verifique seu email e senha.";
      }
      toast({
        title: "Erro ao fazer login",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      await createUserDocument(response.user);
      toast({
        title: "Login com Google realizado com sucesso!",
        description: "Você está sendo redirecionado.",
      });
      return response.user;
    } catch (error: any) {
      let message = "Erro ao fazer login com Google";
      if (error.code === 'auth/configuration-not-found') {
        message = "Erro de configuração do Firebase. Contate o administrador.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        message = "Processo de login cancelado pelo usuário.";
      }
      toast({
        title: "Erro ao fazer login com Google",
        description: message || "Tente novamente mais tarde",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with name
      await createUserDocument(response.user, { displayName: name });
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Você está sendo redirecionado.",
      });
      return response.user;
    } catch (error: any) {
      let message = "Erro ao criar conta";
      if (error.code === 'auth/email-already-in-use') {
        message = "Este email já está em uso";
      } else if (error.code === 'auth/configuration-not-found') {
        message = "Erro de configuração do Firebase. Contate o administrador.";
      } else if (error.code === 'auth/weak-password') {
        message = "A senha é muito fraca. Use pelo menos 6 caracteres.";
      }
      toast({
        title: "Erro ao criar conta",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logout realizado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    isAdmin,
    adminLoading,
    login,
    loginWithGoogle,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
