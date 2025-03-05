
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/home/Footer";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import BookCardBorrow from "@/components/ui/BookCardBorrow";

// Mock data for books
const mockBooks = [
  {
    id: "1",
    title: "O Alquimista",
    author: "Paulo Coelho",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    format: "both" as const,
  },
  {
    id: "2",
    title: "A Revolução dos Bichos",
    author: "George Orwell",
    cover: "https://images.unsplash.com/photo-1531928351158-2f736078e0a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    format: "ebook" as const,
  },
  {
    id: "3",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    format: "both" as const,
  },
  {
    id: "4",
    title: "Ensaio Sobre a Cegueira",
    author: "José Saramago",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    format: "audio" as const,
  },
  {
    id: "5",
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    format: "ebook" as const,
  },
  {
    id: "6",
    title: "Quincas Borba",
    author: "Machado de Assis",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.4,
    format: "both" as const,
  },
  {
    id: "7",
    title: "A Hora da Estrela",
    author: "Clarice Lispector",
    cover: "https://images.unsplash.com/photo-1512045482940-f37f5216f639?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.3,
    format: "audio" as const,
  },
  {
    id: "8",
    title: "O Cortiço",
    author: "Aluísio Azevedo",
    cover: "https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.2,
    format: "ebook" as const,
  },
  {
    id: "9",
    title: "Grande Sertão: Veredas",
    author: "João Guimarães Rosa",
    cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    format: "both" as const,
  },
  {
    id: "10",
    title: "Capitães da Areia",
    author: "Jorge Amado",
    cover: "https://images.unsplash.com/photo-1495640452828-3df6795cf69b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    format: "audio" as const,
  },
  {
    id: "11",
    title: "Iracema",
    author: "José de Alencar",
    cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.1,
    format: "ebook" as const,
  },
  {
    id: "12",
    title: "O Guarani",
    author: "José de Alencar",
    cover: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.0,
    format: "both" as const,
  },
];

const generos = ["Romance", "Clássico", "Fantasia", "Biografia", "História", "Suspense", "Ficção Científica"];
const formatos = ["E-book", "Audiolivro", "Ambos"];

const Biblioteca = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGeneros, setSelectedGeneros] = useState<string[]>([]);
  const [selectedFormatos, setSelectedFormatos] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const toggleGenero = (genero: string) => {
    if (selectedGeneros.includes(genero)) {
      setSelectedGeneros(selectedGeneros.filter(g => g !== genero));
    } else {
      setSelectedGeneros([...selectedGeneros, genero]);
    }
  };
  
  const toggleFormato = (formato: string) => {
    if (selectedFormatos.includes(formato)) {
      setSelectedFormatos(selectedFormatos.filter(f => f !== formato));
    } else {
      setSelectedFormatos([...selectedFormatos, formato]);
    }
  };
  
  const clearFilters = () => {
    setSelectedGeneros([]);
    setSelectedFormatos([]);
    setSearchQuery("");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
              Biblioteca Virtual
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore nossa coleção de e-books e audiolivros
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 mb-10">
            {/* Search bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Buscar por título, autor ou palavra-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            
            {/* Filter button - mobile */}
            <div className="lg:hidden">
              <CustomButton
                variant="outline"
                className="w-full"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </CustomButton>
            </div>
            
            {/* Filters - desktop */}
            <div className="hidden lg:flex gap-4">
              <div className="relative group">
                <CustomButton
                  variant="outline"
                  className={selectedGeneros.length > 0 ? "border-primary text-primary" : ""}
                >
                  Gênero
                  <ChevronDown className="h-4 w-4 ml-1" />
                </CustomButton>
                <div className="absolute z-10 top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-border p-4 hidden group-hover:block">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium">Gêneros</h4>
                    {selectedGeneros.length > 0 && (
                      <button 
                        onClick={() => setSelectedGeneros([])} 
                        className="text-xs text-primary hover:underline"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {generos.map((genero) => (
                      <div key={genero} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`genero-${genero}`}
                          checked={selectedGeneros.includes(genero)}
                          onChange={() => toggleGenero(genero)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`genero-${genero}`} className="ml-2 text-sm">
                          {genero}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <CustomButton
                  variant="outline"
                  className={selectedFormatos.length > 0 ? "border-primary text-primary" : ""}
                >
                  Formato
                  <ChevronDown className="h-4 w-4 ml-1" />
                </CustomButton>
                <div className="absolute z-10 top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border p-4 hidden group-hover:block">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium">Formatos</h4>
                    {selectedFormatos.length > 0 && (
                      <button 
                        onClick={() => setSelectedFormatos([])} 
                        className="text-xs text-primary hover:underline"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {formatos.map((formato) => (
                      <div key={formato} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`formato-${formato}`}
                          checked={selectedFormatos.includes(formato)}
                          onChange={() => toggleFormato(formato)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`formato-${formato}`} className="ml-2 text-sm">
                          {formato}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {(selectedGeneros.length > 0 || selectedFormatos.length > 0 || searchQuery) && (
                <CustomButton variant="ghost" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar filtros
                </CustomButton>
              )}
            </div>
          </div>
          
          {/* Mobile filters */}
          {isFilterOpen && (
            <div className="lg:hidden p-4 bg-slate-50 rounded-lg mb-6">
              <div className="mb-4">
                <h4 className="font-medium mb-2">Gêneros</h4>
                <div className="flex flex-wrap gap-2">
                  {generos.map((genero) => (
                    <button
                      key={genero}
                      onClick={() => toggleGenero(genero)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        selectedGeneros.includes(genero)
                          ? "bg-primary text-white"
                          : "bg-white border border-slate-200"
                      }`}
                    >
                      {genero}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2">Formatos</h4>
                <div className="flex flex-wrap gap-2">
                  {formatos.map((formato) => (
                    <button
                      key={formato}
                      onClick={() => toggleFormato(formato)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        selectedFormatos.includes(formato)
                          ? "bg-primary text-white"
                          : "bg-white border border-slate-200"
                      }`}
                    >
                      {formato}
                    </button>
                  ))}
                </div>
              </div>
              
              {(selectedGeneros.length > 0 || selectedFormatos.length > 0) && (
                <CustomButton variant="ghost" size="sm" onClick={clearFilters} className="mt-2">
                  <X className="h-4 w-4 mr-2" />
                  Limpar filtros
                </CustomButton>
              )}
            </div>
          )}

          {/* Applied filters */}
          {(selectedGeneros.length > 0 || selectedFormatos.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedGeneros.map((genero) => (
                <div key={genero} className="flex items-center bg-slate-100 rounded-full px-3 py-1 text-sm">
                  {genero}
                  <button onClick={() => toggleGenero(genero)} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {selectedFormatos.map((formato) => (
                <div key={formato} className="flex items-center bg-slate-100 rounded-full px-3 py-1 text-sm">
                  {formato}
                  <button onClick={() => toggleFormato(formato)} className="ml-2">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Books grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {mockBooks.map((book) => (
              <BookCardBorrow
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                cover={book.cover}
                rating={book.rating}
                format={book.format}
              />
            ))}
          </div>
          
          {/* Load more button */}
          <div className="flex justify-center mt-12">
            <CustomButton variant="outline" size="lg">
              Carregar mais livros
            </CustomButton>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Biblioteca;
