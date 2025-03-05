
import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, ChevronRight } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";

// Mock data for borrowed books
const borrowedBooks = [
  {
    id: "1",
    title: "O Alquimista",
    author: "Paulo Coelho",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    format: "ebook",
    progress: 45,
    dueDate: "10/11/2023",
    daysLeft: 7,
  },
  {
    id: "2",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    format: "both",
    progress: 78,
    dueDate: "15/11/2023",
    daysLeft: 12,
  },
  {
    id: "3",
    title: "Ensaio Sobre a Cegueira",
    author: "José Saramago",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    format: "audio",
    progress: 22,
    dueDate: "05/11/2023",
    daysLeft: 2,
  },
];

const BorrowedBooks = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="md:pl-64">
        <main className="py-6 px-4 sm:px-6 md:py-8 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Livros Emprestados</h1>
            <Link to="/biblioteca">
              <CustomButton variant="outline" size="sm">
                Emprestar mais livros
              </CustomButton>
            </Link>
          </div>
          
          {borrowedBooks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {borrowedBooks.map((book) => (
                <div 
                  key={book.id} 
                  className="bg-white rounded-lg shadow overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="p-5">
                    <div className="flex items-start">
                      <img
                        className="h-24 w-16 object-cover rounded-sm flex-shrink-0"
                        src={book.cover}
                        alt={book.title}
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
                        <p className="text-sm text-gray-500">{book.author}</p>
                        
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1 text-primary" />
                          <span>Vence em {book.daysLeft} dias ({book.dueDate})</span>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">
                              Progresso: {book.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2" 
                              style={{ width: `${book.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 px-5 py-3 bg-gray-50 flex justify-between items-center">
                    <span className="inline-flex items-center text-xs font-medium">
                      {book.format === "ebook" && (
                        <span className="text-blue-600">E-book</span>
                      )}
                      {book.format === "audio" && (
                        <span className="text-purple-600">Audiolivro</span>
                      )}
                      {book.format === "both" && (
                        <span className="text-green-600">E-book + Áudio</span>
                      )}
                    </span>
                    
                    <Link 
                      to={`/livro/${book.id}`}
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Continuar leitura
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Nenhum livro emprestado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Você não possui nenhum livro emprestado no momento.
              </p>
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

export default BorrowedBooks;
