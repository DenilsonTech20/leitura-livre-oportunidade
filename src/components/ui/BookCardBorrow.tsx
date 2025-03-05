
import React, { useState } from "react";
import { Star, Headphones, BookOpen } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { cn } from "@/lib/utils";
import BorrowBookModal from "@/components/modals/BorrowBookModal";

interface BookCardBorrowProps {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  format: "ebook" | "audio" | "both";
  available?: boolean;
  className?: string;
}

const BookCardBorrow = ({
  id,
  title,
  author,
  cover,
  rating,
  format = "ebook",
  available = true,
  className,
}: BookCardBorrowProps) => {
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  
  // In a real app, this would come from your authentication context
  const isPremium = localStorage.getItem('userSubscription') === 'premium';
  
  const handleBorrowClick = () => {
    setShowBorrowModal(true);
  };
  
  return (
    <>
      <div className={cn("book-card h-full flex flex-col rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100", className)}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={cover}
            alt={`Capa de ${title}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          
          {format !== "ebook" && (
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
          )}
          
          {format !== "audio" && (
            <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          )}
        </div>
        
        <div className="flex-grow p-4 flex flex-col">
          <h3 className="font-medium text-base line-clamp-2 mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{author}</p>
          
          <div className="flex items-center mt-auto mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={cn(
                  i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                )}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-2">{rating.toFixed(1)}</span>
          </div>
          
          <CustomButton
            size="sm"
            disabled={!available}
            className="w-full"
            onClick={handleBorrowClick}
          >
            {available ? "Emprestar" : "Indisponível"}
          </CustomButton>
        </div>
      </div>
      
      {showBorrowModal && (
        <BorrowBookModal
          bookId={id}
          title={title}
          author={author}
          cover={cover}
          format={format}
          isOpen={showBorrowModal}
          onClose={() => setShowBorrowModal(false)}
          isPremium={isPremium}
        />
      )}
    </>
  );
};

export default BookCardBorrow;
