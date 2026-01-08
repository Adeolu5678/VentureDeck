'use client';

import { cn } from "@/lib/utils";

interface PageSkeletonProps {
  variant?: "dashboard" | "detail" | "list" | "form";
  className?: string;
}

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "bg-white/[0.03] rounded-xl animate-pulse",
        className
      )} 
    />
  );
}

function CardSkeleton() {
  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <SkeletonPulse className="w-14 h-14 rounded-xl" />
        <SkeletonPulse className="w-20 h-6 rounded-lg" />
      </div>
      <SkeletonPulse className="h-6 w-3/4" />
      <SkeletonPulse className="h-4 w-full" />
      <SkeletonPulse className="h-4 w-2/3" />
    </div>
  );
}

export function PageSkeleton({ variant = "dashboard", className }: PageSkeletonProps) {
  if (variant === "dashboard") {
    return (
      <div className={cn("space-y-8 animate-in fade-in duration-300", className)}>
        {/* Header */}
        <div className="space-y-2">
          <SkeletonPulse className="h-4 w-24" />
          <SkeletonPulse className="h-10 w-80" />
          <SkeletonPulse className="h-5 w-64" />
        </div>
        
        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className={cn("space-y-8 animate-in fade-in duration-300", className)}>
        {/* Header */}
        <div className="flex items-start gap-6">
          <SkeletonPulse className="w-24 h-24 rounded-2xl" />
          <div className="space-y-3 flex-1">
            <SkeletonPulse className="h-8 w-64" />
            <SkeletonPulse className="h-5 w-full max-w-md" />
            <div className="flex gap-2">
              <SkeletonPulse className="h-8 w-24 rounded-lg" />
              <SkeletonPulse className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <SkeletonPulse className="h-6 w-32" />
          <SkeletonPulse className="h-4 w-full" />
          <SkeletonPulse className="h-4 w-full" />
          <SkeletonPulse className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-4 animate-in fade-in duration-300", className)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="glass-panel rounded-xl p-4 flex items-center gap-4">
            <SkeletonPulse className="w-12 h-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <SkeletonPulse className="h-5 w-48" />
              <SkeletonPulse className="h-4 w-32" />
            </div>
            <SkeletonPulse className="w-20 h-8 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className={cn("space-y-6 animate-in fade-in duration-300 max-w-lg", className)}>
        <div className="space-y-2">
          <SkeletonPulse className="h-4 w-20" />
          <SkeletonPulse className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <SkeletonPulse className="h-4 w-24" />
          <SkeletonPulse className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <SkeletonPulse className="h-4 w-28" />
          <SkeletonPulse className="h-32 w-full rounded-xl" />
        </div>
        <SkeletonPulse className="h-12 w-full rounded-xl" />
      </div>
    );
  }

  return null;
}

export { SkeletonPulse };
