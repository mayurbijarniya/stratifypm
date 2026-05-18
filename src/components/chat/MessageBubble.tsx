import React, { useState } from 'react';
import { User, Bot, Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, Edit, X, CheckCircle } from '../ui/icons';
import { MessageContent } from './MessageContent';
import { useAppStore } from '../../stores/appStore';
import type { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const isUser = message.role === 'user';

  const {
    updateMessage,
    setConversationLoading,
    currentConversationId,
  } = useAppStore();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(message.content);
  };

  const handleSaveEdit = () => {
    if (!editContent.trim() || !currentConversationId) return;
    updateMessage(currentConversationId, message.id, { content: editContent.trim() });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleRegenerate = () => {
    if (!currentConversationId) return;
    // Delete all assistant messages after this user message
    const conversation = useAppStore.getState().getCurrentConversation();
    if (!conversation) return;

    const msgIndex = conversation.messages.findIndex((m) => m.id === message.id);
    if (msgIndex === -1) return;

    // Remove all messages after this one
    const newMessages = conversation.messages.slice(0, msgIndex + 1);
    useAppStore.getState().updateConversation(currentConversationId, { messages: newMessages });
    setConversationLoading(currentConversationId, true);
  };

  if (isUser) {
    return (
      <div className="flex items-start space-x-3 mb-6 justify-end px-4 sm:px-6">
        <div className="flex-1 flex justify-end">
          <div className="group relative max-w-[85%] sm:max-w-[75%]">
            {isEditing ? (
              <div className="bg-black dark:bg-zinc-100 text-zinc-50 dark:text-black rounded-none border-2 border-zinc-900 dark:border-zinc-100 px-4 py-3 shadow-none">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-transparent text-inherit resize-none focus:outline-none text-sm"
                  rows={3}
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2 mt-2">
                  <button
                    onClick={handleCancelEdit}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-black dark:bg-zinc-100 text-zinc-50 dark:text-black rounded-none border-2 border-zinc-900 dark:border-zinc-100 px-6 py-4 shadow-none">
                  <MessageContent content={message.content} isUser={true} />
                </div>

                <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-background/95 backdrop-blur-sm rounded-lg border border-border flex items-center shadow-lg">
                  <button
                    onClick={handleEdit}
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
                    aria-label="Edit message"
                    title="Edit message"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleCopy}
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
                    aria-label="Copy message"
                    title="Copy message"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </>
            )}
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
          <div className="bg-zinc-50 dark:bg-black border-2 border-zinc-900 dark:border-zinc-100 rounded-none px-6 py-4 shadow-none text-black dark:text-zinc-50">
            <MessageContent content={message.content} isUser={false} />
          </div>

          <div className="absolute -right-2 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-background/95 backdrop-blur-sm rounded-lg border border-border flex items-center shadow-lg">
            <button
              onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
              className={`h-8 w-8 rounded-lg transition-colors flex items-center justify-center ${
                feedback === 'up' ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
              }`}
              aria-label="Thumbs up"
              title="Helpful"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
              className={`h-8 w-8 rounded-lg transition-colors flex items-center justify-center ${
                feedback === 'down' ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
              }`}
              aria-label="Thumbs down"
              title="Not helpful"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleRegenerate}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
              aria-label="Regenerate"
              title="Regenerate response"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleCopy}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
              aria-label="Copy message"
              title="Copy message"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
