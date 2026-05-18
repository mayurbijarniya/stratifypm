import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { quickActions } from '../../data/quickActions';
import {
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Zap,
  MessageSquare,
} from '../ui/icons';

interface FeatureInterfaceProps {
  featureId: string;
}

const categoryIcons: Record<string, typeof Target> = {
  strategy: Target,
  execution: TrendingUp,
  research: Users,
  analytics: BarChart3,
};

const categoryLabels: Record<string, string> = {
  strategy: 'Strategy',
  execution: 'Execution',
  research: 'Research',
  analytics: 'Analytics',
};

export const FeatureInterface: React.FC<FeatureInterfaceProps> = ({ featureId }) => {
  const { createConversation, setCurrentConversation, addMessage, setConversationLoading } = useAppStore();
  const navigate = useNavigate();
  const [customPrompt, setCustomPrompt] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const feature = quickActions.find(action => action.id === featureId);

  if (!feature) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Feature not found</p>
      </div>
    );
  }

  const Icon = categoryIcons[feature.category] || Lightbulb;
  const categoryLabel = categoryLabels[feature.category] || 'Framework';

  const handleStartChat = (promptOverride?: string) => {
    if (isStarting) return;
    setIsStarting(true);

    const promptToSend = promptOverride || customPrompt || feature.prompt;

    // Create a new conversation for this feature
    const conversationId = createConversation(feature.title);
    setCurrentConversation(conversationId);
    navigate(`/app/${conversationId}`);

    // Auto-send the feature prompt
    setTimeout(() => {
      addMessage(conversationId, {
        content: promptToSend,
        role: 'user',
      });
      setConversationLoading(conversationId, true);
      setIsStarting(false);
    }, 150);
  };

  return (
    <div className="flex-1 flex items-center justify-start bg-background p-4 sm:p-8 overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-4">
            <Zap className="w-3 h-3" />
            {categoryLabel} Framework
          </div>
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {feature.title}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            {feature.description}
          </p>
        </div>

        {/* How it works */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            How It Works
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. The framework prompt is pre-loaded below</p>
            <p>2. You can customize it with your specific context</p>
            <p>3. Click "Run Analysis" and the AI will generate the full framework output</p>
          </div>
        </div>

        {/* Customizable Prompt */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Your Input
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Customize the prompt with your specific context, or use one of the examples below:
          </p>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={feature.prompt}
            rows={6}
            className="w-full px-4 py-3 bg-background border-2 border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
          />
        </div>

        {/* Example Prompts */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Quick Examples</h3>
          <div className="flex flex-wrap gap-2">
            {getExamples(feature.id).map((example, idx) => (
              <button
                key={idx}
                onClick={() => setCustomPrompt(example)}
                className="px-3 py-2 bg-muted hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/30 rounded-lg text-xs font-medium transition-all text-left"
              >
                {example.length > 60 ? example.slice(0, 60) + '...' : example}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleStartChat()}
          disabled={isStarting}
          className="w-full py-3.5 px-6 bg-primary text-primary-foreground rounded-xl font-semibold text-base transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isStarting ? (
            <>
              <Zap className="w-4 h-4 animate-pulse" />
              Starting...
            </>
          ) : (
            <>
              Run {feature.title}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          The AI will generate a structured {feature.title.toLowerCase()} based on your input.
        </p>
      </div>
    </div>
  );
};

function getExamples(featureId: string): string[] {
  const examples: Record<string, string[]> = {
    'competitive-analysis': [
      'Analyze the project management software market including Asana, Monday, and Notion.',
      'Do a competitive analysis of Figma vs Sketch vs Adobe XD for enterprise design teams.',
      'Compare Spotify, Apple Music, and YouTube Music in the Indian streaming market.',
    ],
    'market-opportunity': [
      'Assess market opportunity for AI-powered customer service tools in healthcare.',
      'Evaluate the market for electric vehicle charging infrastructure in Europe.',
      'Analyze the growth potential of no-code platforms for SMBs.',
    ],
    'business-model-canvas': [
      'Create business model canvas for a subscription-based meal planning app.',
      'Design a canvas for a B2B SaaS analytics platform targeting e-commerce.',
      'Map the business model for a peer-to-peer rental marketplace.',
    ],
    'feature-prioritization': [
      'For a fitness app, prioritize: social sharing, new workout types, and a diet tracker.',
      'Score these 12 features using RICE and rank them by priority for our Q3 roadmap.',
      'Help me decide between: dark mode, API access, and mobile app for our MVP.',
    ],
    'roadmap-timeline': [
      'Create 6-month roadmap for mobile app with user profiles, payments, and analytics.',
      'Build a Q1-Q4 roadmap for our AI assistant product launch.',
      'Plan a 3-month roadmap for improving user onboarding and activation.',
    ],
    'sprint-planning': [
      'Plan 2-week sprint for 5-person team focusing on checkout flow improvements.',
      'Help me plan a sprint with 3 engineers for payment gateway integration.',
      'Estimate story points for user profile, search, and notification features.',
    ],
    'user-persona': [
      'Create personas for a B2B SaaS tool targeting small business owners.',
      'Build 3 user personas for a meditation app targeting busy professionals.',
      'Design personas for our fintech app used by millennials and Gen Z.',
    ],
    'customer-journey': [
      'Map customer journey for online banking app from sign-up to first transaction.',
      'Design the journey for a first-time e-commerce buyer from discovery to repeat purchase.',
      'Map the onboarding journey for a project management tool.',
    ],
    'interview-guide': [
      'Create interview guide to understand how remote workers use productivity tools.',
      'Design a user research study for mobile app onboarding optimization.',
      'Build an interview guide for understanding developer tool preferences.',
    ],
    'kpi-dashboard': [
      'Design KPI dashboard for an e-commerce platform focused on growth.',
      'Build a metrics framework for a SaaS product tracking MRR and churn.',
      'Create a dashboard strategy for tracking product engagement and retention.',
    ],
    'cohort-analysis': [
      'Analyze retention cohorts for SaaS platform focusing on feature adoption.',
      'Build a cohort analysis for our mobile app user engagement.',
      'Compare monthly cohorts for our subscription product over the last year.',
    ],
    'ab-test-planner': [
      'Test new onboarding flow to improve user activation rates by 15%.',
      'Design an A/B test for our pricing page to increase conversions.',
      'Plan an experiment for push notification timing to maximize open rates.',
    ],
  };

  return examples[featureId] || [
    'Give me a detailed framework analysis for my product.',
    'Walk me through the step-by-step process for this framework.',
  ];
}
