'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Sparkles, User, Bot } from 'lucide-react';
import type { UIDocument } from '@/types';
import { answerDocumentQuestion } from '@/ai/flows/document-qa';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface DocumentQADialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: UIDocument;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export function DocumentQADialog({ isOpen, onClose, document }: DocumentQADialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await answerDocumentQuestion({
        documentContent: document.content || '',
        question: inputValue,
      });
      const aiMessage: Message = { sender: 'ai', text: result.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error answering question:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get an answer from the AI.',
      });
      // Optionally add a message to the chat indicating an error
      setMessages((prev) => [...prev, {sender: 'ai', text: "Sorry, I couldn't process that question."}])
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle>Ask AI about "{document.name}"</DialogTitle>
          <DialogDescription>
            Chat with an AI assistant to find information in this document.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-4 pr-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                    {message.sender === 'ai' && (
                        <div className="p-2 rounded-full bg-primary/10 text-primary"><Bot className="h-5 w-5" /></div>
                    )}
                  <div
                    className={cn(
                      'rounded-lg p-3 max-w-sm',
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                   {message.sender === 'user' && (
                        <div className="p-2 rounded-full bg-muted"><User className="h-5 w-5" /></div>
                    )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                    <div className="p-2 rounded-full bg-primary/10 text-primary"><Bot className="h-5 w-5" /></div>
                    <div className="rounded-lg p-3 bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Ask a question about the document..."
                className="pr-12"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-10"
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
