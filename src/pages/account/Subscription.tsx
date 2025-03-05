
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, Clock, HelpCircle, CreditCard } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "free",
    name: "Plano Gratuito",
    price: 0,
    description: "Acesso básico à biblioteca com limitações",
    features: [
      { text: "2 horas de leitura por dia", included: true },
      { text: "Acesso à biblioteca básica", included: true },
      { text: "Empréstimo por 7 dias", included: true },
      { text: "Leitura ilimitada", included: false },
      { text: "Audiolivros", included: false },
      { text: "Leitura offline", included: false },
    ],
  },
  {
    id: "premium",
    name: "Plano Premium",
    price: 29.90,
    description: "Acesso completo à biblioteca sem limitações",
    features: [
      { text: "Leitura ilimitada", included: true },
      { text: "Acesso à biblioteca completa", included: true },
      { text: "Empréstimo por 30 dias", included: true },
      { text: "Audiolivros incluídos", included: true },
      { text: "Leitura offline", included: true },
      { text: "Sem anúncios", included: true },
    ],
    popular: true,
  },
  {
    id: "family",
    name: "Plano Família",
    price: 49.90,
    description: "Compartilhe com até 4 pessoas da sua família",
    features: [
      { text: "Leitura ilimitada", included: true },
      { text: "Acesso à biblioteca completa", included: true },
      { text: "Empréstimo por 30 dias", included: true },
      { text: "Audiolivros incluídos", included: true },
      { text: "Leitura offline", included: true },
      { text: "Até 4 perfis diferentes", included: true },
    ],
  },
];

const Subscription = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // In a real app, get this from your auth context
  const currentPlan = localStorage.getItem('userSubscription') || 'free';
  
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };
  
  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call to your payment processor
      // After successful payment, update user subscription in database
      
      // For demo purposes, just update localStorage
      localStorage.setItem('userSubscription', selectedPlan);
      
      toast({
        title: "Assinatura atualizada!",
        description: `Seu plano foi atualizado com sucesso para ${plans.find(p => p.id === selectedPlan)?.name}.`,
      });
      
      // Reset selected plan
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Erro ao atualizar assinatura",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="md:pl-64">
        <main className="py-6 px-4 sm:px-6 md:py-8 md:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Gerenciar Assinatura</h1>
            <p className="text-gray-600 mt-1">
              Gerencie seu plano e método de pagamento
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-medium mb-4">Seu plano atual</h2>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="flex items-center">
                  <h3 className="font-semibold text-lg">
                    {plans.find(p => p.id === currentPlan)?.name || "Plano Gratuito"}
                  </h3>
                  {currentPlan === 'premium' && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Premium
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mt-1">
                  {currentPlan === 'free' ? (
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-amber-500" />
                      Limite de 2 horas de leitura por dia
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                      Leitura ilimitada
                    </span>
                  )}
                </p>
                
                {currentPlan !== 'free' && (
                  <p className="text-sm text-gray-600 mt-2">
                    Próxima cobrança: 15/11/2023
                  </p>
                )}
              </div>
              
              {currentPlan !== 'free' && (
                <CustomButton
                  variant="outline"
                  size="sm"
                  className="mt-4 md:mt-0"
                  onClick={() => {
                    // In a real app, this would open a payment management UI
                    toast({
                      title: "Método de pagamento",
                      description: "Esta funcionalidade estará disponível em breve.",
                    });
                  }}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Gerenciar pagamento
                </CustomButton>
              )}
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-6">Nossos planos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`bg-white rounded-lg border ${
                  plan.popular ? 'border-primary shadow-md' : 'border-gray-200 shadow-sm'
                } overflow-hidden relative h-full flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-white text-xs px-3 py-1 rounded-bl">
                      Mais popular
                    </div>
                  </div>
                )}
                
                <div className="p-6 flex-grow">
                  <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? "Grátis" : `R$ ${plan.price.toFixed(2)}`}
                    </span>
                    {plan.price > 0 && <span className="text-gray-500 ml-1">/mês</span>}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        {feature.included ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <CustomButton
                    variant={plan.popular ? "primary" : "outline"}
                    className="w-full"
                    disabled={currentPlan === plan.id || loading}
                    loading={selectedPlan === plan.id && loading}
                    onClick={() => {
                      if (currentPlan !== plan.id) {
                        handleSelectPlan(plan.id);
                        handleSubscribe();
                      }
                    }}
                  >
                    {currentPlan === plan.id 
                      ? "Plano Atual" 
                      : plan.price === 0 
                        ? "Selecionar Plano" 
                        : "Assinar Agora"}
                  </CustomButton>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
            <HelpCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Precisa de ajuda?</h3>
              <p className="text-sm text-blue-700 mt-1">
                Entre em contato com nosso suporte se tiver dúvidas sobre os planos de assinatura.
              </p>
              <Link 
                to="/suporte"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 mt-2 inline-block"
              >
                Falar com o suporte
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Subscription;
