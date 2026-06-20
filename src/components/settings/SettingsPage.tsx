import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { useAuthStore } from '../../stores/authStore';
import { logout } from '../../utils/authApi';
import {
  SlidersHorizontal,
  User,
  Trash2,
  Download,
  Moon,
  Sun,
  AlertTriangle,
  Check,
  ChevronDown,
} from '../ui/icons';
import { useTheme } from '../../hooks/useTheme';
import type { AIModel } from '../ui/ModelSelector';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const {
    selectedModel,
    setSelectedModel,
    conversations,
    clearAllConversations,
    setConversations,
    setCurrentConversation,
  } = useAppStore();
  const { user, token, clearAuth } = useAuthStore();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'account' | 'data'>('general');

  const handleLogout = async () => {
    await logout(token);
    clearAuth();
    setConversations([]);
    setCurrentConversation(null);
    navigate('/');
  };

  const handleExportMarkdown = () => {
    let markdown = '# StratifyPM Conversations Export\n\n';
    markdown += `Exported: ${new Date().toLocaleString()}\n\n`;
    markdown += `Total conversations: ${conversations.length}\n\n---\n\n`;

    conversations.forEach((conv, idx) => {
      markdown += `## ${idx + 1}. ${conv.title}\n\n`;
      markdown += `**Date:** ${new Date(conv.createdAt).toLocaleString()}  \n`;
      markdown += `**Messages:** ${conv.messages.length}\n\n`;

      conv.messages.forEach((msg) => {
        const role = msg.role === 'user' ? '👤 You' : '🤖 AI';
        markdown += `### ${role}\n\n${msg.content}\n\n`;
      });

      markdown += '---\n\n';
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stratifypm-export-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleExportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      conversations: conversations.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        messages: c.messages.map((m) => ({
          ...m,
          timestamp: m.timestamp.toISOString(),
        })),
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stratifypm-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const modelOptions: { id: AIModel; name: string; description: string }[] = [
    { id: 'claude', name: 'Claude', description: 'Best for strategy & analysis' },
    { id: 'gemini', name: 'Gemini', description: 'Fast, great for research' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/app')}
            className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
          >
            ← Back to app
          </button>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <SlidersHorizontal className="w-7 h-7 text-primary" />
            Settings
          </h1>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-muted/50 p-1 rounded-xl w-fit">
          {([
            { key: 'general', label: 'General' },
            { key: 'account', label: 'Account' },
            { key: 'data', label: 'Data' },
          ] as const).map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === section.key
                  ? 'bg-card text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* General Section */}
        {activeSection === 'general' && (
          <div className="space-y-6">
            {/* Theme */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Appearance</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground font-medium">Theme</p>
                  <p className="text-xs text-muted-foreground">Choose your preferred color scheme</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
              </div>
            </div>

            {/* Default Model */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Default AI Model</h3>
              <div className="space-y-2">
                {modelOptions.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                      selectedModel === model.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.description}</p>
                    </div>
                    {selectedModel === model.id && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Account Section */}
        {activeSection === 'account' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Account Info</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{user?.email || 'Not signed in'}</p>
                  <p className="text-xs text-muted-foreground">Passwordless OTP authentication</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Session</h3>
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-4 py-2.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Data Section */}
        {activeSection === 'data' && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Export Data</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Download all your conversations and data. You own everything.
              </p>

              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Conversations
                  <ChevronDown className={`w-3 h-3 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                </button>

                {showExportMenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-10 py-1">
                    <button
                      onClick={handleExportMarkdown}
                      className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors"
                    >
                      Export as Markdown (.md)
                    </button>
                    <button
                      onClick={handleExportJSON}
                      className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors"
                    >
                      Export as JSON (.json)
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card border border-destructive/30 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-destructive mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Danger Zone
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                These actions are permanent and cannot be undone.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete All Conversations
                </button>
              ) : (
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm text-foreground mb-3">
                    Are you sure? This will permanently delete all {conversations.length} conversations.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        clearAllConversations();
                        setShowDeleteConfirm(false);
                      }}
                      className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
                    >
                      Yes, Delete All
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
