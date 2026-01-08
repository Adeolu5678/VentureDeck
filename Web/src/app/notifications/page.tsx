'use client';

import { Id } from '@convex/_generated/dataModel';
import { useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Bell, Check, ExternalLink, CheckCheck, Home } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useBottomNav } from '@/context/BottomNavContext';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PageHeader } from '@/components/ui/PageHeader';

export default function NotificationsPage() {
  const notifications = useQuery(api.notifications.list);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const { setActions } = useBottomNav();

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  // Set bottom nav actions - context aligned with notifications
  useEffect(() => {
    setActions(
      <div className="flex items-center gap-2 flex-1">
        <Link href="/dashboard" className="flex-1">
          <PremiumButton
            variant="glass"
            className="w-full rounded-full"
            leftIcon={<Home className="w-4 h-4" />}
          >
            Dashboard
          </PremiumButton>
        </Link>
        {unreadCount > 0 && (
          <PremiumButton
            onClick={async () => await markAllAsRead()}
            variant="primary"
            className="flex-1 rounded-full"
            leftIcon={<CheckCheck className="w-4 h-4" />}
          >
            Mark All Read
          </PremiumButton>
        )}
      </div>
    );
    return () => setActions(null);
  }, [setActions, unreadCount, markAllAsRead]);

  if (notifications === undefined) {
    return <div className="min-h-screen text-white flex items-center justify-center">Loading...</div>;
  }

  const handleMarkAsRead = async (id: Id<'notifications'>) => {
    await markAsRead({ notificationId: id });
  };

  return (
    <div className="min-h-screen text-white pb-24">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <PageHeader 
          title="Notifications" 
          description={unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : "You're all caught up!"}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Notifications" }
          ]}
        />

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-2xl border border-white/5">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification._id}
                className={`group relative p-6 rounded-2xl border transition-all ${
                  notification.read 
                    ? 'bg-slate-900/30 border-white/5 opacity-75 hover:opacity-100' 
                    : 'bg-slate-900 border-primary/30 shadow-lg shadow-primary/10'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${notification.read ? 'bg-slate-700' : 'bg-indigo-500'}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-semibold ${notification.read ? 'text-slate-300' : 'text-white'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-3 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-4">
                      {notification.link && (
                        <Link 
                          href={notification.link}
                          className="inline-flex items-center text-xs font-medium text-primary hover:text-indigo-300 transition-colors"
                        >
                          View Details
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      )}
                      {!notification.read && (
                        <button 
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
