'use client';

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  variant?: "default" | "compact";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  const isCompact = variant === "compact";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "text-center",
        isCompact ? "py-8" : "py-16",
        "px-6",
        "border border-dashed border-white/10 rounded-3xl",
        "bg-gradient-to-b from-white/[0.02] to-transparent",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className={cn(
          "mx-auto mb-4 flex items-center justify-center rounded-2xl",
          "bg-white/[0.03] border border-white/[0.06]",
          isCompact ? "w-14 h-14" : "w-20 h-20"
        )}
      >
        <Icon 
          className={cn(
            "text-muted-foreground/50",
            isCompact ? "w-7 h-7" : "w-10 h-10"
          )} 
        />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "font-display font-bold text-white mb-2",
          isCompact ? "text-lg" : "text-xl"
        )}
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cn(
          "text-muted-foreground max-w-md mx-auto",
          isCompact ? "text-sm mb-4" : "text-base mb-8"
        )}
      >
        {description}
      </motion.p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
