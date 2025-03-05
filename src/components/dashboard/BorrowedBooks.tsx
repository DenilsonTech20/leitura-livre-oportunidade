
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomButton } from "@/components/ui/custom-button";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Headphones, BookText, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BookProps {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  daysLeft: number;
  totalDays: number;
  format: "digital" | "audio" | "both";
}

const BookItem = ({ book }: { book: BookProps }) => {
  const progress = Math.max(0, 100 - (book.daysLeft / book.totalDays) * 100);
  const formatIcon = {
    digital: <BookText className="h-4 w-4" />,
    audio: <Headphones className="h-4 w-4" />,
    both: <BookOpen className="h-4 w-4" />,
  };

  return (
    <Card className="flex flex-col md:flex-row overflow-hidden animate-fade-in border bg-white">
      <div className="md:w-1/4 w-full h-40 md:h-auto relative">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col p-4 md:p-6">
        <div className="mb-2 flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {formatIcon[book.format]}
            <span className="ml-1">
              {book.format === "digital"
                ? "E-Book"
                : book.format === "audio"
                ? "Áudio Livro"
                : "E-Book & Áudio"}
            </span>
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{book.author}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center text-sm mb-1">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1.5" />
              {book.daysLeft > 0 ? (
                <span>
                  {book.daysLeft} {book.daysLeft === 1 ? "dia" : "dias"} restante
                </span>
              ) : (
                <span className="text-destructive">Expirado</span>
              )}
            </div>
            <span className="text-primary font-medium">{Math.round(progress)}% concluído</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          <div className="flex items-center justify-between mt-4 gap-3">
            <CustomButton size="sm" variant="outline" className="flex-1">
              Renovar
            </CustomButton>
            <CustomButton size="sm" className="flex-1">
              Continuar Leitura
            </CustomButton>
          </div>
        </div>
      </div>
    </Card>
  );
};

const BorrowedBooks = () => {
  const currentBooks = [
    {
      id: "1",
      title: "Grande Sertão: Veredas",
      author: "João Guimarães Rosa",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      daysLeft: 7,
      totalDays: 14,
      format: "digital" as const,
    },
    {
      id: "2",
      title: "Dom Casmurro",
      author: "Machado de Assis",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      daysLeft: 3,
      totalDays: 14,
      format: "both" as const,
    },
    {
      id: "3",
      title: "Memórias Póstumas de Brás Cubas",
      author: "Machado de Assis",
      coverImage: "https://images.unsplash.com/photo-1535905748047-14b2415c77d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      daysLeft: 10,
      totalDays: 14,
      format: "audio" as const,
    },
  ];

  const historyBooks = [
    {
      id: "4",
      title: "O Cortiço",
      author: "Aluísio Azevedo",
      coverImage: "https://images.unsplash.com/photo-1515098506762-79e1384e9d8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      daysLeft: 0,
      totalDays: 14,
      format: "digital" as const,
    },
    {
      id: "5",
      title: "Capitães da Areia",
      author: "Jorge Amado",
      coverImage: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      daysLeft: 0,
      totalDays: 14,
      format: "audio" as const,
    },
  ];

  return (
    <div className="w-full">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="current">Empréstimos Atuais</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-heading">Meus Empréstimos</h2>
            <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
              {currentBooks.length} {currentBooks.length === 1 ? "livro" : "livros"} emprestado
            </span>
          </div>
          
          {currentBooks.length > 0 ? (
            <div className="space-y-4">
              {currentBooks.map((book) => (
                <BookItem key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-muted/50 py-8">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Nenhum livro emprestado</h3>
                <p className="text-muted-foreground mb-4">
                  Você ainda não tem nenhum livro emprestado. Explore nossa biblioteca e encontre seu próximo livro!
                </p>
                <CustomButton>
                  Explorar Biblioteca
                  <ArrowRight className="ml-2 h-4 w-4" />
                </CustomButton>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-heading">Histórico de Leitura</h2>
            <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
              {historyBooks.length} {historyBooks.length === 1 ? "livro" : "livros"} devolvido
            </span>
          </div>
          
          {historyBooks.length > 0 ? (
            <div className="space-y-4">
              {historyBooks.map((book) => (
                <BookItem key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed bg-muted/50 py-8">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Histórico vazio</h3>
                <p className="text-muted-foreground mb-4">
                  Você ainda não devolveu nenhum livro. Seu histórico aparecerá aqui quando você devolver livros.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BorrowedBooks;
