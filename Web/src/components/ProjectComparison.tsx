'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check, Minus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { TractionScoreInline } from './ui/TractionScoreBadge';

interface Project {
  _id: string;
  title: string;
  tagline: string;
  industry: string;
  fundingGoal: number;
  equityOffered: number;
  tractionScore?: number;
  stage?: string;
  location?: string;
  tags?: string[];
  logoUrl?: string;
}

interface ProjectComparisonProps {
  projects: Project[];
  onRemove: (projectId: string) => void;
  onClose: () => void;
  maxProjects?: number;
}

export function ProjectComparison({
  projects,
  onRemove,
  onClose,
  maxProjects = 3,
}: ProjectComparisonProps) {
  if (projects.length === 0) return null;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const comparisonFields = [
    { 
      key: 'fundingGoal', 
      label: 'Funding Goal',
      format: (v: number) => formatCurrency(v),
      compare: 'lower' as const, // Lower is better (more achievable)
    },
    { 
      key: 'equityOffered', 
      label: 'Equity Offered',
      format: (v: number) => `${v}%`,
      compare: 'lower' as const, // Lower equity = founder-friendly
    },
    { 
      key: 'tractionScore', 
      label: 'Traction Score',
      format: (v: number | undefined) => v ?? 0,
      compare: 'higher' as const, // Higher is better
    },
    { 
      key: 'industry', 
      label: 'Industry',
      format: (v: string) => v,
    },
    { 
      key: 'stage', 
      label: 'Stage',
      format: (v: string | undefined) => v || 'Not set',
    },
    { 
      key: 'location', 
      label: 'Location',
      format: (v: string | undefined) => v || 'Not set',
    },
  ];

  const getBestValue = (key: string, compare?: 'higher' | 'lower') => {
    if (!compare) return null;
    const values = projects.map(p => p[key as keyof Project] as number || 0);
    if (compare === 'higher') return Math.max(...values);
    return Math.min(...values);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-100">Compare Projects</h2>
            <button
              onClick={onClose}
              aria-label="Close comparison"
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comparison Grid */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700/50">
                  <th className="text-left p-4 text-sm font-medium text-neutral-500 w-32">
                    Metric
                  </th>
                  {projects.map((project) => (
                    <th key={project._id} className="p-4 min-w-[200px]">
                      <div className="flex flex-col items-center gap-2">
                        {project.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.logoUrl}
                            alt={project.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center text-xl font-bold text-amber-400">
                            {project.title[0]}
                          </div>
                        )}
                        <span className="text-sm font-medium text-neutral-200 text-center line-clamp-1">
                          {project.title}
                        </span>
                        <button
                          onClick={() => onRemove(project._id)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                  {/* Empty slots */}
                  {Array.from({ length: maxProjects - projects.length }).map((_, idx) => (
                    <th key={`empty-${idx}`} className="p-4 min-w-[200px]">
                      <div className="flex flex-col items-center gap-2 opacity-50">
                        <div className="w-12 h-12 rounded-lg border-2 border-dashed border-neutral-700 flex items-center justify-center">
                          <span className="text-neutral-600">+</span>
                        </div>
                        <span className="text-xs text-neutral-600">Add project</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFields.map((field) => {
                  const bestValue = getBestValue(field.key, field.compare);
                  
                  return (
                    <tr key={field.key} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                      <td className="p-4 text-sm text-neutral-400">
                        {field.label}
                      </td>
                      {projects.map((project) => {
                        const value = project[field.key as keyof Project];
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const formattedValue = (field.format as any)(value);
                        const isBest = field.compare && value === bestValue && projects.length > 1;
                        
                        return (
                          <td key={project._id} className="p-4 text-center">
                            <span className={`text-sm ${isBest ? 'text-emerald-400 font-medium' : 'text-neutral-300'}`}>
                              {field.key === 'tractionScore' ? (
                                <TractionScoreInline score={value as number || 0} />
                              ) : (
                                formattedValue
                              )}
                              {isBest && <Check className="w-4 h-4 inline ml-1" />}
                            </span>
                          </td>
                        );
                      })}
                      {Array.from({ length: maxProjects - projects.length }).map((_, idx) => (
                        <td key={`empty-${idx}`} className="p-4 text-center">
                          <Minus className="w-4 h-4 text-neutral-700 mx-auto" />
                        </td>
                      ))}
                    </tr>
                  );
                })}

                {/* Tags Row */}
                <tr className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                  <td className="p-4 text-sm text-neutral-400">Tags</td>
                  {projects.map((project) => (
                    <td key={project._id} className="p-4">
                      <div className="flex flex-wrap justify-center gap-1">
                        {project.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-neutral-700/50 rounded-full text-neutral-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {!project.tags?.length && (
                          <span className="text-xs text-neutral-600">No tags</span>
                        )}
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: maxProjects - projects.length }).map((_, idx) => (
                    <td key={`empty-${idx}`} className="p-4 text-center">
                      <Minus className="w-4 h-4 text-neutral-700 mx-auto" />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-neutral-700/50 flex items-center justify-center gap-3">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/projects/${project._id}`}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg text-sm hover:bg-amber-500/30 transition-colors"
              >
                View {project.title}
                <ExternalLink className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Floating Compare Bar Component
interface CompareBarProps {
  selectedProjects: Project[];
  onRemove: (projectId: string) => void;
  onCompare: () => void;
  onClear: () => void;
}

export const CompareBar = memo(function CompareBar({
  selectedProjects,
  onRemove,
  onCompare,
  onClear,
}: CompareBarProps) {
  if (selectedProjects.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-neutral-800 border border-neutral-700 rounded-2xl px-4 py-3 shadow-2xl"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {selectedProjects.map((project) => (
            <div
              key={project._id}
              className="relative group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center text-sm font-bold text-amber-400 border border-neutral-600">
                {project.title[0]}
              </div>
              <button
                onClick={() => onRemove(project._id)}
                aria-label={`Remove ${project.title} from comparison`}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
          {selectedProjects.length < 3 && (
            <div className="w-10 h-10 rounded-lg border-2 border-dashed border-neutral-600 flex items-center justify-center text-neutral-500">
              +
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onCompare}
            disabled={selectedProjects.length < 2}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-neutral-900 rounded-lg text-sm font-medium hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Compare {selectedProjects.length}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClear}
            aria-label="Clear all selections"
            className="p-2 text-neutral-500 hover:text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
</div>
      </div>
    </motion.div>
  );
});
