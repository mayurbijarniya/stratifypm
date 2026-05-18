import React from 'react';
import { AlertTriangle, X } from './icons';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      confirmBtn: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      iconBg: 'bg-amber-100 dark:bg-amber-900/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      confirmBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    info: {
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  };

  const style = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 transition-all duration-200">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className={`w-12 h-12 ${style.iconBg} rounded-xl flex items-center justify-center mb-4`}>
          <AlertTriangle className={`w-6 h-6 ${style.iconColor}`} />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${style.confirmBtn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
