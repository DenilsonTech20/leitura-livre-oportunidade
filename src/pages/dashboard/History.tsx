import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, BookOpen, Star, Search } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";

// Mock data for read history
const readHistory = [
  {
    id: "1",
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    format: "ebook",
    returnedDate: "15/09/2023",
    rating: 5,
  },
  {
    id: "2",
    title: "A Hora da Estrela",
    author: "Clarice Lispector",
    cover: "https://images.unsplash.com/photo-1512045482940-f37f5216f639?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    format: "audio",
    returnedDate: "28/08/2023",
    rating: 4,
  },
  {
    id: "3",
    title: "Grande Sertão: Veredas",
    author: "João Guimarães Rosa",
    cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    format: "both",
    returnedDate: "05/08/2023",
    rating: 5,
  },
  {
    id: "4",
    title: "Quincas Borba",
    author: "Machado de Assis",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    format: "ebook",
    returnedDate: "27/07/2023",
    rating: 4,
  },
  {
    id: "5",
    title: "Capitães da Areia",
    author: "Jorge Amado",
    cover: "https://images.unsplash.com/photo-1495640452828-3df6795cf69b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    format: "audio",
    returnedDate: "10/07/2023",
    rating: 3,
  },
  {
    id: "6",
    title: "O Cortiço",
    author: "Aluísio Azevedo",
    cover: "https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    format: "ebook",
    returnedDate: "22/06/2023",
    rating: 4,
  },
];

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter books based on search query
  const filteredBooks = readHistory.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Rating stars component
  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="md:pl-64">
        <main className="py-6 px-4 sm:px-6 md:py-8 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Histórico de Leituras</h1>
          </div>
          
          {/* Search bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar no histórico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          
          {filteredBooks.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <li key={book.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <img
                        className="h-16 w-12 object-cover rounded-sm flex-shrink-0"
                        src={book.cover}
                        alt={book.title}
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
                            <p className="text-sm text-gray-500">{book.author}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Devolvido em {book.returnedDate}</span>
                            </div>
                            <div className="mt-1">
                              <RatingStars rating={book.rating} />
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex items-center">
                          <span className={`
                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${book.format === "ebook" ? "bg-blue-100 text-blue-800" : 
                              book.format === "audio" ? "bg-purple-100 text-purple-800" : 
                              "bg-green-100 text-green-800"}
                          `}>
                            {book.format === "ebook" ? "E-book" : 
                             book.format === "audio" ? "Audiolivro" : 
                             "E-book + Áudio"}
                          </span>
                          
                          <div className="ml-auto">
                            <Link to={`/biblioteca`}>
                              <CustomButton variant="ghost" size="sm">
                                Emprestar novamente
                              </CustomButton>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              {searchQuery ? (
                <>
                  <Search className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Nenhum resultado encontrado
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Não encontramos nenhum livro que corresponda à sua pesquisa.
                  </p>
                </>
              ) : (
                <>
                  <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Nenhum livro no histórico
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Você ainda não leu nenhum livro em nossa plataforma.
                  </p>
                </>
              )}
              <div className="mt-6">
                <Link to="/biblioteca">
                  <CustomButton>
                    Explorar Biblioteca
                  </CustomButton>
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default History;
