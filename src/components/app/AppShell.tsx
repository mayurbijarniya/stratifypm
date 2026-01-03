import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatContainer } from '../chat/ChatContainer';
import { useAppStore } from '../../stores/appStore';
import { listConversations } from '../../utils/conversationApi';
import { useAuthStore } from '../../stores/authStore';

export const AppShell: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { currentConversationId, setCurrentConversation, setConversations } = useAppStore();
  const { token } = useAuthStore();
  const loadComplete = useRef(false);

  // Fetch all conversations from DB on mount
  useEffect(() => {
    if (!token || loadComplete.current) return;

    let cancelled = false;
    const fetchAllConversations = async () => {
      try {
        const convs = await listConversations(token);
        if (!cancelled) {
          setConversations(convs);
        }
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
      } finally {
        if (!cancelled) {
          loadComplete.current = true;
        }
      }
    };

    fetchAllConversations();
    return () => { cancelled = true; };
  }, [token, setConversations]);

  // Set current conversation when URL has conversationId
  useEffect(() => {
    if (!conversationId) return;

    const checkAndSetConversation = async () => {
      // Wait for initial load to complete
      while (!loadComplete.current) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Get current conversations from store (not stale closure)
      const currentConversations = useAppStore.getState().conversations;
      const existingConv = currentConversations.find((conv) => conv.id === conversationId);
      if (existingConv) {
        if (currentConversationId !== conversationId) {
          setCurrentConversation(conversationId);
        }
        return;
      }

      // Not found - navigate to /app
      navigate('/app', { replace: true });
    };

    checkAndSetConversation();
  }, [conversationId, currentConversationId, navigate, setCurrentConversation]);

  // Clear current conversation when on /app (no UUID)
  useEffect(() => {
    if (!conversationId && currentConversationId) {
      setCurrentConversation(null);
    }
  }, [conversationId, currentConversationId, setCurrentConversation]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-all duration-500 w-full overflow-x-hidden">
      <ChatContainer />
    </div>
  );
};
