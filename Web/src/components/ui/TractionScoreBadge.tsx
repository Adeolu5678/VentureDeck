'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { useState } from 'react';

interface TractionScoreBadgeProps {
  score: number;
  breakdown?: {
    milestones: number;
    softCircles: number;
    followers: number;
    applications: number;
    teamCompleteness: number;
    pitchDeck: number;
    legalDocs: number;
  };
  size?: 'sm' | 'md' | 'lg';
  showTrend?: boolean;
  previousScore?: number;
}

export function TractionScoreBadge({
  score,
  breakdown,
  size = 'md',
  showTrend = false,
  previousScore,
}: TractionScoreBadgeProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Determine score tier and color
  const getScoreColor = (s: number) => {
    if (s >= 80) return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', ring: 'ring-emerald-500/30' };
    if (s >= 60) return { bg: 'bg-amber-500/20', text: 'text-amber-400', ring: 'ring-amber-500/30' };
    if (s >= 40) return { bg: 'bg-orange-500/20', text: 'text-orange-400', ring: 'ring-orange-500/30' };
    return { bg: 'bg-neutral-500/20', text: 'text-neutral-400', ring: 'ring-neutral-500/30' };
  };

  const colors = getScoreColor(score);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  const trend = previousScore !== undefined ? score - previousScore : 0;

  const breakdownLabels = {
    milestones: { label: 'Milestones', max: 25 },
    softCircles: { label: 'Investor Interest', max: 20 },
    followers: { label: 'Followers', max: 15 },
    applications: { label: 'Applications', max: 10 },
    teamCompleteness: { label: 'Team', max: 10 },
    pitchDeck: { label: 'Pitch Deck', max: 10 },
    legalDocs: { label: 'Legal Docs', max: 10 },
  };

  return (
    <div className="relative">
      <motion.div
        className={`
          ${sizeClasses[size]} ${colors.bg} ${colors.ring}
          rounded-full ring-2 flex items-center justify-center font-bold
          cursor-pointer transition-all hover:scale-105
        `}
        onClick={() => breakdown && setShowDetails(!showDetails)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className={colors.text}>{score}</span>
        {breakdown && (
          <Info className={`absolute -top-1 -right-1 w-3 h-3 ${colors.text}`} />
        )}
      </motion.div>

      {showTrend && previousScore !== undefined && (
        <div className="absolute -bottom-1 -right-1 flex items-center">
          {trend > 0 && (
            <span className="flex items-center text-xs text-emerald-400 bg-emerald-500/20 rounded-full px-1">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +{trend}
            </span>
          )}
          {trend < 0 && (
            <span className="flex items-center text-xs text-red-400 bg-red-500/20 rounded-full px-1">
              <TrendingDown className="w-3 h-3 mr-0.5" />
              {trend}
            </span>
          )}
          {trend === 0 && (
            <span className="flex items-center text-xs text-neutral-400 bg-neutral-500/20 rounded-full px-1">
              <Minus className="w-3 h-3" />
            </span>
          )}
        </div>
      )}

      {/* Breakdown Modal */}
      {showDetails && breakdown && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-neutral-900 border border-neutral-700 rounded-xl p-4 shadow-xl"
        >
          <div className="text-center mb-3">
            <span className={`text-2xl font-bold ${colors.text}`}>{score}</span>
            <span className="text-neutral-400 text-sm">/100</span>
            <p className="text-xs text-neutral-500 mt-1">Traction Score</p>
          </div>

          <div className="space-y-2">
            {Object.entries(breakdown).map(([key, value]) => {
              const { label, max } = breakdownLabels[key as keyof typeof breakdownLabels];
              const percentage = (value / max) * 100;
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 w-24 truncate">{label}</span>
                  <div className="flex-1 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className={`h-full ${getScoreColor(percentage).bg.replace('/20', '')}`}
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-300 w-8 text-right">
                    {value}/{max}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setShowDetails(false); }}
            className="mt-3 w-full text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Close
          </button>
        </motion.div>
      )}
    </div>
  );
}

// Inline badge for cards
export function TractionScoreInline({ score }: { score: number }) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-400';
    if (s >= 60) return 'text-amber-400';
    if (s >= 40) return 'text-orange-400';
    return 'text-neutral-400';
  };

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${getScoreColor(score)}`}>
      <TrendingUp className="w-3.5 h-3.5" />
      {score}
    </span>
  );
}
