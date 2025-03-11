
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  sendEmailVerification
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
  isEmailVerified: boolean;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  loginWithGoogle: () => Promise<FirebaseUser>;
  signup: (email: string, password: string, name: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
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
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed, user:", user?.email);
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
        // Set email verification status
        setIsEmailVerified(user.emailVerified);
        
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
        setIsEmailVerified(false);
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
      } else if (error.code === 'auth/user-disabled') {
        message = "Esta conta foi desativada. Contate o administrador.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Muitas tentativas de login. Tente novamente mais tarde.";
      }
      
      console.error("Login error:", error.code, error.message);
      
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
      // Add current domain to google provider
      const currentDomain = window.location.origin;
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      
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
      } else if (error.code === 'auth/unauthorized-domain') {
        message = "Este domínio não está autorizado para operações OAuth. Contate o administrador.";
        console.error("Unauthorized domain. Current domain:", window.location.origin);
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "O login com Google não está habilitado. Contate o administrador.";
      }
      
      console.error("Google login error:", error.code, error.message);
      
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
      
      // Send email verification
      await sendEmailVerification(response.user);
      
      // Update user profile with name
      await createUserDocument(response.user, { displayName: name });
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Um email de verificação foi enviado para sua caixa de entrada.",
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
      } else if (error.code === 'auth/invalid-email') {
        message = "Email inválido. Verifique o formato do email.";
      }
      
      console.error("Signup error:", error.code, error.message);
      
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

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      let message = "Erro ao enviar o email de redefinição";
      
      if (error.code === 'auth/user-not-found') {
        message = "Não há usuário registrado com este email.";
      } else if (error.code === 'auth/invalid-email') {
        message = "Email inválido. Verifique o formato do email.";
      }
      
      toast({
        title: "Erro ao enviar email",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    try {
      if (currentUser && !currentUser.emailVerified) {
        await sendEmailVerification(currentUser);
        toast({
          title: "Email de verificação enviado",
          description: "Verifique sua caixa de entrada para ativar sua conta.",
        });
      } else {
        toast({
          title: "Erro ao enviar email",
          description: "Você precisa estar logado e seu email não deve estar verificado.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar email de verificação",
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
    isEmailVerified,
    login,
    loginWithGoogle,
    signup,
    logout,
    sendPasswordResetEmail,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
