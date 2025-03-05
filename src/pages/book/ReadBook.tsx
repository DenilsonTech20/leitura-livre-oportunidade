
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookReader from "@/components/reader/BookReader";
import { useToast } from "@/hooks/use-toast";

// This will be replaced by actual API calls or Supabase queries
const fetchBookContent = async (bookId: string) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock content - in a real app, this would fetch from an API
  return {
    id: bookId,
    title: "O Alquimista",
    author: "Paulo Coelho",
    progress: 0,
    content: Array(50).fill(0).map((_, i) => 
      `<p>Página ${i + 1} do livro. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>`
    )
  };
};

// This will track user reading time - in real app, will connect to backend
const getUserReadingTime = () => {
  // Simulate getting user's remaining reading time from localStorage or API
  // In a real app, this would come from your backend
  const storedTime = localStorage.getItem('remainingReadingTime');
  if (storedTime) {
    return parseInt(storedTime, 10);
  }
  // Default: 2 hours in seconds (7200)
  return 7200;
};

const saveUserReadingTime = (time: number) => {
  localStorage.setItem('remainingReadingTime', time.toString());
};

const ReadBook = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // User subscription status (will come from auth context in real app)
  const [isPremium, setIsPremium] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  
  useEffect(() => {
    const loadBook = async () => {
      if (!bookId) {
        setError("ID do livro não especificado");
        setLoading(false);
        return;
      }
      
      try {
        // In a real app, you would check if user has borrowed this book
        // and has an active loan before proceeding
        
        // Check user subscription status
        // This will come from your authentication context or API
        const userIsPremium = localStorage.getItem('userSubscription') === 'premium';
        setIsPremium(userIsPremium);
        
        if (!userIsPremium) {
          const time = getUserReadingTime();
          if (time <= 0) {
            toast({
              title: "Tempo de leitura esgotado",
              description: "Você já utilizou todo seu tempo de leitura gratuito hoje.",
              variant: "destructive",
            });
            navigate("/dashboard/emprestados");
            return;
          }
          setRemainingTime(time);
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
  }, [bookId, navigate, toast]);
  
  const handleSaveProgress = (page: number) => {
    // In a real app, this would be an API call to save progress
    console.log(`Saving progress for book ${bookId}: page ${page}`);
    
    // Update local state
    if (book) {
      setBook({ ...book, progress: page });
    }
  };
  
  const handleClose = () => {
    // Save final progress before closing
    if (book) {
      // In a real app, make API call to update loan record
      console.log("Saving final reading progress...");
      
      // For free users, save remaining time
      if (!isPremium) {
        saveUserReadingTime(remainingTime);
      }
    }
    
    // Navigate back to borrowed books
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
          <button 
            onClick={() => navigate("/dashboard/emprestados")}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Voltar para meus livros
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen bg-white">
      <BookReader
        bookId={book.id}
        title={book.title}
        author={book.author}
        content={book.content}
        currentPage={book.progress || 0}
        onClose={handleClose}
        onSaveProgress={handleSaveProgress}
        remainingTime={isPremium ? undefined : remainingTime}
        isPremium={isPremium}
      />
    </div>
  );
};

export default ReadBook;
