'use client';

import { Sparkles, ArrowRight } from 'lucide-react';

export default function MatchmakingWidget() {
  return (
    <div className="glass-panel rounded-2xl p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/20 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-accent/10 rounded-xl text-accent">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">AI Deal Flow</h2>
          <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-full border border-white/20">Coming Soon</span>
        </div>
        
        <p className="text-slate-300 mb-6 max-w-xl text-lg leading-relaxed">
          Based on your investment thesis, we&apos;ve identified <span className="text-white font-bold">3 high-signal opportunities</span> matching your criteria in Fintech and AI.
        </p>

        <button className="px-6 py-3 bg-white text-black hover:bg-slate-200 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-white/10 hover:shadow-white/20">
          View Matches <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
