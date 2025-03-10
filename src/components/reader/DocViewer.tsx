
import React from 'react';
import { FileType } from '@prisma/client';
import { Button } from '@/components/ui/button';

interface DocViewerProps {
  url: string;
  fileType: FileType;
  onClose: () => void;
}

const DocViewer = ({ url, fileType, onClose }: DocViewerProps) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <Button variant="outline" size="sm" onClick={onClose}>Fechar</Button>
        <span className="text-sm font-medium">
          {fileType === 'DOCX' ? 'Documento Word' : 'Apresentação PowerPoint'}
        </span>
      </div>
      
      <div className="flex-grow overflow-auto flex justify-center items-center p-4">
        <iframe 
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
          width="100%" 
          height="100%" 
          className="border-none"
        />
      </div>
    </div>
  );
};

export default DocViewer;
