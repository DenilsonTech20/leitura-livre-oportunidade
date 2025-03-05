
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/home/Footer";
import { CustomButton } from "@/components/ui/custom-button";
import { Link } from "react-router-dom";
import { ArrowRight, BookText, Shield, CreditCard } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <Features />
        
        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="bg-primary rounded-3xl overflow-hidden shadow-xl">
              <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-white text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                    Pronto para começar sua jornada literária?
                  </h2>
                  <p className="text-white/80 mb-0 md:mb-0 max-w-lg">
                    Registre-se agora e ganhe 7 dias de acesso gratuito à nossa biblioteca completa!
                  </p>
                </div>
                <Link to="/signup">
                  <CustomButton size="lg" variant="glass" className="w-full md:w-auto">
                    Criar Conta Gratuita
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </CustomButton>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <Testimonials />
        
        {/* Trust Section */}
        <section className="py-20 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Por que confiar na <span className="text-gradient">Leitura Livre</span>?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Milhares de brasileiros já confiam em nossa plataforma para suas necessidades literárias.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Biblioteca Extensiva</h3>
                <p className="text-muted-foreground">
                  Mais de 15.000 títulos em português, incluindo clássicos e lançamentos.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Segurança Garantida</h3>
                <p className="text-muted-foreground">
                  Seus dados e histórico de leitura são protegidos com a mais alta tecnologia.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Pagamento Flexível</h3>
                <p className="text-muted-foreground">
                  Opções de pagamento que se adaptam ao seu orçamento, sem compromissos longos.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
