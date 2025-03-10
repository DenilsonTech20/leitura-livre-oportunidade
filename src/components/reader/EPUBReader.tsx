
import React from 'react';
import { Button } from '@/components/ui/button';

interface EPUBReaderProps {
  url: string;
  title: string;
  author: string;
  onClose: () => void;
}

const EPUBReader = ({ url, title, author, onClose }: EPUBReaderProps) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <Button variant="outline" size="sm" onClick={onClose}>Fechar</Button>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{author}</p>
        </div>
      </div>
      
      <div className="flex-grow overflow-auto flex justify-center items-center p-4">
        {/* In a real implementation, you would use an EPUB reader library */}
        <div className="text-center">
          <p>EPUB reader implementation would go here.</p>
          <p className="text-sm text-muted-foreground mt-2">
            This is a placeholder. In a production app, integrate a full EPUB reader library.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EPUBReader;
