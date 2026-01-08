'use client';

import { cn } from "@/lib/utils";
import { forwardRef, TextareaHTMLAttributes, useId } from "react";

interface PremiumTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const PremiumTextarea = forwardRef<HTMLTextAreaElement, PremiumTextareaProps>(
  ({ 
    className, 
    label, 
    error, 
    hint,
    id,
    rows = 4,
    ...props 
  }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-muted-foreground mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            "w-full bg-white/[0.03] border rounded-xl px-4 py-3",
            "text-white text-sm placeholder:text-muted-foreground",
            "focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-white/[0.05]",
            "transition-all duration-300 resize-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-destructive/50" : "border-white/[0.08]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-xs text-destructive">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  }
);

PremiumTextarea.displayName = "PremiumTextarea";
