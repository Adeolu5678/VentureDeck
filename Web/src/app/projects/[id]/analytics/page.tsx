'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../../../Convex/convex/_generated/api';
import { Id } from '../../../../../../Convex/convex/_generated/dataModel';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  TrendingUp,
  Eye,
  Users,
  DollarSign,
  FileText,
  RefreshCw,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { TractionScoreBadge } from '@/components/ui/TractionScoreBadge';
import { formatDistanceToNow } from 'date-fns';
import { logError } from '@/lib/errorTracking';

export default function ProjectAnalyticsPage() {
  const { id } = useParams();
  const projectId = id as string;
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(14);

  const analytics = useQuery(api.analytics.getProjectAnalytics, { 
    projectId: projectId as Id<'projects'>,
    days: timeRange,
  });
  
  const scoreBreakdown = useQuery(api.scoring.getScoreBreakdown, {
    projectId: projectId as Id<'projects'>,
  });
  
  const project = useQuery(api.projects.get, { id: projectId as Id<'projects'> });
  const refreshScore = useMutation(api.scoring.refreshScore);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshScore = async () => {
    setIsRefreshing(true);
    try {
      await refreshScore({ projectId: projectId as Id<'projects'> });
    } catch (error) {
      logError(error, { component: 'ProjectAnalyticsPage', action: 'refreshScore' });
    }
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="animate-pulse text-neutral-400">Loading...</div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Header */}
      <div className="bg-neutral-800/50 border-b border-neutral-700/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href={`/projects/${projectId}`}
            className="inline-flex items-center text-sm text-neutral-400 hover:text-neutral-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Project
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-100">{project.title}</h1>
              <p className="text-neutral-500">Analytics Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <div className="flex items-center gap-1 bg-neutral-800 rounded-lg p-1">
                {[7, 14, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => setTimeRange(days as 7 | 14 | 30)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      timeRange === days
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Eye}
            label="Views Today"
            value={analytics?.realtime.todayViews || 0}
            subValue={`${analytics?.realtime.todayUniqueViews || 0} unique`}
            color="blue"
          />
          <StatCard
            icon={Users}
            label="Total Followers"
            value={analytics?.realtime.totalFollowers || 0}
            color="pink"
          />
          <StatCard
            icon={DollarSign}
            label="Soft Circle Total"
            value={formatCurrency(analytics?.realtime.totalSoftCircle || 0)}
            subValue={`${analytics?.realtime.softCircleCount || 0} investors`}
            color="emerald"
          />
          <StatCard
            icon={FileText}
            label="Applications"
            value={analytics?.realtime.applicationCount || 0}
            subValue={`${analytics?.realtime.pendingApplications || 0} pending`}
            color="amber"
          />
        </div>

        {/* Traction Score Section */}
        <div className="bg-neutral-800/50 rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-neutral-100">Traction Score</h2>
            </div>
            <button
              onClick={handleRefreshScore}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 bg-neutral-700/50 hover:bg-neutral-700 rounded-lg text-sm text-neutral-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="flex items-center gap-8">
            <TractionScoreBadge
              score={scoreBreakdown?.score || 0}
              breakdown={scoreBreakdown?.breakdown}
              size="lg"
            />
            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {scoreBreakdown?.breakdown && Object.entries(scoreBreakdown.breakdown).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-lg font-bold text-neutral-100">{value}</p>
                    <p className="text-xs text-neutral-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {scoreBreakdown?.lastUpdated && (
            <p className="text-xs text-neutral-500 mt-4">
              Last updated {formatDistanceToNow(scoreBreakdown.lastUpdated, { addSuffix: true })}
            </p>
          )}
        </div>

        {/* Views Trend Chart (Simple CSS-based visualization) */}
        <div className="bg-neutral-800/50 rounded-xl border border-neutral-700/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-neutral-100">Views Trend</h2>
          </div>

          {analytics?.snapshots && analytics.snapshots.length > 0 ? (
            <div className="space-y-4">
              {/* Simple Bar Chart */}
              <div className="flex items-end gap-1 h-40">
                {analytics.snapshots.map((snapshot, idx) => {
                  const maxViews = Math.max(...analytics.snapshots.map(s => s.views), 1);
                  const height = (snapshot.views / maxViews) * 100;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex-1 bg-gradient-to-t from-blue-500/50 to-blue-400/30 rounded-t-sm relative group"
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-xs whitespace-nowrap">
                          <p className="text-neutral-300">{snapshot.views} views</p>
                          <p className="text-neutral-500">{new Date(snapshot.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {/* X-axis labels */}
              <div className="flex justify-between text-xs text-neutral-500">
                <span>{new Date(analytics.snapshots[0]?.date).toLocaleDateString()}</span>
                <span>{new Date(analytics.snapshots[analytics.snapshots.length - 1]?.date).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-neutral-500">
              <div className="text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No data yet</p>
                <p className="text-xs">Analytics will appear as your project gets views</p>
              </div>
            </div>
          )}
        </div>

        {/* Engagement Summary */}
        <div className="bg-neutral-800/50 rounded-xl border border-neutral-700/50 p-6">
          <h2 className="text-lg font-semibold text-neutral-100 mb-4">Engagement Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-900/50 rounded-lg">
              <p className="text-sm text-neutral-400 mb-1">View to Follow Ratio</p>
              <p className="text-2xl font-bold text-neutral-100">
                {analytics?.realtime.totalFollowers && analytics.snapshots.length > 0
                  ? `${((analytics.realtime.totalFollowers / Math.max(1, analytics.snapshots.reduce((sum, s) => sum + s.views, 0))) * 100).toFixed(1)}%`
                  : '--'}
              </p>
            </div>
            <div className="p-4 bg-neutral-900/50 rounded-lg">
              <p className="text-sm text-neutral-400 mb-1">Funding Progress</p>
              <p className="text-2xl font-bold text-neutral-100">
                {project.fundingGoal > 0
                  ? `${((analytics?.realtime.totalSoftCircle || 0) / project.fundingGoal * 100).toFixed(1)}%`
                  : '--'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subValue?: string;
  color: 'blue' | 'pink' | 'emerald' | 'amber';
}) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    pink: 'bg-pink-500/20 text-pink-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
  };

  return (
    <div className="bg-neutral-800/50 rounded-xl border border-neutral-700/50 p-4">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-neutral-100">{value}</p>
      <p className="text-sm text-neutral-500">{label}</p>
      {subValue && <p className="text-xs text-neutral-600 mt-1">{subValue}</p>}
    </div>
  );
}
