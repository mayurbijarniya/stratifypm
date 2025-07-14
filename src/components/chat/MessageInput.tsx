import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Square, Sparkles, Zap, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { FileUpload } from '../features/FileUpload';
import { ModelSelector } from '../ui/ModelSelector';
import { useAppStore } from '../../stores/appStore';
import { aiService } from '../../utils/aiService';

interface MessageInputProps {
  conversationId: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const [message, setMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    addMessage, 
    setConversationLoading, 
    setConversationStreaming, 
    setConversationAbortController,
    stopConversationAI,
    getConversationState,
    getCurrentConversation,
    selectedModel,
    setSelectedModel
  } = useAppStore();
  
  // Get conversation-specific state
  const { isLoading, streamingMessage } = getConversationState(conversationId);

  // Auto-trigger AI response when loading state changes and there's a new user message
  useEffect(() => {
    const handleAIResponse = async () => {
      // Only proceed if this conversation is loading
      if (!isLoading) return;
      
      const conversation = getCurrentConversation();
      // Ensure we're working with the correct conversation
      if (!conversation || conversation.id !== conversationId) return;
      
      // Check if there are messages and the last one is from user
      if (conversation.messages.length === 0) return;
      
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      
      // Only respond to user messages, and avoid duplicate responses
      if (lastMessage.role !== 'user') return;
      
      // Check if the last user message already has an assistant response
      // Look for the next message after the last user message
      const lastUserMessageIndex = conversation.messages.length - 1;
      const nextMessage = conversation.messages[lastUserMessageIndex + 1];
      const hasAssistantResponse = nextMessage && nextMessage.role === 'assistant';
      
      if (hasAssistantResponse) {
        // Clear loading state if there's already a response
        setConversationLoading(conversationId, false);
        return;
      }

      // Create abort controller for this request
      const abortController = new AbortController();
      setConversationAbortController(conversationId, abortController);

      try {
        // Get conversation history for context (excluding the last message since it's the current one)
        const conversationHistory = conversation.messages.slice(0, -1).map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Stream AI response
        const response = await aiService.sendMessage(
          lastMessage.content,
          selectedModel,
          conversationHistory,
          (streamContent: string) => {
            // Check if request was aborted
            if (abortController.signal.aborted) return;
            setConversationStreaming(conversationId, streamContent);
          },
          abortController.signal // Pass abort signal
        );

        // Check if request was aborted before adding final message
        if (abortController.signal.aborted) return;

        // Clear streaming and add final message
        setConversationStreaming(conversationId, null);
        addMessage(conversationId, {
          content: response,
          role: 'assistant',
          metadata: {
            model: 'AI Assistant',
            tokens: response.length,
            context: 'general',
          },
        });
      } catch (error) {
        // Don't show error if request was aborted
        if (error instanceof Error && error.message === 'Request aborted') {
          console.log('Request was aborted by user');
          setConversationStreaming(conversationId, null);
          return;
        }
        
        console.error('Error sending message:', error);
        setConversationStreaming(conversationId, null);
        addMessage(conversationId, {
          content: 'I apologize, but I encountered an error processing your request. Please check your connection and try again.',
          role: 'assistant',
        });
      } finally {
        setConversationLoading(conversationId, false);
        setConversationStreaming(conversationId, null);
        setConversationAbortController(conversationId, null);
      }
    };

    handleAIResponse();
  }, [isLoading, conversationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
    }
    
    // Add user message
    addMessage(conversationId, {
      content: userMessage,
      role: 'user',
    });

    // Set loading state (this will trigger the AI response via useEffect)
    setConversationLoading(conversationId, true);
  };

  const handleStop = () => {
    console.log(`Stop button clicked for conversation ${conversationId}`);
    
    // Immediately clear streaming to stop visual output
    setConversationStreaming(conversationId, null);
    
    // Stop the AI processing
    stopConversationAI(conversationId);
    
    console.log(`AI response stopped for conversation ${conversationId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
    // Add Cmd/Ctrl+Enter as alternative send shortcut
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '48px'; // Start with smaller height
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`; // Max 100px instead of 120px
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const handleFileProcessed = (analysisPrompt: string) => {
    setMessage(analysisPrompt);
    setShowFileUpload(false);
    // Auto-focus the textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const quickSuggestions = [
    'Create a competitive analysis',
    'Help me prioritize features',
    'Design user research study',
    'Build KPI dashboard',
  ];

  // Check if this is a new conversation (no messages yet)
  const conversation = getCurrentConversation();
  const isNewConversation = !conversation || conversation.messages.length === 0;

  // Animated suggestions for "Try suggestions:" section
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [suggestionText, setSuggestionText] = useState('');
  const [isSuggestionTyping, setIsSuggestionTyping] = useState(true);

  useEffect(() => {
    if (!isNewConversation) return; // Don't animate if not a new conversation

    const currentSuggestionText = quickSuggestions[currentSuggestion];
    
    if (isSuggestionTyping) {
      if (suggestionText.length < currentSuggestionText.length) {
        const timer = setTimeout(() => {
          setSuggestionText(currentSuggestionText.slice(0, suggestionText.length + 1));
        }, 80);
        return () => clearTimeout(timer);
      } else {
        // Finished typing, wait then start deleting
        const timer = setTimeout(() => {
          setIsSuggestionTyping(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      if (suggestionText.length > 0) {
        const timer = setTimeout(() => {
          setSuggestionText(suggestionText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timer);
      } else {
        // Finished deleting, move to next suggestion
        setCurrentSuggestion((prev) => (prev + 1) % quickSuggestions.length);
        setIsSuggestionTyping(true);
      }
    }
  }, [suggestionText, isSuggestionTyping, currentSuggestion, isNewConversation]);

  return (
    <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-6 py-4 sm:py-6">
        {showFileUpload && (
          <div className="mb-4">
            <FileUpload 
              onClose={() => setShowFileUpload(false)} 
              onFileProcessed={handleFileProcessed}
            />
          </div>
        )}
        
        {/* Try Suggestions - Only show for new conversations */}
        {isNewConversation && (
          <div className="mb-4 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Try: </span>
              <button 
                onClick={() => setMessage(suggestionText)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline-offset-2 hover:underline cursor-pointer transition-colors duration-200"
              >
                {suggestionText}
                {isSuggestionTyping ? <span className="animate-pulse ml-0.5">|</span> : ''}
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative">
          {/* Unified Container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
            {/* Text Input Area - Top Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300"></div>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about product strategy, roadmapping, user research, or any PM topic..."
                disabled={isLoading}
                className="relative w-full px-6 py-3 resize-none focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 transition-all duration-200 text-base leading-relaxed min-h-[48px]"
                rows={1}
                style={{ maxHeight: '100px' }}
              />
            </div>
            
            {/* Button Row - Bottom Section */}
            <div className="flex items-center px-4 py-3 border-t border-gray-200/50 dark:border-gray-700/50">
              {/* File Upload Button */}
              <button
                type="button"
                onClick={() => setShowFileUpload(!showFileUpload)}
                disabled={isLoading}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
              >
                <Paperclip className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              </button>

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Model Selector */}
              <div className="relative mr-2">
                <button
                  type="button"
                  onClick={() => setShowModelSelector(!showModelSelector)}
                  disabled={isLoading}
                  className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                >
                  <div className="flex items-center">
                    <img 
                      src={selectedModel === 'claude' ? '/claude-color.svg' : '/gemini-color.svg'}
                      alt={selectedModel === 'claude' ? 'Claude' : 'Gemini'}
                      className="w-4 h-4 mr-2"
                    />
                    <span>{selectedModel === 'claude' ? 'Claude 4.0 Sonnet' : 'Gemini 2.5 Pro'}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                
                {showModelSelector && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedModel('claude');
                        setShowModelSelector(false);
                      }}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <img src="/claude-color.svg" alt="Claude" className="w-4 h-4 mr-2" />
                      <span>Claude 4.0 Sonnet</span>
                      {selectedModel === 'claude' && <div className="w-2 h-2 bg-blue-600 rounded-full ml-auto"></div>}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedModel('gemini');
                        setShowModelSelector(false);
                      }}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <img src="/gemini-color.svg" alt="Gemini" className="w-4 h-4 mr-2" />
                      <span>Gemini 2.5 Pro</span>
                      {selectedModel === 'gemini' && <div className="w-2 h-2 bg-blue-600 rounded-full ml-auto"></div>}
                    </button>
                  </div>
                )}
              </div>

              {/* Send/Stop Button */}
              <button
                type={isLoading ? 'button' : 'submit'}
                onClick={isLoading ? handleStop : undefined}
                disabled={!isLoading && !message.trim()}
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isLoading
                    ? 'text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-gray-800'
                    : message.trim()
                    ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-gray-800'
                    : 'text-gray-400 bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Square className="w-4 h-4 fill-current" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Compact Footer info */}
        <div className="flex items-center justify-center mt-3 text-xs text-gray-500 dark:text-gray-400">
          <Zap className="w-3 h-3 mr-1" />
          Powered by {selectedModel === 'claude' ? 'Claude 4.0 Sonnet' : 'Gemini 2.5 Pro'}. AI can make mistakes. Always verify important information and strategic decisions.
        </div>
      </div>
    </div>
  );
};