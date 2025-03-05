
import React, { useState } from "react";
import { Save, User, Mail, Lock, CreditCard, Bell, Shield } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  // User profile state
  const [name, setName] = useState("Maria Silva");
  const [email, setEmail] = useState("maria@example.com");
  const [phone, setPhone] = useState("(11) 98765-4321");
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loanReminders, setLoanReminders] = useState(true);
  const [newArrivals, setNewArrivals] = useState(false);
  const [promotions, setPromotions] = useState(true);
  
  // Payment info
  const [cardNumber, setCardNumber] = useState("**** **** **** 4242");
  const [cardExpiry, setCardExpiry] = useState("12/25");
  const [cardName, setCardName] = useState("Maria Silva");
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };
  
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro ao atualizar senha",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentPassword && newPassword && confirmPassword) {
      toast({
        title: "Senha atualizada!",
        description: "Sua senha foi atualizada com sucesso.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };
  
  const handleUpdateNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Preferências atualizadas!",
      description: "Suas preferências de notificação foram salvas.",
    });
  };
  
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="md:pl-64">
        <main className="py-6 px-4 sm:px-6 md:py-8 md:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Configurações da Conta</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gerencie suas informações pessoais, senha e preferências
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Profile Settings */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="mr-2 h-5 w-5 text-primary" />
                  Informações Pessoais
                </h2>
                
                <form onSubmit={handleUpdateProfile} className="mt-5 space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nome completo
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Telefone
                      </label>
                      <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <CustomButton type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar alterações
                    </CustomButton>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Password Settings */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-primary" />
                  Alterar Senha
                </h2>
                
                <form onSubmit={handleUpdatePassword} className="mt-5 space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                        Senha atual
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                        Nova senha
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                        Confirmar nova senha
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <CustomButton type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Atualizar senha
                    </CustomButton>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-primary" />
                  Métodos de Pagamento
                </h2>
                
                <div className="mt-5">
                  <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-blue-500 rounded w-10 h-6 flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{cardNumber}</p>
                          <p className="text-xs text-gray-500">Validade: {cardExpiry}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Principal
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex">
                    <CustomButton variant="outline" size="sm">
                      Adicionar cartão
                    </CustomButton>
                    <CustomButton variant="ghost" size="sm" className="ml-2">
                      Gerenciar cartões
                    </CustomButton>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notification Preferences */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-primary" />
                  Preferências de Notificação
                </h2>
                
                <form onSubmit={handleUpdateNotifications} className="mt-5 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email-notifications"
                          name="email-notifications"
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                          className="h-4 w-4 text-primary border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email-notifications" className="font-medium text-gray-700">
                          Receber notificações por email
                        </label>
                        <p className="text-gray-500">
                          Receba notificações importantes sobre sua conta e empréstimos.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="loan-reminders"
                          name="loan-reminders"
                          type="checkbox"
                          checked={loanReminders}
                          onChange={() => setLoanReminders(!loanReminders)}
                          className="h-4 w-4 text-primary border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="loan-reminders" className="font-medium text-gray-700">
                          Lembretes de devolução
                        </label>
                        <p className="text-gray-500">
                          Receba lembretes quando seus empréstimos estiverem prestes a expirar.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="new-arrivals"
                          name="new-arrivals"
                          type="checkbox"
                          checked={newArrivals}
                          onChange={() => setNewArrivals(!newArrivals)}
                          className="h-4 w-4 text-primary border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="new-arrivals" className="font-medium text-gray-700">
                          Novos lançamentos
                        </label>
                        <p className="text-gray-500">
                          Seja notificado quando novos livros forem adicionados à biblioteca.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="promotions"
                          name="promotions"
                          type="checkbox"
                          checked={promotions}
                          onChange={() => setPromotions(!promotions)}
                          className="h-4 w-4 text-primary border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="promotions" className="font-medium text-gray-700">
                          Promoções e ofertas
                        </label>
                        <p className="text-gray-500">
                          Receba informações sobre promoções especiais e descontos.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <CustomButton type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar preferências
                    </CustomButton>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Privacy & Security */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-primary" />
                  Privacidade e Segurança
                </h2>
                
                <div className="mt-5 space-y-4">
                  <CustomButton variant="outline" size="sm">
                    Baixar meus dados
                  </CustomButton>
                  
                  <CustomButton variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:border-red-600">
                    Excluir minha conta
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
