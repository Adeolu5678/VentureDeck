'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../Convex/convex/_generated/api';
import { 
  Search, 
  Save, 
  Play, 
  Trash2, 
  Bell, 
  BellOff,
  Filter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface SearchFilters {
  industries?: string[];
  stages?: string[];
  minFunding?: number;
  maxFunding?: number;
  minTractionScore?: number;
  tags?: string[];
  location?: string;
}

interface SavedSearchesProps {
  onApplyFilters?: (filters: SearchFilters) => void;
  className?: string;
}

const INDUSTRIES = [
  'Fintech', 'Healthcare', 'E-commerce', 'SaaS', 'AI/ML', 
  'Climate', 'Education', 'Gaming', 'Social', 'Other'
];

const STAGES = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'mvp', label: 'MVP' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B+' },
  { value: 'growth', label: 'Growth' },
];

export function SavedSearches({ onApplyFilters, className = '' }: SavedSearchesProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // New search state
  const [newSearchName, setNewSearchName] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});

  const savedSearches = useQuery(api.savedSearches.list) || [];
  const createSearch = useMutation(api.savedSearches.create);
  const deleteSearch = useMutation(api.savedSearches.remove);
  const updateSearch = useMutation(api.savedSearches.update);

  const handleCreate = async () => {
    if (!newSearchName.trim()) {
      toast.error('Please enter a name for your search');
      return;
    }

    try {
      await createSearch({
        name: newSearchName,
        filters: filters,
        alertEnabled: false,
      });
      toast.success('Search saved!');
      setNewSearchName('');
      setFilters({});
      setIsCreating(false);
    } catch {
      toast.error('Failed to save search');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await deleteSearch({ id: id as any });
      toast.success('Search deleted');
    } catch {
      toast.error('Failed to delete search');
    }
  };

  const handleToggleAlert = async (id: string, currentState: boolean) => {
    try {
      await updateSearch({ 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: id as any, 
        alertEnabled: !currentState 
      });
      toast.success(currentState ? 'Alerts disabled' : 'Alerts enabled');
    } catch {
      toast.error('Failed to update alerts');
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <div className={`bg-neutral-800/50 rounded-xl border border-neutral-700/50 ${className}`}>
      <div className="p-4 border-b border-neutral-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-amber-400" />
            <h3 className="font-medium text-neutral-100">Saved Searches</h3>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
          >
            {isCreating ? 'Cancel' : '+ New Search'}
          </button>
        </div>
      </div>

      {/* Create New Search Form */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 border-b border-neutral-700/50 space-y-4"
        >
          <input
            type="text"
            placeholder="Search name..."
            value={newSearchName}
            onChange={(e) => setNewSearchName(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />

          {/* Industries */}
          <div>
            <label className="text-xs text-neutral-400 mb-2 block">Industries</label>
            <div className="flex flex-wrap gap-1">
              {INDUSTRIES.map(ind => (
                <button
                  key={ind}
                  onClick={() => {
                    const current = filters.industries || [];
                    setFilters({
                      ...filters,
                      industries: current.includes(ind)
                        ? current.filter(i => i !== ind)
                        : [...current, ind]
                    });
                  }}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    filters.industries?.includes(ind)
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                      : 'bg-neutral-700/50 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Stages */}
          <div>
            <label className="text-xs text-neutral-400 mb-2 block">Stages</label>
            <div className="flex flex-wrap gap-1">
              {STAGES.map(stage => (
                <button
                  key={stage.value}
                  onClick={() => {
                    const current = filters.stages || [];
                    setFilters({
                      ...filters,
                      stages: current.includes(stage.value)
                        ? current.filter(s => s !== stage.value)
                        : [...current, stage.value]
                    });
                  }}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    filters.stages?.includes(stage.value)
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                      : 'bg-neutral-700/50 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Funding Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Min Funding</label>
              <input
                type="number"
                placeholder="$0"
                value={filters.minFunding || ''}
                onChange={(e) => setFilters({ ...filters, minFunding: Number(e.target.value) || undefined })}
                className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-100"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 mb-1 block">Max Funding</label>
              <input
                type="number"
                placeholder="No max"
                value={filters.maxFunding || ''}
                onChange={(e) => setFilters({ ...filters, maxFunding: Number(e.target.value) || undefined })}
                className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-100"
              />
            </div>
          </div>

          {/* Min Traction Score */}
          <div>
            <label className="text-xs text-neutral-400 mb-1 block">
              Min Traction Score: {filters.minTractionScore || 0}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minTractionScore || 0}
              onChange={(e) => setFilters({ ...filters, minTractionScore: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={!newSearchName.trim()}
            className="w-full py-2 bg-amber-500/20 text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 inline mr-2" />
            Save Search
          </button>
        </motion.div>
      )}

      {/* Saved Searches List */}
      <div className="divide-y divide-neutral-700/50">
        {savedSearches.length === 0 ? (
          <div className="p-6 text-center">
            <Search className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm text-neutral-500">No saved searches yet</p>
            <p className="text-xs text-neutral-600 mt-1">Create one to quickly filter projects</p>
          </div>
        ) : (
          savedSearches.map((search) => (
            <div key={search._id} className="p-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setExpandedId(expandedId === search._id ? null : search._id)}
                  className="flex items-center gap-2 text-left flex-1"
                >
                  <span className="text-sm font-medium text-neutral-200">{search.name}</span>
                  {expandedId === search._id ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleAlert(search._id, search.alertEnabled || false)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      search.alertEnabled 
                        ? 'text-amber-400 bg-amber-500/20' 
                        : 'text-neutral-500 hover:bg-neutral-700'
                    }`}
                    title={search.alertEnabled ? 'Disable alerts' : 'Enable alerts'}
                  >
                    {search.alertEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onApplyFilters?.(search.filters)}
                    className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    title="Run search"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(search._id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {expandedId === search._id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 pt-2 border-t border-neutral-700/30"
                >
                  <div className="flex flex-wrap gap-1 text-xs">
                    {search.filters.industries?.map(ind => (
                      <span key={ind} className="px-2 py-0.5 bg-neutral-700/50 rounded-full text-neutral-300">
                        {ind}
                      </span>
                    ))}
                    {search.filters.stages?.map(stage => (
                      <span key={stage} className="px-2 py-0.5 bg-blue-500/20 rounded-full text-blue-300">
                        {stage}
                      </span>
                    ))}
                    {search.filters.minFunding && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 rounded-full text-emerald-300">
                        Min: {formatCurrency(search.filters.minFunding)}
                      </span>
                    )}
                    {search.filters.maxFunding && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 rounded-full text-emerald-300">
                        Max: {formatCurrency(search.filters.maxFunding)}
                      </span>
                    )}
                    {search.filters.minTractionScore && search.filters.minTractionScore > 0 && (
                      <span className="px-2 py-0.5 bg-amber-500/20 rounded-full text-amber-300">
                        Traction ≥{search.filters.minTractionScore}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
