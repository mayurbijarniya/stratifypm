import React from 'react';
import { Bot } from '../ui/icons';
import { MessageContent } from './MessageContent';

interface StreamingMessageProps {
  content: string;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({ content }) => {
  return (
    <div className="flex items-start space-x-3 mb-6">
      <div className="w-8 h-8 rounded-none border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#f4f4f5]">
        <Bot className="w-4 h-4 text-zinc-50 dark:text-zinc-900" />
      </div>
      
      <div className="flex-1 max-w-[95%] sm:max-w-[85%]">
        <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
          <MessageContent content={content} />
          
          {/* Typing indicator */}
          <div className="flex items-center space-x-2 mt-4">
            <div className="w-2 h-4 bg-zinc-900 dark:bg-zinc-100 animate-pulse rounded-none" />
            <span className="text-xs text-muted-foreground">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
