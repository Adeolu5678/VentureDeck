'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, CircleDashed, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface MatchExplanation {
  category: string;
  matched: boolean;
  reason: string;
  score: number;
  maxScore: number;
}

interface MatchExplanationProps {
  explanations: MatchExplanation[];
  totalScore: number;
  maxScore?: number;
  compact?: boolean;
}

export function MatchExplanationCard({
  explanations,
  totalScore,
  maxScore = 100,
  compact = false,
}: MatchExplanationProps) {
  const [expanded, setExpanded] = useState(!compact);

  const percentage = Math.round((totalScore / maxScore) * 100);

  const getMatchColor = (pct: number) => {
    if (pct >= 80) return { ring: 'ring-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (pct >= 60) return { ring: 'ring-amber-500', text: 'text-amber-400', bg: 'bg-amber-500' };
    if (pct >= 40) return { ring: 'ring-orange-500', text: 'text-orange-400', bg: 'bg-orange-500' };
    return { ring: 'ring-neutral-500', text: 'text-neutral-400', bg: 'bg-neutral-500' };
  };

  const colors = getMatchColor(percentage);

  if (compact) {
    return (
      <div className="bg-neutral-800/50 rounded-lg border border-neutral-700/50">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${colors.ring} ring-2 flex items-center justify-center bg-neutral-800`}>
              <span className={`text-sm font-bold ${colors.text}`}>{percentage}%</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-neutral-200">Match Score</p>
              <p className="text-xs text-neutral-500">
                {explanations.filter(e => e.matched).length}/{explanations.length} criteria matched
              </p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          )}
        </button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="px-3 pb-3 space-y-2"
          >
            {explanations.map((exp, idx) => (
              <ExplanationRow key={idx} explanation={exp} />
            ))}
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-neutral-800/50 rounded-xl border border-neutral-700/50 p-4">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-14 h-14 rounded-full ${colors.ring} ring-2 flex items-center justify-center bg-neutral-800`}>
          <span className={`text-xl font-bold ${colors.text}`}>{percentage}%</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-neutral-100">Match Score</h3>
          <p className="text-sm text-neutral-500">
            Based on your investment thesis
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {explanations.map((exp, idx) => (
          <ExplanationRow key={idx} explanation={exp} showIcon />
        ))}
      </div>
    </div>
  );
}

function ExplanationRow({ 
  explanation, 
  showIcon = false 
}: { 
  explanation: MatchExplanation; 
  showIcon?: boolean;
}) {
  const percentage = (explanation.score / explanation.maxScore) * 100;

  return (
    <div className="flex items-start gap-3 p-2 rounded-lg bg-neutral-900/50">
      <div className="flex items-center gap-2 w-28 shrink-0">
        {showIcon && (
          <span className="text-base">{getCategoryIcon(explanation.category)}</span>
        )}
        {explanation.matched ? (
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : explanation.score > 0 ? (
          <CircleDashed className="w-4 h-4 text-amber-400 shrink-0" />
        ) : (
          <XCircle className="w-4 h-4 text-neutral-500 shrink-0" />
        )}
        <span className="text-xs font-medium text-neutral-300 truncate">
          {explanation.category}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              className={`h-full ${
                explanation.matched 
                  ? 'bg-emerald-500' 
                  : explanation.score > 0 
                    ? 'bg-amber-500' 
                    : 'bg-neutral-600'
              }`}
            />
          </div>
          <span className="text-xs font-medium text-neutral-400 w-14 text-right shrink-0">
            {explanation.score}/{explanation.maxScore}
          </span>
        </div>
        <p className="text-xs text-neutral-500 truncate">
          {explanation.reason}
        </p>
      </div>
    </div>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Industry': '🏭',
    'Investment Size': '💰',
    'Stage': '📈',
    'Location': '📍',
    'Traction': '🚀',
    'Interests': '🎯',
  };
  return icons[category] || '📋';
}
