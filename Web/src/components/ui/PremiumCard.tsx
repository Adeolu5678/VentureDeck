'use client';

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface PremiumCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "glass" | "solid" | "outline";
  glow?: boolean;
}

export function PremiumCard({ 
  children, 
  className, 
  variant = "glass", 
  glow = false,
  ...props 
}: PremiumCardProps) {
  
  const variants = {
    glass: "glass-panel border-white/5 bg-[#0a0f1c]/60",
    solid: "bg-card border-border",
    outline: "border-2 border-white/10 bg-transparent hover:bg-white/5"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={glow ? { 
        y: -5,
        boxShadow: "0 20px 40px -10px rgba(0, 163, 255, 0.15)",
        borderColor: "rgba(0, 163, 255, 0.3)"
      } : { y: -2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "rounded-3xl p-6 transition-colors duration-300 relative overflow-hidden group",
        variants[variant],
        className
      )}
      {...props}
    >
      {glow && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      {children}
    </motion.div>
  );
}
