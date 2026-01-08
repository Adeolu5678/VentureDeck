'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Sparkles, ArrowRight, Building2, Target } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MatchmakingWidget() {
  const matches = useQuery(api.matchmaking.getMatches);
  const currentUser = useQuery(api.users.getCurrentUser);

  // Only show for investors
  if (!currentUser || currentUser.role !== 'investor') {
    return null;
  }

  const isLoading = matches === undefined;
  const hasMatches = matches && matches.length > 0;
  const topMatches = matches?.slice(0, 3) || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-panel rounded-2xl p-8 relative overflow-hidden group"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/20 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Deal Flow</h2>
            <p className="text-slate-400 text-sm">Personalized opportunities for you</p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center gap-3 py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-400">Analyzing opportunities...</span>
          </div>
        ) : hasMatches ? (
          <>
            <p className="text-slate-300 mb-6 text-lg leading-relaxed">
              Based on your investment thesis, we&apos;ve identified{' '}
              <span className="text-white font-bold">{matches.length} high-signal opportunities</span>{' '}
              matching your criteria.
            </p>

            {/* Top Matches Preview */}
            <div className="space-y-3 mb-6">
              {topMatches.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link 
                    href={`/projects/${project._id}`}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group/card"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-accent/30 rounded-xl flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white truncate">{project.title}</h3>
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full font-medium">
                          {project.matchScore}% match
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm truncate">{project.tagline}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-emerald-400 font-bold">
                        ${(project.fundingGoal / 1000).toFixed(0)}K
                      </div>
                      <div className="text-slate-500 text-xs">{project.industry}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover/card:text-white transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <Link 
              href="/projects" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
            >
              <Target className="w-5 h-5" />
              View All Matches
              <ArrowRight className="w-4 h-4" />
            </Link>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="text-slate-400 mb-4">
              No matches found yet. Complete your investment profile to get personalized recommendations.
            </div>
            <Link 
              href="/settings" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
            >
              Complete Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
