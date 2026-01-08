'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { 
  Activity, 
  UserPlus, 
  UserCheck, 
  UserX, 
  CheckCircle, 
  ShieldCheck, 
  DollarSign, 
  Heart, 
  Award, 
  Target, 
  Banknote, 
  Rocket,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { PremiumCard } from '@/components/ui/PremiumCard';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UserPlus,
  UserCheck,
  UserX,
  CheckCircle,
  ShieldCheck,
  DollarSign,
  Heart,
  Award,
  Target,
  Banknote,
  Rocket,
};

const colorMap: Record<string, string> = {
  primary: 'bg-primary/20 text-primary',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  red: 'bg-red-500/20 text-red-400',
  blue: 'bg-blue-500/20 text-blue-400',
  amber: 'bg-amber-500/20 text-amber-400',
  pink: 'bg-pink-500/20 text-pink-400',
  purple: 'bg-purple-500/20 text-purple-400',
  green: 'bg-green-500/20 text-green-400',
  accent: 'bg-accent/20 text-accent',
};

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: number;
  projectId?: string;
  projectTitle?: string;
  icon: string;
  color: string;
}

export function ActivityFeed({ variant = 'entrepreneur' }: { variant?: 'entrepreneur' | 'investor' }) {
  const activities = useQuery(
    variant === 'entrepreneur' 
      ? api.activity.getMyActivities 
      : api.activity.getDiscoverActivity,
    { limit: 10 }
  );

  if (activities === undefined) {
    return (
      <PremiumCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 bg-white/5 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </PremiumCard>
    );
  }

  if (activities.length === 0) {
    return (
      <PremiumCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold">Recent Activity</h3>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No recent activity yet.</p>
          <p className="text-sm mt-1">
            {variant === 'entrepreneur' 
              ? 'Activity will appear as your projects grow.'
              : 'Follow projects to see updates here.'}
          </p>
        </div>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold">Recent Activity</h3>
        </div>
        <span className="text-xs text-muted-foreground">{activities.length} updates</span>
      </div>
      
      <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 -mr-2">
        {(activities as ActivityItem[]).map((activity) => {
          const IconComponent = iconMap[activity.icon] || CheckCircle;
          const colorClass = colorMap[activity.color] || colorMap.primary;
          
          return (
            <div
              key={activity.id}
              className="group"
            >
              {activity.projectId ? (
                <Link 
                  href={`/projects/${activity.projectId}`}
                  className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <ActivityContent 
                    activity={activity} 
                    IconComponent={IconComponent} 
                    colorClass={colorClass} 
                  />
                </Link>
              ) : (
                <div className="flex gap-3 p-2">
                  <ActivityContent 
                    activity={activity} 
                    IconComponent={IconComponent} 
                    colorClass={colorClass} 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PremiumCard>
  );
}

function ActivityContent({ 
  activity, 
  IconComponent, 
  colorClass 
}: { 
  activity: ActivityItem; 
  IconComponent: React.ComponentType<{ className?: string }>; 
  colorClass: string;
}) {
  return (
    <>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
        <IconComponent className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
          {activity.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {activity.description}
        </p>
      </div>
      <div className="text-xs text-muted-foreground shrink-0">
        {formatDistanceToNow(activity.timestamp, { addSuffix: false })}
      </div>
    </>
  );
}

export default ActivityFeed;
