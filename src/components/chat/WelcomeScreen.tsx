import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { quickActions } from '../../data/quickActions';
import { templates } from '../../data/templates';
import { pmFrameworks } from '../../data/pmFrameworks';
import { useAppStore } from '../../stores/appStore';
import {
  Target,
  Users,
  BarChart3,
  TrendingUp,
  Sparkles,
  LayoutTemplate,
  Calculator,
  MessageSquare,
  Pin,
  Search,
  ArrowRight,
  Zap,
} from '../ui/icons';
import type { PMCategory } from '../../types';

const categoryIcons: Record<PMCategory, typeof Target> = {
  strategy: Target,
  execution: TrendingUp,
  research: Users,
  analytics: BarChart3,
  technical: Zap,
  stakeholder: MessageSquare,
};

const categoryColors: Record<PMCategory, string> = {
  strategy: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
  execution: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300',
  research: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300',
  analytics: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
  technical: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300',
  stakeholder: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300',
};

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.6, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    conversations,
    createConversation,
    setCurrentConversation,
    setSelectedFeature,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'frameworks' | 'templates' | 'tools'>('frameworks');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(featureId);
    setCurrentConversation(null);
  };

  const handleTemplateClick = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;
    const id = createConversation(template.name);
    setCurrentConversation(id);
    navigate(`/app/${id}`);
    setTimeout(() => {
      const event = new CustomEvent('setSuggestion', { detail: template.example || `Use the ${template.name} template` });
      window.dispatchEvent(event);
    }, 100);
  };

  const handleFrameworkClick = (frameworkId: string) => {
    const framework = pmFrameworks.find((f) => f.id === frameworkId);
    if (!framework) return;
    setSelectedFeature(`framework-${frameworkId}`);
    setCurrentConversation(null);
  };

  const recentConversations = conversations.slice(0, 5);

  const filteredActions = searchQuery
    ? quickActions.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : quickActions;

  const filteredTemplates = searchQuery
    ? templates.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : templates;

  return (
    <div className="flex-1 flex flex-col items-center justify-start pt-8 sm:pt-12 pb-4 px-4 overflow-y-auto">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl mb-3 text-foreground font-be-vietnam-pro font-light tracking-tighter">
              stratifypm
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Your AI-powered product management assistant for strategic decisions, user research, and data-driven insights.
            </p>
          </div>
        </Reveal>

        {/* Search Bar */}
        <Reveal delay={80}>
          <div className="relative max-w-lg mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search frameworks, templates, tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Sparkles className="w-3 h-3" />
              </button>
            )}
          </div>
        </Reveal>

        {/* Recent Conversations */}
        {recentConversations.length > 0 && !searchQuery && (
          <Reveal delay={100}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Recent Conversations
                </h3>
                <button
                  onClick={() => {
                    const id = createConversation();
                    setCurrentConversation(id);
                    navigate(`/app/${id}`);
                  }}
                  className="text-xs text-primary hover:text-primary/80 font-medium"
                >
                  New Chat →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setCurrentConversation(conv.id);
                      navigate(`/app/${conv.id}`);
                    }}
                    className="text-left p-3 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-foreground truncate flex-1 mr-2">{conv.title}</p>
                      {conv.pinned && <Pin className="w-3 h-3 text-primary flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {conv.messages.length} messages
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Tabs */}
        {!searchQuery && (
          <Reveal delay={120}>
            <div className="flex items-center gap-1 mb-6 bg-muted/50 p-1 rounded-xl w-fit mx-auto">
              {([
                { key: 'frameworks', label: '12 Frameworks', icon: Zap },
                { key: 'templates', label: 'Templates', icon: LayoutTemplate },
                { key: 'tools', label: 'Interactive Tools', icon: Calculator },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-card text-foreground shadow-sm border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        {/* Content */}
        <div className="space-y-6">
          {/* Frameworks Grid */}
          {(activeTab === 'frameworks' || searchQuery) && filteredActions.length > 0 && (
            <div>
              {!searchQuery && (
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  PM Frameworks
                  <span className="text-xs text-muted-foreground font-normal">({filteredActions.length})</span>
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredActions.map((action, idx) => {
                  const Icon = categoryIcons[action.category];
                  return (
                    <Reveal key={action.id} delay={idx * 40}>
                      <button
                        onClick={() => handleFeatureClick(action.id)}
                        className="text-left w-full p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColors[action.category]}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                              {action.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">{action.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 mt-1" />
                        </div>
                      </button>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          )}

          {/* Templates Grid */}
          {(activeTab === 'templates' || searchQuery) && filteredTemplates.length > 0 && (
            <div>
              {!searchQuery && (
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-primary" />
                  Structured Templates
                  <span className="text-xs text-muted-foreground font-normal">({filteredTemplates.length})</span>
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredTemplates.map((template, idx) => {
                  const Icon = categoryIcons[template.category];
                  return (
                    <Reveal key={template.id} delay={idx * 40}>
                      <button
                        onClick={() => handleTemplateClick(template.id)}
                        className="text-left w-full p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColors[template.category]}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                              {template.name}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                            {template.example && (
                              <p className="text-[11px] text-muted-foreground/70 mt-1.5 italic truncate">
                                e.g. {template.example}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 mt-1" />
                        </div>
                      </button>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Tools */}
          {(activeTab === 'tools' || searchQuery) && pmFrameworks.length > 0 && (
            <div>
              {!searchQuery && (
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-primary" />
                  Interactive Tools
                  <span className="text-xs text-muted-foreground font-normal">({pmFrameworks.length})</span>
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pmFrameworks.map((fw, idx) => {
                  const Icon = categoryIcons[fw.category];
                  return (
                    <Reveal key={fw.id} delay={idx * 40}>
                      <button
                        onClick={() => handleFrameworkClick(fw.id)}
                        className="text-left w-full p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColors[fw.category]}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                              {fw.name}
                            </h4>
                            <p className="text-xs text-muted-foreground">{fw.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                                {fw.fields.length} fields
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 mt-1" />
                        </div>
                      </button>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick start CTA */}
        {!searchQuery && (
          <Reveal delay={200}>
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-xl">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Or just start typing below — ask anything about product management
                </span>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
};
