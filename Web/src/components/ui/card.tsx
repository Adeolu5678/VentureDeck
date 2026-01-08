import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, glow = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-panel rounded-2xl p-6 transition-all duration-300 relative group",
          hoverEffect && "hover:scale-[1.02] hover:-translate-y-1 hover:border-white/15",
          glow && "hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";
