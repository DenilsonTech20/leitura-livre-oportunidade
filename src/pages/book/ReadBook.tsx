import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Split, SplitPane } from '@/components/ui/split';
import BookReader from "@/components/reader/BookReader";
import FileReader from "@/components/reader/FileReader";
import BookChat from "@/components/reader/BookChat";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { MessageSquareText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileType } from "@/types";

// This will be replaced by actual API calls
const fetchBookContent = async (bookId: string) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock content - in a real app, this would fetch from an API
  return {
    id: bookId,
    title: "O Alquimista",
    author: "Paulo Coelho",
    progress: 0,
    fileUrl: "https://www.africau.edu/images/default/sample.pdf", // Sample PDF URL
    fileType: FileType.PDF,
    content: Array(50).fill(0).map((_, i) => 
      `<p>Página ${i + 1} do livro. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>`
    )
  };
};

const ReadBook = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPremium, remainingReadingTime, updateRemainingTime } = useSubscription();
  
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  
  useEffect(() => {
    const loadBook = async () => {
      if (!bookId) {
        setError("ID do livro não especificado");
        setLoading(false);
        return;
      }
      
      try {
        // Check reading time for free users
        if (!isPremium && remainingReadingTime <= 0) {
          toast({
            title: "Tempo de leitura esgotado",
            description: "Você já utilizou todo seu tempo de leitura gratuito hoje.",
            variant: "destructive",
          });
          navigate("/dashboard/emprestados");
          return;
        }
        
        const bookData = await fetchBookContent(bookId);
        setBook(bookData);
      } catch (err) {
        setError("Erro ao carregar o livro. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadBook();
  }, [bookId, navigate, toast, isPremium, remainingReadingTime]);
  
  const handleTimeUpdate = (newTime: number) => {
    updateRemainingTime(newTime);
  };
  
  const handleClose = () => {
    navigate("/dashboard/emprestados");
  };
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Carregando livro...</p>
        </div>
      </div>
    );
  }
  
  if (error || !book) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro</h2>
          <p className="mb-6">{error || "Não foi possível carregar o livro."}</p>
          <Button 
            onClick={() => navigate("/dashboard/emprestados")}
          >
            Voltar para meus livros
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center p-2 bg-gray-100 border-b">
        <Button variant="ghost" size="sm" onClick={handleClose}>
          <X className="h-4 w-4 mr-1" /> Fechar
        </Button>
        <h1 className="text-sm font-medium">{book.title} - {book.author}</h1>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowChat(!showChat)}
          className={showChat ? "bg-primary/10 text-primary" : ""}
        >
          <MessageSquareText className="h-4 w-4 mr-1" /> 
          {showChat ? "Fechar Chat" : "Abrir Chat"}
        </Button>
      </div>
      
      <div className="flex-grow">
        {showChat ? (
          <Split className="h-full">
            <SplitPane size={70} minSize={30}>
              <FileReader 
                fileUrl={book.fileUrl}
                fileType={book.fileType}
                title={book.title}
                author={book.author}
                onClose={handleClose}
                isPremium={isPremium}
                remainingTime={!isPremium ? remainingReadingTime : undefined}
                onTimeUpdate={handleTimeUpdate}
              />
            </SplitPane>
            <SplitPane minSize={20}>
              <BookChat 
                bookId={book.id}
                bookTitle={book.title}
                bookAuthor={book.author}
                onClose={() => setShowChat(false)}
              />
            </SplitPane>
          </Split>
        ) : (
          <FileReader 
            fileUrl={book.fileUrl}
            fileType={book.fileType}
            title={book.title}
            author={book.author}
            onClose={handleClose}
            isPremium={isPremium}
            remainingTime={!isPremium ? remainingReadingTime : undefined}
            onTimeUpdate={handleTimeUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default ReadBook;
