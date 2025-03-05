
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import { BookOpen, Users, Shield, Library, Mail, MapPin, Phone } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { Link } from "react-router-dom";

const Sobre = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 lg:pr-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6">
                  Sobre a <span className="text-gradient">Leitura Livre</span>
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                  Somos uma plataforma de empréstimo de livros digitais e audiolivros
                  comprometida em tornar a leitura acessível para todos os brasileiros.
                  Nossa missão é conectar pessoas ao conhecimento e às histórias que
                  transformam vidas.
                </p>
                <div className="flex flex-wrap gap-4">
                  <CustomButton size="lg">
                    Nosso Catálogo
                  </CustomButton>
                  <Link to="/precos">
                    <CustomButton variant="outline" size="lg">
                      Planos e Preços
                    </CustomButton>
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2 mt-12 lg:mt-0">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/10 rounded-lg"></div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-lg"></div>
                  <img
                    src="https://images.unsplash.com/photo-1513001900722-370f803f498d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Biblioteca"
                    className="rounded-lg shadow-xl relative z-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4">Nossa Missão e Valores</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Acreditamos que o acesso à literatura é um direito de todos. Conheça os valores
                que guiam nossa plataforma e equipe.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Acesso Universal</h3>
                <p className="text-gray-600">
                  Democratizar o acesso à leitura, tornando livros digitais e audiolivros acessíveis
                  para pessoas de todas as idades e condições socioeconômicas.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Comunidade</h3>
                <p className="text-gray-600">
                  Construir uma comunidade vibrante de leitores que compartilham recomendações,
                  discussões e experiências literárias enriquecedoras.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Sustentabilidade</h3>
                <p className="text-gray-600">
                  Promover a sustentabilidade através da digitalização, reduzindo o impacto ambiental
                  associado à produção e distribuição de livros físicos.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4">Nossa Equipe</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Conheça as pessoas apaixonadas por literatura que tornam a Leitura Livre possível.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Paulo Mendes"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full border-2 border-white"></div>
                </div>
                <h3 className="text-xl font-semibold">Paulo Mendes</h3>
                <p className="text-gray-600 mb-2">CEO & Fundador</p>
                <p className="text-sm text-gray-500">
                  Apaixonado por tecnologia e literatura, Paulo fundou a Leitura Livre
                  para democratizar o acesso aos livros no Brasil.
                </p>
              </div>
              
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src="https://images.unsplash.com/photo-1507101105822-7472b28e22ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Carla Santos"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full border-2 border-white"></div>
                </div>
                <h3 className="text-xl font-semibold">Carla Santos</h3>
                <p className="text-gray-600 mb-2">Diretora de Conteúdo</p>
                <p className="text-sm text-gray-500">
                  Com 15 anos de experiência editorial, Carla lidera a curadoria e
                  aquisição de livros para nossa biblioteca digital.
                </p>
              </div>
              
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="André Lima"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full border-2 border-white"></div>
                </div>
                <h3 className="text-xl font-semibold">André Lima</h3>
                <p className="text-gray-600 mb-2">CTO</p>
                <p className="text-sm text-gray-500">
                  Especialista em tecnologia, André é responsável pela infraestrutura
                  e desenvolvimento da plataforma Leitura Livre.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold mb-4">Entre em Contato</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Tem dúvidas ou sugestões? Nossa equipe está pronta para ajudar.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-primary/5 rounded-xl">
                <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-gray-600">contato@leituralivre.com.br</p>
              </div>
              
              <div className="text-center p-6 bg-primary/5 rounded-xl">
                <MapPin className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Endereço</h3>
                <p className="text-gray-600">
                  Av. Paulista, 1000 - Bela Vista<br />
                  São Paulo - SP, 01310-100
                </p>
              </div>
              
              <div className="text-center p-6 bg-primary/5 rounded-xl">
                <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Telefone</h3>
                <p className="text-gray-600">(11) 3456-7890</p>
              </div>
            </div>
            
            <div className="mt-12 max-w-3xl mx-auto">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Seu nome"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Assunto da mensagem"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Sua mensagem"
                  ></textarea>
                </div>
                
                <div className="text-center">
                  <CustomButton size="lg">
                    Enviar Mensagem
                  </CustomButton>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sobre;
