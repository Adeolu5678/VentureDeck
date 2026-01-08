'use client';

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface PremiumButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "glass" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function PremiumButton({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: PremiumButtonProps) {
  
  const variants = {
    primary: cn(
      "bg-primary text-primary-foreground font-semibold",
      "shadow-lg shadow-primary/25",
      "hover:shadow-xl hover:shadow-primary/30",
      "hover:brightness-110",
      "border border-primary/20"
    ),
    secondary: cn(
      "bg-secondary text-secondary-foreground",
      "hover:bg-secondary/80",
      "border border-white/[0.08]"
    ),
    glass: cn(
      "glass-button text-foreground",
      "hover:border-white/20",
      "hover:shadow-lg hover:shadow-black/30"
    ),
    ghost: cn(
      "bg-transparent hover:bg-white/[0.06] text-foreground",
      "hover:text-white"
    ),
    gradient: cn(
      "text-white font-semibold",
      "bg-gradient-to-r from-primary via-[hsl(42_95%_55%)] to-primary bg-[length:200%_100%]",
      "shadow-lg shadow-primary/30",
      "hover:shadow-xl hover:shadow-primary/40",
      "hover:animate-[gradient-shift_3s_ease_infinite]",
      "border border-primary/30"
    )
  };

  const sizes = {
    sm: "px-4 py-2 text-xs rounded-xl gap-1.5",
    md: "px-6 py-3 text-sm rounded-2xl gap-2",
    lg: "px-8 py-4 text-base rounded-2xl gap-2.5",
    icon: "p-3 rounded-xl aspect-square"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      disabled={disabled || isLoading}
      className={cn(
        "font-display font-bold inline-flex items-center justify-center",
        "transition-all duration-300 relative overflow-hidden",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variants[variant],
        sizes[size],
        (disabled || isLoading) && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      {...props}
    >
      {/* Shimmer overlay for gradient/primary variants */}
      {(variant === 'gradient' || variant === 'primary') && !disabled && !isLoading && (
        <span 
          className="absolute inset-0 -translate-x-full opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" 
          aria-hidden="true"
        />
      )}
      
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
}
