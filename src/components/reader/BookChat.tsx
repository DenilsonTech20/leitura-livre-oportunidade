
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Bot, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { askGemini } from '@/lib/gemini';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface BookChatProps {
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  onClose: () => void;
}

const BookChat = ({ bookId, bookTitle, bookAuthor, onClose }: BookChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Olá! Sou seu assistente para o livro "${bookTitle}" de ${bookAuthor}. Como posso ajudar você hoje?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const context = `O usuário está lendo o livro "${bookTitle}" de ${bookAuthor} e tem uma pergunta sobre o conteúdo.`;
      const response = await askGemini(input, context);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response from Gemini:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, não consegui processar sua pergunta. Por favor, tente novamente mais tarde.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border-l border-gray-200 bg-white">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <Bot className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-medium">Assistente de Leitura</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <div className="flex items-start mb-1">
                {message.sender === 'bot' ? (
                  <Bot className="h-4 w-4 mr-1 mt-0.5" />
                ) : (
                  <User className="h-4 w-4 mr-1 mt-0.5" />
                )}
                <span className="text-xs opacity-70">
                  {message.sender === 'user' ? 'Você' : 'Assistente'}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t flex">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Digite sua pergunta sobre o livro..."
          className="flex-grow"
          disabled={loading}
        />
        <Button type="submit" size="icon" className="ml-2" disabled={loading}>
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default BookChat;
