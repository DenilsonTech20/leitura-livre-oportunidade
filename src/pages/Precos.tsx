
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import { CustomButton } from "@/components/ui/custom-button";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";

interface PlanFeature {
  feature: string;
  basic: boolean;
  premium: boolean;
  family: boolean;
}

interface PricingFAQ {
  question: string;
  answer: string;
}

const Precos = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  
  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };
  
  const planFeatures: PlanFeature[] = [
    { feature: "Acesso a e-books", basic: true, premium: true, family: true },
    { feature: "Acesso a audiolivros", basic: false, premium: true, family: true },
    { feature: "Livros emprestados simultaneamente", basic: true, premium: true, family: true },
    { feature: "Máximo de empréstimos mensais", basic: true, premium: true, family: true },
    { feature: "Acesso offline", basic: true, premium: true, family: true },
    { feature: "Recomendações personalizadas", basic: false, premium: true, family: true },
    { feature: "Perfis de usuários", basic: 1, premium: 1, family: 5 },
    { feature: "Exportação de anotações", basic: false, premium: true, family: true },
    { feature: "Clube do livro exclusivo", basic: false, premium: true, family: true },
    { feature: "Acesso antecipado a lançamentos", basic: false, premium: true, family: true },
  ];
  
  const faqs: PricingFAQ[] = [
    {
      question: "Posso cancelar a assinatura a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento. O cancelamento será efetivado ao final do período de cobrança atual."
    },
    {
      question: "Como funciona o plano família?",
      answer: "O plano família permite até 5 perfis de usuários diferentes, cada um com suas próprias recomendações, empréstimos e histórico. Todos os usuários devem residir no mesmo endereço."
    },
    {
      question: "Existe limite de livros que posso emprestar?",
      answer: "Sim, cada plano tem seu próprio limite mensal de empréstimos. O plano Básico oferece até 5 livros por mês, o Premium oferece até 15 livros por mês, e o Família permite até 30 livros por mês, compartilhados entre todos os perfis."
    },
    {
      question: "Por quanto tempo posso ficar com um livro emprestado?",
      answer: "O prazo padrão de empréstimo é de 21 dias. Após esse período, o livro é automaticamente devolvido, a menos que você o renove (se disponível)."
    },
    {
      question: "Posso ler os livros offline?",
      answer: "Sim, todos os planos permitem baixar livros para leitura offline no aplicativo Leitura Livre, disponível para Android e iOS."
    },
    {
      question: "Existe um período de teste gratuito?",
      answer: "Sim, oferecemos um período de teste gratuito de 7 dias para novos assinantes. Você pode experimentar todos os recursos do plano Premium durante esse período."
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-16 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
                Escolha o Plano Ideal para Você
              </h1>
              <p className="text-xl text-muted-foreground">
                Acesso ilimitado à nossa biblioteca de livros digitais e audiolivros em português.
              </p>
            </div>
            
            <div className="flex justify-center mb-10">
              <div className="bg-white p-1 rounded-full shadow-sm inline-flex">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    billingPeriod === "monthly"
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-slate-100"
                  }`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setBillingPeriod("annual")}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    billingPeriod === "annual"
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-slate-100"
                  }`}
                >
                  Anual <span className="text-xs text-primary-foreground bg-green-500 px-2 py-0.5 rounded-full ml-1">-20%</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Plano Básico */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div className="p-6 bg-slate-50">
                  <h3 className="text-xl font-heading font-bold mb-1">Básico</h3>
                  <p className="text-muted-foreground mb-4">Perfeito para leitores ocasionais</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      {billingPeriod === "monthly" ? "R$ 19,90" : "R$ 190,90"}
                    </span>
                    <span className="text-muted-foreground">/{billingPeriod === "monthly" ? "mês" : "ano"}</span>
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <ul className="space-y-4 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Acesso a mais de 10.000 e-books</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Até 5 empréstimos por mês</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>1 livro emprestado por vez</span>
                    </li>
                    <li className="flex items-start">
                      <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <span className="text-muted-foreground">Sem acesso a audiolivros</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 pt-0">
                  <CustomButton className="w-full">
                    Assinar Plano Básico
                  </CustomButton>
                </div>
              </div>
              
              {/* Plano Premium */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-primary relative flex flex-col transform scale-105 z-10">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-medium px-4 py-1 rounded-full">
                  Mais Popular
                </div>
                <div className="p-6 bg-primary/5">
                  <h3 className="text-xl font-heading font-bold mb-1">Premium</h3>
                  <p className="text-muted-foreground mb-4">Para leitores apaixonados</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      {billingPeriod === "monthly" ? "R$ 39,90" : "R$ 382,90"}
                    </span>
                    <span className="text-muted-foreground">/{billingPeriod === "monthly" ? "mês" : "ano"}</span>
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <ul className="space-y-4 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Acesso a mais de 10.000 e-books</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Acesso a mais de 5.000 audiolivros</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Até 15 empréstimos por mês</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>3 livros emprestados por vez</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Acesso a lançamentos exclusivos</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 pt-0">
                  <CustomButton variant="gradient" className="w-full">
                    Assinar Plano Premium
                  </CustomButton>
                </div>
              </div>
              
              {/* Plano Família */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                <div className="p-6 bg-slate-50">
                  <h3 className="text-xl font-heading font-bold mb-1">Família</h3>
                  <p className="text-muted-foreground mb-4">Ideal para compartilhar</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      {billingPeriod === "monthly" ? "R$ 59,90" : "R$ 574,90"}
                    </span>
                    <span className="text-muted-foreground">/{billingPeriod === "monthly" ? "mês" : "ano"}</span>
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <ul className="space-y-4 mb-6">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Tudo do plano Premium</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Até 5 perfis de usuários</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Até 30 empréstimos por mês</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>5 livros emprestados por vez</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>Controles parentais</span>
                    </li>
                  </ul>
                </div>
                <div className="p-6 pt-0">
                  <CustomButton className="w-full">
                    Assinar Plano Família
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tabela comparativa */}
        <section className="py-16 md:py-20">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-10">
              Comparação Detalhada dos Planos
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-4 px-4 text-left">Recursos</th>
                    <th className="py-4 px-4 text-center">Básico</th>
                    <th className="py-4 px-4 text-center bg-primary/5">Premium</th>
                    <th className="py-4 px-4 text-center">Família</th>
                  </tr>
                </thead>
                <tbody>
                  {planFeatures.map((feature, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-4 px-4">{feature.feature}</td>
                      <td className="py-4 px-4 text-center">
                        {typeof feature.basic === 'boolean' ? (
                          feature.basic ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mx-auto" />
                          )
                        ) : (
                          <span>{feature.basic}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center bg-primary/5">
                        {typeof feature.premium === 'boolean' ? (
                          feature.premium ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mx-auto" />
                          )
                        ) : (
                          <span>{feature.premium}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {typeof feature.family === 'boolean' ? (
                          feature.family ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mx-auto" />
                          )
                        ) : (
                          <span>{feature.family}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* FAQ */}
        <section className="py-16 md:py-20 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                Perguntas Frequentes
              </h2>
              <p className="text-muted-foreground">
                Tire suas dúvidas sobre nossos planos e serviços
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="mb-4 border border-slate-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex items-center justify-between w-full p-5 text-left bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium">{faq.question}</span>
                    {activeFAQ === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  {activeFAQ === index && (
                    <div className="p-5 bg-slate-50 border-t border-slate-200">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-6">
                Ainda tem dúvidas? Entre em contato com nosso suporte
              </p>
              <CustomButton variant="outline" size="lg">
                Falar com Suporte
              </CustomButton>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Precos;
