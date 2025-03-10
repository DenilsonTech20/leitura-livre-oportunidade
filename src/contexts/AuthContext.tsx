
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
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
        // Check admin status
        setAdminLoading(true);
        const adminStatus = await checkAdminStatus(user);
        setIsAdmin(adminStatus);
        setAdminLoading(false);
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
      toast({
        title: "Erro ao fazer login com Google",
        description: error.message || "Tente novamente mais tarde",
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
