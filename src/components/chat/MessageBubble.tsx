import React, { useState } from 'react';
import { User, Bot, Copy, Check } from '../ui/icons';
import { MessageContent } from './MessageContent';
import type { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };





  if (isUser) {
    return (
      <div className="flex items-start space-x-3 mb-6 justify-end px-4 sm:px-6">
        <div className="flex-1 max-w-3xl flex justify-end">
          <div className="group relative max-w-[85%] sm:max-w-[75%]">
            <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 shadow-md ml-auto">
              <MessageContent content={message.content} />
            </div>
            
            <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-background/95 backdrop-blur-sm rounded-lg border border-border flex items-center shadow-lg">
              <button
                onClick={handleCopy}
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
                aria-label="Copy message"
                title="Copy message"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md flex-shrink-0">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 mb-6 px-4 sm:px-6">
      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-sm flex-shrink-0">
        <Bot className="w-4 h-4 text-slate-600 dark:text-slate-300" />
      </div>
      
      <div className="flex-1 max-w-3xl">
        <div className="group relative max-w-[85%] sm:max-w-[75%]">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <MessageContent content={message.content} />
          </div>
          
          <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-background/95 backdrop-blur-sm rounded-lg border border-border flex items-center shadow-lg">
            <button
              onClick={handleCopy}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center"
              aria-label="Copy message"
              title="Copy message"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
