
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomButton } from '@/components/ui/custom-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Would handle login logic here
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md border shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-heading font-bold">Entrar</CardTitle>
        <CardDescription>
          Entre com seu e-mail e senha para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                placeholder="seu@email.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <CustomButton className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </CustomButton>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t p-6">
        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Criar conta
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Would handle signup logic here
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md border shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-heading font-bold">Criar Conta</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para se registrar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Seu nome completo"
                type="text"
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                placeholder="seu@email.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                className="pl-10 pr-10"
                required
              />
            </div>
          </div>

          <CustomButton className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Criar Conta"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </CustomButton>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t p-6">
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Entrar
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <Card className={cn(
      "w-full max-w-md border shadow-md transition-all duration-300",
      submitted ? "bg-primary/5" : ""
    )}>
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-heading font-bold">
          {submitted ? "Email Enviado" : "Recuperar Senha"}
        </CardTitle>
        <CardDescription>
          {submitted 
            ? "Verifique seu email para resetar sua senha"
            : "Digite seu email para receber o link de recuperação"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground mb-6">
              Enviamos instruções para recuperar sua senha para o seu email. Por favor, verifique sua caixa de entrada.
            </p>
            <Link to="/login">
              <CustomButton variant="outline" className="mx-auto">
                Voltar para login
              </CustomButton>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="seu@email.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <CustomButton className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
            </CustomButton>
          </form>
        )}
      </CardContent>
      {!submitted && (
        <CardFooter className="flex justify-center border-t p-6">
          <p className="text-center text-sm text-muted-foreground">
            Lembrou sua senha?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Voltar para login
            </Link>
          </p>
        </CardFooter>
      )}
    </Card>
  );
};
