import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Sun,
  Moon,
  MessageSquare,
  X,
  Trash2,
  MoreHorizontal,
  Pin,
  PinOff,
  Search,
  Edit,
  SlidersHorizontal,
  Check,
} from '../ui/icons';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../stores/appStore';
import { useAuthStore } from '../../stores/authStore';
import { logout } from '../../utils/authApi';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    setSelectedFeature,
    conversations,
    deleteConversation,
    clearAllConversations,
    setCurrentConversation,
    currentConversationId,
    setConversations,
    togglePinConversation,
    renameConversation,
    searchConversations,
  } = useAppStore();
  const { user, token, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);

  const handleNewChat = () => {
    setSelectedFeature(null);
    setCurrentConversation(null);
    setShowHistory(false);
    navigate('/app');
  };

  const handleConversationClick = (conversationId: string) => {
    setCurrentConversation(conversationId);
    setSelectedFeature(null);
    setShowHistory(false);
    navigate(`/app/${conversationId}`);
  };

  const handleDeleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConversation(conversationId);
    setShowDeleteMenu(null);
  };

  const handleClearAll = () => {
    setShowClearAllDialog(true);
  };

  const confirmClearAll = () => {
    clearAllConversations();
    setShowDeleteMenu(null);
    setShowClearAllDialog(false);
  };

  const handleLogout = async () => {
    await logout(token);
    clearAuth();
    setConversations([]);
    setCurrentConversation(null);
    setShowHistory(false);
    navigate('/');
  };

  const handleStartRename = (conv: { id: string; title: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
    setShowDeleteMenu(null);
  };

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      renameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const displayedConversations = searchQuery.trim()
    ? searchConversations(searchQuery)
    : conversations;

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-30 flex justify-between items-center p-3 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 transition-colors duration-200 border-b border-border/50">
        <div className="flex items-center gap-3">
          <button
            onClick={handleNewChat}
            className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 group transition-all hover:scale-105 flex items-center gap-2 px-3 py-2 text-sm font-medium shadow-sm"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-all" />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>

        <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2">
          <img
            src={theme === 'dark' ? "/sp_dark.svg" : "/sp_light.svg"}
            alt="StratifyPM"
            className="h-8 sm:h-9 w-auto"
          />
        </div>

        <div className="flex items-center gap-2">
          {user?.email && (
            <div className="hidden lg:flex items-center rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
              {user.email}
            </div>
          )}

          <button
            onClick={() => navigate('/settings')}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent hover:bg-accent/80 transition-all text-muted-foreground hover:text-foreground"
            title="Settings"
          >
            <SlidersHorizontal size={16} />
          </button>

          {user && (
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition hover:bg-accent"
            >
              Sign out
            </button>
          )}

          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`rounded-lg transition-all flex items-center gap-2 px-3 py-2 text-sm font-medium ${showHistory
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent hover:bg-accent/80 text-accent-foreground'
              }`}
          >
            <MessageSquare size={16} />
            <span className="hidden sm:inline">History</span>
            {conversations.length > 0 && (
              <span className="bg-primary-foreground text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {conversations.length}
              </span>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent hover:bg-accent/80 transition-all text-muted-foreground hover:text-foreground"
          >
            {theme === 'light' ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </button>
        </div>
      </div>

      {/* History Sidebar */}
      {showHistory && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowHistory(false)}
          />
          <div className="fixed right-0 top-0 h-full w-full sm:w-80 bg-card border-l border-border z-50 shadow-xl flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">Chat History</h2>
                {conversations.length > 0 && (
                  <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                    {conversations.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {conversations.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                    title="Clear all conversations"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <button
                  onClick={() => setShowHistory(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-20">
              {displayedConversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={24} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {searchQuery ? 'No matches found' : 'No conversations yet'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {searchQuery ? 'Try a different search term' : 'Start a new conversation to see it here'}
                  </p>
                </div>
              ) : (
                <div className="p-3 space-y-2">
                  {displayedConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`group relative p-3 rounded-lg border transition-all cursor-pointer ${currentConversationId === conversation.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:bg-accent/50 hover:border-accent-foreground/20'
                        }`}
                      onClick={() => handleConversationClick(conversation.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {editingId === conversation.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveRename(conversation.id);
                                  if (e.key === 'Escape') setEditingId(null);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                                className="flex-1 px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/30"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveRename(conversation.id);
                                }}
                                className="p-1 rounded hover:bg-primary/10 text-primary"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <p className="font-medium text-sm truncate mb-1">
                              {conversation.title}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{conversation.messages.length} messages</span>
                            <span>{new Date(conversation.updatedAt).toLocaleDateString()}</span>
                          </div>
                          {conversation.tags && conversation.tags.length > 0 && (
                            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                              {conversation.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                          {conversation.pinned && (
                            <Pin className="w-3 h-3 text-primary fill-primary" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteMenu(showDeleteMenu === conversation.id ? null : conversation.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded hover:bg-accent transition-all"
                          >
                            <MoreHorizontal size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Action menu */}
                      {showDeleteMenu === conversation.id && (
                        <div className="absolute right-1 top-8 bg-popover border border-border rounded-lg shadow-lg z-10 py-1 min-w-[140px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePinConversation(conversation.id);
                              setShowDeleteMenu(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                          >
                            {conversation.pinned ? <PinOff size={12} /> : <Pin size={12} />}
                            {conversation.pinned ? 'Unpin' : 'Pin'}
                          </button>
                          <button
                            onClick={(e) => handleStartRename(conversation, e)}
                            className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-accent transition-colors flex items-center gap-2"
                          >
                            <Edit size={12} />
                            Rename
                          </button>
                          <button
                            onClick={(e) => handleDeleteConversation(conversation.id, e)}
                            className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Clear All Confirm Dialog */}
      <ConfirmDialog
        isOpen={showClearAllDialog}
        title="Delete All Conversations?"
        description="Are you sure you want to delete all conversations? This action cannot be undone."
        confirmLabel="Delete All"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmClearAll}
        onCancel={() => setShowClearAllDialog(false)}
      />
    </>
  );
};
