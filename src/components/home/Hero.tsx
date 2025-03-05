
import React from "react";
import { CustomButton } from "@/components/ui/custom-button";
import { ChevronRight, BookOpen, Headphones, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden hero-gradient">
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-3/4 -z-10 opacity-80">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-transparent rounded-bl-[50%]" />
      </div>

      <div className="absolute bottom-0 left-0 w-1/2 h-1/3 -z-10 opacity-70 hidden md:block">
        <div className="w-full h-full bg-gradient-to-tr from-blue-50 to-transparent rounded-tr-[30%]" />
      </div>
      
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left max-w-2xl mx-auto md:mx-0">
            <div 
              className="inline-block px-3 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Sua biblioteca digital em português
            </div>
            
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <span>Leia e Ouça </span>
              <span className="text-gradient">Sem Limites</span>
            </h1>
            
            <p 
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              Acesse milhares de livros digitais e audiobooks em português, 
              emprestados diretamente para o seu dispositivo.
            </p>
            
            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in"
              style={{ animationDelay: "0.8s" }}
            >
              <Link to="/signup">
                <CustomButton size="lg" className="w-full sm:w-auto group">
                  <span>Comece Agora</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </CustomButton>
              </Link>
              <Link to="/biblioteca">
                <CustomButton size="lg" variant="outline" className="w-full sm:w-auto">
                  Explorar Biblioteca
                </CustomButton>
              </Link>
            </div>
            
            <div 
              className="flex flex-wrap gap-6 items-center justify-center md:justify-start mt-10 text-sm font-medium text-muted-foreground animate-fade-in"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>10.000+ E-books</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-primary" />
                <span>5.000+ Audiolivros</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Acesso 24/7</span>
              </div>
            </div>
          </div>
          
          <div 
            className="flex-1 md:flex-shrink-0 max-w-md animate-fade-in relative"
            style={{ animationDelay: "1s" }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1513001900722-370f803f498d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Mulher lendo um livro"
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="glass p-4 rounded-xl">
                  <p className="text-sm font-medium mb-1">Em destaque</p>
                  <h3 className="text-lg font-bold mb-1">Cem Anos de Solidão</h3>
                  <p className="text-sm text-muted-foreground">Gabriel García Márquez</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 w-32 h-32 glass rounded-xl p-4 shadow-xl -rotate-6 animate-float hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1592496431122-2349e0fbc666?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                alt="Livro digital"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            
            <div className="absolute -bottom-6 -left-6 w-24 h-24 glass rounded-xl p-3 shadow-xl rotate-12 animate-float hidden md:block" style={{ animationDelay: "1.5s" }}>
              <img
                src="https://images.unsplash.com/photo-1589244156279-5be0a13de4e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                alt="Headphones"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
