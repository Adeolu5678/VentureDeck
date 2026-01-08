import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: cn(
        "bg-primary text-primary-foreground font-semibold",
        "shadow-lg shadow-primary/25",
        "hover:brightness-110 hover:shadow-xl hover:shadow-primary/30",
        "border border-primary/20",
        "active:scale-[0.98]"
      ),
      secondary: cn(
        "glass-panel text-white",
        "hover:bg-white/[0.08] hover:border-white/15",
        "active:scale-[0.98]"
      ),
      ghost: cn(
        "text-muted-foreground",
        "hover:text-white hover:bg-white/[0.06]",
        "active:scale-[0.98]"
      ),
      destructive: cn(
        "bg-destructive text-white font-semibold",
        "shadow-lg shadow-destructive/25",
        "hover:brightness-110",
        "active:scale-[0.98]"
      ),
    };

    const sizes = {
      sm: "px-3.5 py-2 text-xs rounded-xl",
      md: "px-5 py-2.5 text-sm rounded-xl",
      lg: "px-8 py-4 text-base rounded-2xl",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-display font-medium",
          "transition-all duration-300",
          "disabled:opacity-50 disabled:pointer-events-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
