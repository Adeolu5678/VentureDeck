'use client';

import { motion } from 'framer-motion';
import { DollarSign, Users, TrendingUp, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Investor {
  _id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

interface SoftCircle {
  _id: string;
  amount: number;
  status: 'interested' | 'committed' | 'withdrawn';
  createdAt: number;
  updatedAt?: number;
  investor: Investor | null;
}

interface CommitmentTrackerProps {
  fundingGoal: number;
  softCircles: SoftCircle[];
  className?: string;
}

export function CommitmentTracker({
  fundingGoal,
  softCircles,
  className = '',
}: CommitmentTrackerProps) {
  const [expanded, setExpanded] = useState(false);

  // Calculate totals
  const activeCircles = softCircles.filter(c => c.status !== 'withdrawn');
  const interestedTotal = activeCircles
    .filter(c => c.status === 'interested')
    .reduce((sum, c) => sum + c.amount, 0);
  const committedTotal = activeCircles
    .filter(c => c.status === 'committed')
    .reduce((sum, c) => sum + c.amount, 0);
  const totalRaised = interestedTotal + committedTotal;

  const interestedCount = activeCircles.filter(c => c.status === 'interested').length;
  const committedCount = activeCircles.filter(c => c.status === 'committed').length;

  // Calculate percentages
  const totalPercentage = Math.min(100, (totalRaised / fundingGoal) * 100);
  const committedPercentage = Math.min(100, (committedTotal / fundingGoal) * 100);

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <div className={`bg-neutral-800/50 rounded-xl border border-neutral-700/50 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-neutral-200">Funding Progress</h3>
            <p className="text-xs text-neutral-500">Cap Table Preview</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-neutral-100">{formatCurrency(totalRaised)}</p>
          <p className="text-xs text-neutral-500">of {formatCurrency(fundingGoal)} goal</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-neutral-700/50 rounded-full overflow-hidden mb-4">
        {/* Interested (background) */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${totalPercentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 bg-amber-500/40 rounded-full"
        />
        {/* Committed (foreground) */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${committedPercentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
        />
        {/* Percentage label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white drop-shadow-md">
            {totalPercentage.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-neutral-900/50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="text-sm font-bold">{formatCurrency(committedTotal)}</span>
          </div>
          <p className="text-xs text-neutral-500">Committed</p>
        </div>
        <div className="text-center p-2 bg-neutral-900/50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-sm font-bold">{formatCurrency(interestedTotal)}</span>
          </div>
          <p className="text-xs text-neutral-500">Interested</p>
        </div>
        <div className="text-center p-2 bg-neutral-900/50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
            <Users className="w-3.5 h-3.5" />
            <span className="text-sm font-bold">{activeCircles.length}</span>
          </div>
          <p className="text-xs text-neutral-500">Investors</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400" />
          <span className="text-neutral-400">Committed ({committedCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
          <span className="text-neutral-400">Interested ({interestedCount})</span>
        </div>
      </div>

      {/* Expand/Collapse for Investor List */}
      {activeCircles.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1 py-2 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Investors
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                View All Investors
              </>
            )}
          </button>

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-2 max-h-48 overflow-y-auto"
            >
              {activeCircles
                .sort((a, b) => b.amount - a.amount)
                .map((circle) => (
                  <div
                    key={circle._id}
                    className="flex items-center justify-between p-2 bg-neutral-900/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center overflow-hidden">
                        {circle.investor?.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={circle.investor.avatarUrl}
                            alt={circle.investor.displayName || circle.investor.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium text-neutral-400">
                            {(circle.investor?.displayName || circle.investor?.username || '?')[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-200">
                          {circle.investor?.displayName || circle.investor?.username || 'Anonymous'}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatDistanceToNow(circle.createdAt, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-neutral-100">
                        {formatCurrency(circle.amount)}
                      </p>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          circle.status === 'committed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {circle.status}
                      </span>
                    </div>
                  </div>
                ))}
            </motion.div>
          )}
        </>
      )}

      {activeCircles.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-neutral-500">No investors yet</p>
          <p className="text-xs text-neutral-600">Soft circles will appear here</p>
        </div>
      )}
    </div>
  );
}
