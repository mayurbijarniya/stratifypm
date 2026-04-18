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
        <div className="flex-1 flex justify-end">
          <div className="group relative max-w-[85%] sm:max-w-[75%]">
            <div className={`bg-black dark:bg-zinc-100 text-zinc-50 dark:text-black rounded-none border-2 border-zinc-900 dark:border-zinc-100 px-6 py-4 shadow-none`}>
              <MessageContent content={message.content} isUser={true} />
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
        
        <div className="w-8 h-8 rounded-none border-2 border-zinc-900 dark:border-zinc-100 bg-chartreuse flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#f4f4f5]">
          <User className="w-4 h-4 text-zinc-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 mb-6 px-4 sm:px-6">
      <div className="w-8 h-8 rounded-none border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#f4f4f5]">
        <Bot className="w-4 h-4 text-zinc-50 dark:text-zinc-900" />
      </div>
      
      <div className="flex-1">
        <div className="group relative max-w-[95%] sm:max-w-[85%]">
          <div className={`bg-zinc-50 dark:bg-black border-2 border-zinc-900 dark:border-zinc-100 rounded-none px-6 py-4 shadow-none text-black dark:text-zinc-50`}>
            <MessageContent content={message.content} isUser={false} />
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
