'use client';

import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes, ReactNode, useId } from "react";

interface PremiumInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export const PremiumInput = forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ 
    className, 
    label, 
    error, 
    hint,
    leftIcon, 
    rightIcon, 
    size = "md",
    id,
    ...props 
  }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    
    const sizes = {
      sm: "py-2 text-xs",
      md: "py-3 text-sm",
      lg: "py-4 text-base",
    };

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-muted-foreground mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-white/[0.03] border rounded-xl",
              "text-white placeholder:text-muted-foreground",
              "focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-white/[0.05]",
              "transition-all duration-300",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error ? "border-destructive/50" : "border-white/[0.08]",
              leftIcon ? "pl-11" : "pl-4",
              rightIcon ? "pr-11" : "pr-4",
              sizes[size],
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
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

PremiumInput.displayName = "PremiumInput";
