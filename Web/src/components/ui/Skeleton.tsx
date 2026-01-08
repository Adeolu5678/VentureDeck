'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses = 'bg-white/5 animate-pulse';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '100%'),
  };

  if (lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className={`${baseClasses} ${variantClasses[variant]}`}
            style={{ ...style, width: i === lines - 1 ? '70%' : style.width }}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Card skeleton for project/user cards
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-panel rounded-2xl p-6 ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <Skeleton variant="rectangular" width={56} height={56} className="shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" lines={2} />
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-white/5">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" width={i === 0 ? '30%' : '20%'} />
      ))}
    </div>
  );
}

// Activity item skeleton
export function ActivitySkeleton() {
  return (
    <div className="flex gap-3 p-2">
      <Skeleton variant="rectangular" width={32} height={32} className="shrink-0" />
      <div className="flex-1 space-y-1">
        <Skeleton variant="text" width="80%" height={14} />
        <Skeleton variant="text" width="50%" height={12} />
      </div>
      <Skeleton variant="text" width={40} height={12} />
    </div>
  );
}

// Stats card skeleton
export function StatsSkeleton() {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <Skeleton variant="text" width={100} height={16} className="mb-2" />
      <Skeleton variant="text" width={80} height={32} className="mb-1" />
      <Skeleton variant="text" width={60} height={12} />
    </div>
  );
}

// Full page loading skeleton with animated shimmer
export function PageSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 pb-24"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Skeleton variant="text" width={200} height={32} className="mb-2" />
          <Skeleton variant="text" width={300} height={16} />
        </div>
        
        {/* Grid of cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Skeleton;
