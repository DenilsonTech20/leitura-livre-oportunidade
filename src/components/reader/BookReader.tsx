
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Bookmark, Settings, Clock } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface BookReaderProps {
  bookId: string;
  title: string;
  author: string;
  content: string[];
  currentPage?: number;
  onClose: () => void;
  onSaveProgress: (page: number) => void;
  remainingTime?: number; // in seconds, for free users
  isPremium?: boolean;
}

const BookReader = ({
  bookId,
  title,
  author,
  content,
  currentPage = 0,
  onClose,
  onSaveProgress,
  remainingTime,
  isPremium = false,
}: BookReaderProps) => {
  const [page, setPage] = useState(currentPage);
  const [fontSize, setFontSize] = useState(16);
  const [timeLeft, setTimeLeft] = useState(remainingTime || 0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();

  const totalPages = content.length;
  const progress = Math.round((page / (totalPages - 1)) * 100);

  // Handle time tracking for free users
  useEffect(() => {
    if (!isPremium && remainingTime) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            toast({
              title: "Tempo de leitura esgotado",
              description: "Seu tempo de leitura gratuito para hoje acabou.",
              variant: "destructive",
            });
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPremium, remainingTime, onClose, toast]);

  // Save progress periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      onSaveProgress(page);
    }, 30000); // Every 30 seconds

    return () => clearInterval(saveInterval);
  }, [page, onSaveProgress]);

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      handleNextPage();
    } else if (e.key === "ArrowLeft") {
      handlePrevPage();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [page, totalPages]);

  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 2);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 2);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${secs}s`;
  };

  return (
    <div className={`book-reader ${isFullscreen ? 'fixed inset-0 z-50' : 'relative w-full h-full'} bg-white`}>
      {/* Reader header */}
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <CustomButton variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </CustomButton>
          <div className="ml-4">
            <h3 className="text-base font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{author}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isPremium && remainingTime !== undefined && (
            <div className="flex items-center mr-4 text-sm">
              <Clock className="h-4 w-4 mr-1 text-orange-500" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          )}

          <CustomButton variant="ghost" size="sm" onClick={() => {}}>
            <Bookmark className="h-4 w-4 mr-1" />
            Marcar
          </CustomButton>
          
          <CustomButton variant="ghost" size="sm" onClick={() => {}}>
            <Settings className="h-4 w-4 mr-1" />
            Configurações
          </CustomButton>
        </div>
      </header>

      {/* Reader content */}
      <div 
        className="p-4 md:p-8 lg:p-12 max-w-4xl mx-auto"
        style={{ fontSize: `${fontSize}px` }}
      >
        <div className="reader-content min-h-[60vh] leading-relaxed">
          {content[page]}
        </div>
      </div>

      {/* Reader footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={decreaseFontSize}
              className="text-sm px-2 py-1 border rounded"
            >
              A-
            </button>
            <div className="flex-1 mx-4">
              <Progress value={progress} className="h-2" />
            </div>
            <button 
              onClick={increaseFontSize}
              className="text-sm px-2 py-1 border rounded"
            >
              A+
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <CustomButton 
              variant="outline" 
              size="sm" 
              onClick={handlePrevPage}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </CustomButton>
            
            <span className="text-sm text-muted-foreground">
              Página {page + 1} de {totalPages}
            </span>
            
            <CustomButton 
              variant="outline" 
              size="sm" 
              onClick={handleNextPage}
              disabled={page === totalPages - 1}
            >
              Próxima
              <ChevronRight className="h-4 w-4 ml-1" />
            </CustomButton>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookReader;
