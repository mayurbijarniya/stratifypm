import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Conversation, Message, FileData } from '../types';
import { useAuthStore } from './authStore';
import {
  createConversation as createConversationApi,
  upsertConversation,
  deleteConversation as deleteConversationApi,
  clearConversations as clearConversationsApi,
} from '../utils/conversationApi';
import type { AIModel } from '../components/ui/ModelSelector';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  selectedFeature: string | null;
  selectedModel: AIModel;

  // Conversations
  conversations: Conversation[];
  currentConversationId: string | null;

  // Per-conversation AI state
  conversationStates: Record<string, {
    isLoading: boolean;
    streamingMessage: string | null;
    abortController: AbortController | null;
    lastProcessedMessageId: string | null;
  }>;

  // Web search cache status
  webSearchCacheActive: boolean;

  // Files
  uploadedFiles: FileData[];

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSelectedFeature: (feature: string | null) => void;
  setSelectedModel: (model: AIModel) => void;

  // Conversation actions
  createConversation: (title?: string) => string;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  clearAllConversations: () => void;
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (id: string | null) => void;

  // Message actions
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;

  // Per-conversation AI state actions
  setConversationLoading: (conversationId: string, loading: boolean) => void;
  setConversationStreaming: (conversationId: string, content: string | null) => void;
  setConversationAbortController: (conversationId: string, controller: AbortController | null) => void;
  setConversationLastProcessedMessage: (conversationId: string, messageId: string | null) => void;
  stopConversationAI: (conversationId: string) => void;
  getConversationState: (conversationId: string) => { isLoading: boolean; streamingMessage: string | null; abortController: AbortController | null; lastProcessedMessageId: string | null; };

  // File actions
  addFile: (file: FileData) => void;
  removeFile: (fileName: string) => void;
  updateFile: (fileName: string, updates: Partial<FileData>) => void;

  // Utility
  getCurrentConversation: () => Conversation | null;
}

// Custom storage with Date object handling
const customStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;

    try {
      return JSON.parse(str, (key, value) => {
        // Convert timestamp, createdAt, and updatedAt strings back to Date objects
        if ((key === 'timestamp' || key === 'createdAt' || key === 'updatedAt') && typeof value === 'string') {
          const date = new Date(value);
          return isNaN(date.getTime()) ? new Date() : date;
        }
        return value;
      });
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

const getAuthToken = () => useAuthStore.getState().token;

const syncConversationRemote = (conversation: Conversation) => {
  // Save if we have a token (auth status might still be 'checking' after sign-in)
  const token = getAuthToken();
  if (!token) return;
  void upsertConversation(token, conversation).catch(() => {});
};

const createConversationRemote = (conversation: Conversation) => {
  // Save if we have a token
  const token = getAuthToken();
  if (!token) return;
  void createConversationApi(token, conversation).catch(() => {});
};

const deleteConversationRemote = (conversationId: string) => {
  // Delete if we have a token
  const token = getAuthToken();
  if (!token) return;
  void deleteConversationApi(token, conversationId).catch(() => {});
};

const clearConversationsRemote = () => {
  // Clear if we have a token
  const token = getAuthToken();
  if (!token) return;
  void clearConversationsApi(token).catch(() => {});
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarOpen: false,
      theme: 'light',
      selectedFeature: null,
      selectedModel: 'claude' as AIModel,
      conversations: [],
      currentConversationId: null,
      conversationStates: {},
      uploadedFiles: [],
      webSearchCacheActive: false,

      // Expose store globally for AI service access
      ...(typeof window !== 'undefined' && (() => {
        (window as unknown as { __APP_STORE__: { getState: typeof get } }).__APP_STORE__ = { getState: get };
        return {};
      })()),

      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      setSelectedFeature: (feature) => set({ selectedFeature: feature }),
      setSelectedModel: (model) => set({ selectedModel: model }),

      createConversation: (title = 'New Conversation') => {
        const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newConversation: Conversation = {
          id,
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          // Inherit currently uploaded files (pending files) if any
          files: get().uploadedFiles || [],
        };

        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
          selectedFeature: null, // Clear selected feature when creating new conversation
          // Initialize conversation state
          conversationStates: {
            ...state.conversationStates,
            [id]: {
              isLoading: false,
              streamingMessage: null,
              abortController: null,
              lastProcessedMessageId: null,
            }
          },
          // IMPORTANT: Do NOT clear uploadedFiles here. 
          // They are now part of the new conversation and we want them to remain visible.
          // The next time 'createConversation' is called (from a fresh state), uploadedFiles should be empty via UI logic or explicit reset if dealing with "New Chat" button click.
        }));

        createConversationRemote(newConversation);

        return id;
      },

      updateConversation: (id, updates) => {
        let updatedConversation: Conversation | null = null;
        set((state) => {
          const conversations = state.conversations.map((conv) => {
            if (conv.id !== id) return conv;
            updatedConversation = { ...conv, ...updates, updatedAt: new Date() };
            return updatedConversation;
          });
          return { conversations };
        });
        if (updatedConversation) {
          syncConversationRemote(updatedConversation);
        }
      },

      deleteConversation: (id) => {
        set((state) => {
          // Clean up conversation state
          const newConversationStates = { ...state.conversationStates };
          if (newConversationStates[id]?.abortController) {
            newConversationStates[id].abortController.abort();
          }
          delete newConversationStates[id];

          return {
            conversations: state.conversations.filter((conv) => conv.id !== id),
            currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
            conversationStates: newConversationStates,
          };
        });

        deleteConversationRemote(id);
      },

      clearAllConversations: () => {
        set((state) => {
          // Abort all active requests
          Object.values(state.conversationStates).forEach(convState => {
            if (convState.abortController) {
              convState.abortController.abort();
            }
          });

          return {
            conversations: [],
            currentConversationId: null,
            conversationStates: {},
          };
        });

        clearConversationsRemote();
      },

      setConversations: (conversations) => {
        set((state) => {
          const conversationStates = conversations.reduce((acc, conv) => {
            acc[conv.id] = state.conversationStates[conv.id] || {
              isLoading: false,
              streamingMessage: null,
              abortController: null,
              lastProcessedMessageId: null,
            };
            return acc;
          }, {} as AppState['conversationStates']);

          const currentConversationId = state.currentConversationId &&
            conversations.some((conv) => conv.id === state.currentConversationId)
            ? state.currentConversationId
            : null;
          const currentConversation = currentConversationId
            ? conversations.find((conv) => conv.id === currentConversationId) || null
            : null;

          return {
            conversations,
            currentConversationId,
            conversationStates,
            selectedFeature: null,
            uploadedFiles: currentConversation?.files || [],
          };
        });
      },

      setCurrentConversation: (id) => {
        set((state) => {
          // If setting to null (New Chat), we want a clean slate
          // Use !id to catch both null and undefined
          if (!id) {
            return {
              currentConversationId: null,
              uploadedFiles: [], // EXPLICITLY clear files for new chat
            };
          }

          // Initialize conversation state if it doesn't exist
          const newConversationStates = { ...state.conversationStates };
          if (!newConversationStates[id]) {
            newConversationStates[id] = {
              isLoading: false,
              streamingMessage: null,
              abortController: null,
              lastProcessedMessageId: null,
            };
          }

          const targetConv = state.conversations.find(c => c.id === id);

          return {
            currentConversationId: id,
            conversationStates: newConversationStates,
            // Sync global files state with selected conversation's files
            uploadedFiles: targetConv?.files || [],
          };
        });
      },


      addMessage: (conversationId, message) => {
        const newMessage: Message = {
          ...message,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };

        let updatedConversation: Conversation | null = null;
        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id !== conversationId) return conv;
            updatedConversation = {
              ...conv,
              messages: [...conv.messages, newMessage],
              updatedAt: new Date(),
              // Update title based on first user message
              title: conv.messages.length === 0 && message.role === 'user'
                ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
                : conv.title
            };
            return updatedConversation;
          }),
        }));
        if (updatedConversation) {
          syncConversationRemote(updatedConversation);
        }
      },

      updateMessage: (conversationId, messageId, updates) => {
        let updatedConversation: Conversation | null = null;
        set((state) => ({
          conversations: state.conversations.map((conv) => {
            if (conv.id !== conversationId) return conv;
            updatedConversation = {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === messageId ? { ...msg, ...updates } : msg
              ),
              updatedAt: new Date(),
            };
            return updatedConversation;
          }),
        }));
        if (updatedConversation) {
          syncConversationRemote(updatedConversation);
        }
      },

      // Per-conversation AI state management
      setConversationLoading: (conversationId, loading) => {
        set((state) => ({
          conversationStates: {
            ...state.conversationStates,
            [conversationId]: {
              ...state.conversationStates[conversationId],
              isLoading: loading,
            }
          }
        }));
      },

      setConversationStreaming: (conversationId, content) => {
        set((state) => ({
          conversationStates: {
            ...state.conversationStates,
            [conversationId]: {
              ...state.conversationStates[conversationId],
              streamingMessage: content,
            }
          }
        }));
      },

      setConversationAbortController: (conversationId, controller) => {
        set((state) => ({
          conversationStates: {
            ...state.conversationStates,
            [conversationId]: {
              ...state.conversationStates[conversationId],
              abortController: controller,
            }
          }
        }));
      },

      setConversationLastProcessedMessage: (conversationId, messageId) => {
        set((state) => ({
          conversationStates: {
            ...state.conversationStates,
            [conversationId]: {
              ...state.conversationStates[conversationId],
              lastProcessedMessageId: messageId,
            }
          }
        }));
      },

      stopConversationAI: (conversationId) => {
        set((state) => {
          const conversationState = state.conversationStates[conversationId];

          if (conversationState?.abortController) {
            conversationState.abortController.abort();
          }

          return {
            conversationStates: {
              ...state.conversationStates,
              [conversationId]: {
                ...conversationState,
                isLoading: false,
                streamingMessage: null,
                abortController: null,
                lastProcessedMessageId: conversationState?.lastProcessedMessageId || null,
              }
            }
          };
        });
      },

      getConversationState: (conversationId) => {
        const state = get();
        const conversationState = state.conversationStates[conversationId];
        return {
          isLoading: conversationState?.isLoading || false,
          streamingMessage: conversationState?.streamingMessage || null,
          abortController: conversationState?.abortController || null,
          lastProcessedMessageId: conversationState?.lastProcessedMessageId || null,
        };
      },

      // File actions - scoped to conversation if active, otherwise global (pending)
      addFile: (file) => {
        set((state) => {
          const currentId = state.currentConversationId;

          // If no active conversation, just update global state (pending files)
          if (!currentId) {
            return {
              uploadedFiles: [...state.uploadedFiles, file]
            };
          }

          // If active conversation, update conversation AND sync global
          const updatedConversations = state.conversations.map(conv =>
            conv.id === currentId
              ? { ...conv, files: [...(conv.files || []), file] }
              : conv
          );
          const updatedConversation = updatedConversations.find(conv => conv.id === currentId) || null;
          if (updatedConversation) {
            syncConversationRemote(updatedConversation);
          }
          return {
            conversations: updatedConversations,
            uploadedFiles: [...state.uploadedFiles, file]
          };
        });
      },

      removeFile: (fileName) => {
        set((state) => {
          const currentId = state.currentConversationId;

          // If no active conversation, just update global state
          if (!currentId) {
            return {
              uploadedFiles: state.uploadedFiles.filter(f => f.name !== fileName)
            };
          }

          const updatedConversations = state.conversations.map(conv =>
            conv.id === currentId
              ? { ...conv, files: (conv.files || []).filter(f => f.name !== fileName) }
              : conv
          );
          const updatedConversation = updatedConversations.find(conv => conv.id === currentId) || null;
          if (updatedConversation) {
            syncConversationRemote(updatedConversation);
          }
          return {
            conversations: updatedConversations,
            uploadedFiles: state.uploadedFiles.filter(f => f.name !== fileName)
          };
        });
      },

      updateFile: (fileName, updates) => {
        set((state) => {
          const currentId = state.currentConversationId;

          // If no active conversation, just update global state
          if (!currentId) {
            return {
              uploadedFiles: state.uploadedFiles.map(f => f.name === fileName ? { ...f, ...updates } : f)
            };
          }

          const updatedConversations = state.conversations.map(conv =>
            conv.id === currentId
              ? {
                ...conv,
                files: (conv.files || []).map(f => f.name === fileName ? { ...f, ...updates } : f)
              }
              : conv
          );
          const updatedConversation = updatedConversations.find(conv => conv.id === currentId) || null;
          if (updatedConversation) {
            syncConversationRemote(updatedConversation);
          }
          return {
            conversations: updatedConversations,
            uploadedFiles: state.uploadedFiles.map(f => f.name === fileName ? { ...f, ...updates } : f)
          };
        });
      },

      getCurrentConversation: () => {
        const state = get();
        return state.conversations.find((conv) => conv.id === state.currentConversationId) || null;
      },
    }),
    {
      name: 'pm-ai-chat-storage',
      storage: customStorage,
      partialize: (state) => ({
        theme: state.theme,
        // Don't persist conversations - DB is source of truth
        // Don't persist sidebar state
        // Don't persist conversation states
      }),
    }
  )
);
