'use client';

import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';

interface PremiumCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'glass' | 'solid' | 'outline' | 'gradient-border';
  glow?: boolean;
  hover?: boolean;
  animated?: boolean; // NEW: Opt-in animations for performance
}

export const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(
  (
    {
      children,
      className,
      variant = 'glass',
      glow = false,
      hover = true,
      animated = false, // Default to no animations for performance
      ...props
    },
    ref
  ) => {
    const variants = {
      glass: cn(
        'glass-panel',
        'bg-[#0c0c10]/70 backdrop-blur-xl', // Reduced from backdrop-blur-2xl
        'border border-white/[0.06]'
      ),
      solid: cn('bg-card border border-border', 'shadow-xl shadow-black/20'),
      outline: cn(
        'border-2 border-white/[0.08] bg-transparent',
        'hover:bg-white/[0.03]'
      ),
      'gradient-border': cn(
        'bg-[#0c0c10]/80 backdrop-blur-xl', // Reduced from backdrop-blur-2xl
        'border border-transparent',
        'relative overflow-hidden',
        'before:absolute before:inset-0 before:rounded-[inherit] before:p-[1px]',
        'before:bg-gradient-to-br before:from-primary/40 before:via-transparent before:to-accent/30',
        'before:mask-composite-exclude before:-z-10'
      ),
    };

    const baseClassName = cn(
      'rounded-2xl p-6 transition-all duration-300 relative group',
      variants[variant],
      glow &&
        'hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20',
      hover && !animated && 'hover:-translate-y-1', // CSS-only hover for non-animated
      className
    );

    // Use plain div for non-animated cards (better performance)
    if (!animated) {
      return (
        <div
          ref={ref}
          className={baseClassName}
          {...(props as React.HTMLAttributes<HTMLDivElement>)}
        >
          {/* Subtle inner glow at top */}
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            aria-hidden="true"
          />
          {children}
        </div>
      );
    }

    // Animated version (opt-in)
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        whileHover={
          hover
            ? {
                y: -4,
                transition: { type: 'spring', stiffness: 300, damping: 20 },
              }
            : undefined
        }
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={baseClassName}
        {...props}
      >
        {/* Warm glow effect on hover */}
        {glow && (
          <div
            className="absolute inset-0 -z-10 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                'radial-gradient(ellipse at center, hsl(38 92% 50% / 0.08) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />
        )}

        {/* Subtle inner glow at top */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          aria-hidden="true"
        />

        {children}
      </motion.div>
    );
  }
);

PremiumCard.displayName = 'PremiumCard';
