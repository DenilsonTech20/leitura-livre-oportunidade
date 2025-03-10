
import React, { useState, useEffect } from 'react';
import PDFReader from './PDFReader';
import DocViewer from './DocViewer';
import EPUBReader from './EPUBReader';
import { FileType } from '@prisma/client';

interface FileReaderProps {
  fileUrl: string;
  fileType: FileType;
  title: string;
  author: string;
  onClose: () => void;
  isPremium: boolean;
  remainingTime?: number;
  onTimeUpdate?: (timeRemaining: number) => void;
}

const FileReader = ({
  fileUrl,
  fileType,
  title,
  author,
  onClose,
  isPremium,
  remainingTime,
  onTimeUpdate
}: FileReaderProps) => {
  const [timeLeft, setTimeLeft] = useState(remainingTime || 0);

  // Handle time tracking for free users
  useEffect(() => {
    if (!isPremium && remainingTime) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          
          // Update parent component every second
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPremium, remainingTime, onClose, onTimeUpdate]);

  // Format time from seconds to readable format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="h-full flex flex-col">
      {!isPremium && remainingTime && (
        <div className="bg-amber-50 text-amber-800 p-2 text-center text-sm">
          Tempo restante de leitura hoje: {formatTime(timeLeft)}
        </div>
      )}
      
      <div className="flex-grow">
        {fileType === 'PDF' && <PDFReader url={fileUrl} onClose={onClose} />}
        {(fileType === 'DOCX' || fileType === 'PPT') && 
          <DocViewer 
            url={fileUrl} 
            fileType={fileType} 
            onClose={onClose} 
          />
        }
        {fileType === 'EPUB' && 
          <EPUBReader 
            url={fileUrl} 
            title={title} 
            author={author} 
            onClose={onClose} 
          />
        }
        {fileType === 'OTHER' && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <h3 className="text-xl font-medium mb-2">Formato não suportado</h3>
              <p>Este tipo de arquivo não pode ser visualizado diretamente no navegador.</p>
              <button 
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
              >
                Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileReader;
