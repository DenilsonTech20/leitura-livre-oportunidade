
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, BookOpen, Calendar, Clock, AlertCircle } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import { useToast } from "@/hooks/use-toast";

interface BorrowBookModalProps {
  bookId: string;
  title: string;
  author: string;
  cover: string;
  format: "ebook" | "audio" | "both";
  isOpen: boolean;
  onClose: () => void;
  isPremium?: boolean;
}

const BorrowBookModal = ({
  bookId,
  title,
  author,
  cover,
  format,
  isOpen,
  onClose,
  isPremium = false,
}: BorrowBookModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // In a real app, this would come from your subscription context
  // and would include different durations based on plan
  const borrowDuration = isPremium ? 30 : 7; // days
  
  if (!isOpen) return null;
  
  const handleBorrow = async () => {
    setLoading(true);
    
    try {
      // Simulate API call to create a loan
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to create a loan record
      // Example: await createLoan({ bookId, userId, dueDate });
      
      toast({
        title: "Livro emprestado com sucesso!",
        description: `Você tem acesso a "${title}" por ${borrowDuration} dias.`,
      });
      
      // Close modal
      onClose();
      
      // Redirect to dashboard/emprestados
      navigate("/dashboard/emprestados");
    } catch (error) {
      console.error("Erro ao emprestar livro:", error);
      toast({
        title: "Erro ao emprestar livro",
        description: "Ocorreu um erro ao tentar emprestar este livro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleReadNow = () => {
    // Create loan and then navigate to reader
    handleBorrow().then(() => {
      navigate(`/livro/${bookId}`);
    });
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium">Emprestar Livro</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <img
              src={cover}
              alt={`Capa de ${title}`}
              className="h-32 w-24 object-cover rounded-md flex-shrink-0"
            />
            <div>
              <h4 className="font-medium text-lg">{title}</h4>
              <p className="text-gray-600 mb-2">{author}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>
                  {format === "ebook" && "E-book"}
                  {format === "audio" && "Audiolivro"}
                  {format === "both" && "E-book + Audiolivro"}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Empréstimo por {borrowDuration} dias</span>
              </div>
            </div>
          </div>
          
          {!isPremium && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Plano Gratuito</p>
                <p className="text-sm text-amber-700">
                  Você tem até 2 horas de leitura por dia. Considere fazer upgrade para o plano Premium para leitura ilimitada.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            <CustomButton
              onClick={handleBorrow}
              loading={loading}
              className="flex-1"
            >
              Emprestar
            </CustomButton>
            
            <CustomButton
              variant="outline"
              onClick={handleReadNow}
              loading={loading}
              className="flex-1"
            >
              Ler agora
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowBookModal;
