
import React from "react";
import { 
  BookOpen, 
  Headphones, 
  Clock, 
  Smartphone, 
  Download, 
  Heart,
  BookText,
  Users,
  Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, className, delay = 0 }: FeatureCardProps) => (
  <div 
    className={cn(
      "bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 animate-fade-in feature-gradient",
      className
    )}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const Features = () => {
  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Milhares de Livros Digitais",
      description: "Acesse uma vasta biblioteca de e-books em português, desde os clássicos até os lançamentos mais recentes."
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Audiolivros de Alta Qualidade",
      description: "Ouça narração profissional dos melhores títulos, perfeito para aproveitar durante deslocamentos ou exercícios."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Empréstimo Fácil e Rápido",
      description: "Processo simples para emprestar e devolver livros, sem complicações ou taxas escondidas."
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Acesso em Qualquer Dispositivo",
      description: "Leia ou ouça em smartphones, tablets, e-readers e computadores, com sincronização automática."
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Leitura Offline",
      description: "Baixe livros e audiobooks para acessar mesmo sem conexão com a internet."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Recomendações Personalizadas",
      description: "Sugestões baseadas nos seus gostos e hábitos de leitura, ajudando você a descobrir novos autores."
    }
  ];

  const highlightedFeatures = [
    {
      icon: <BookText className="h-5 w-5" />,
      title: "Conteúdo Exclusivo",
      description: "Acesso a títulos e edições especiais disponíveis apenas em nossa plataforma."
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Clubes de Leitura",
      description: "Participe de discussões online sobre livros com outros leitores apaixonados."
    },
    {
      icon: <Bookmark className="h-5 w-5" />,
      title: "Sem Multas por Atraso",
      description: "Empréstimos flexíveis sem preocupações com prazos rígidos ou penalidades."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-slate-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full mb-4">
            Recursos exclusivos
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Por que escolher a <span className="text-gradient">Leitura Livre</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Nossa plataforma foi projetada para oferecer a melhor experiência possível de leitura e áudio, com recursos que facilitam seu acesso à literatura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>

        <div className="mt-16 md:mt-24 bg-white rounded-2xl shadow-lg border p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center text-center md:text-left">
            <div className="flex-1 mb-10 md:mb-0 md:pr-12">
              <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                Mais do que uma simples biblioteca digital
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Revolucionamos a maneira como você acessa livros digitais e audiolivros, oferecendo uma experiência completa e moderna.
              </p>
              <div className="space-y-4">
                {highlightedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mt-1 mr-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Persona usando o app de leitura em um tablet" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6">
                    <p className="text-white/80 text-sm mb-2">Disponível para todos os dispositivos</p>
                    <h3 className="text-white text-xl font-bold">Leia ou ouça onde e como preferir</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
