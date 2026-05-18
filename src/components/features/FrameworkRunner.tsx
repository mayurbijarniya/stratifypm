import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pmFrameworks } from '../../data/pmFrameworks';
import { useAppStore } from '../../stores/appStore';
import { Button } from '../ui/Button';
import {
  Calculator,
  ArrowRight,
  ArrowLeft,
  Check,
  Save,
} from '../ui/icons';
import type { PMFramework, FrameworkField } from '../../types';

interface FrameworkRunnerProps {
  frameworkId: string;
}

export const FrameworkRunner: React.FC<FrameworkRunnerProps> = ({ frameworkId }) => {
  const framework = pmFrameworks.find((f) => f.id === frameworkId);
  const navigate = useNavigate();
  const { createConversation, setCurrentConversation, addMessage, setConversationLoading } = useAppStore();
  const [values, setValues] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!framework) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Framework not found</p>
      </div>
    );
  }

  const handleChange = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const renderField = (field: FrameworkField) => {
    const baseClass =
      'w-full px-4 py-3 bg-card border-2 border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={values[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`${baseClass} resize-none`}
          />
        );
      case 'select':
        return (
          <select
            value={values[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={baseClass}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={values[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseClass}
          />
        );
      default:
        return (
          <input
            type="text"
            value={values[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseClass}
          />
        );
    }
  };

  const isFieldValid = (field: FrameworkField) => {
    if (!field.required) return true;
    const val = values[field.id];
    return val && val.trim().length > 0;
  };

  const allValid = framework.fields.every(isFieldValid);

  const steps = Math.ceil(framework.fields.length / 3);
  const stepFields = framework.fields.slice(currentStep * 3, currentStep * 3 + 3);
  const canGoNext = stepFields.every(isFieldValid);
  const canGoPrev = currentStep > 0;

  const handleSubmit = async () => {
    if (!allValid || isSubmitting) return;
    setIsSubmitting(true);

    // Build the prompt from template
    let prompt = framework.template;

    // Auto-compute RICE score if applicable
    const computedValues: Record<string, string> = { ...values };
    if (framework.id === 'rice-scoring') {
      const reach = parseFloat(values.reach || '0');
      const impact = parseFloat(values.impact || '0');
      const confidence = parseFloat(values.confidence || '0');
      const effort = parseFloat(values.effort || '1');
      if (reach && impact && confidence && effort) {
        const riceScore = ((reach * impact * (confidence / 100)) / effort).toFixed(1);
        computedValues.riceScore = riceScore;
      }
    }

    Object.entries(computedValues).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });

    // Add instruction for AI to fill any remaining placeholders
    prompt += '\n\n---\n\nPlease fill in any remaining `{placeholder}` values in the template above based on the data provided. Compute scores, generate recommendations, and complete the analysis.';

    // Create conversation
    const id = createConversation(framework.name);
    setCurrentConversation(id);
    navigate(`/app/${id}`);

    // Add the framework as a user message
    setTimeout(() => {
      addMessage(id, {
        content: prompt,
        role: 'user',
      });
      setConversationLoading(id, true);
      setIsSubmitting(false);
    }, 150);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
            <Calculator className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{framework.name}</h1>
          <p className="text-muted-foreground text-sm">{framework.description}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {Array.from({ length: steps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Form Fields */}
        <div className="space-y-5 mb-8">
          {stepFields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-foreground mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {!isFieldValid(field) && (
                <p className="text-xs text-red-500 mt-1">This field is required</p>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={!canGoPrev}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < steps - 1 ? (
            <button
              onClick={() => setCurrentStep((s) => Math.min(steps - 1, s + 1))}
              disabled={!canGoNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allValid || isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20"
            >
              {isSubmitting ? (
                <>
                  <Save className="w-4 h-4 animate-pulse" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Run Analysis
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
