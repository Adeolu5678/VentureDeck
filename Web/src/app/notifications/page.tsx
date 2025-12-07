'use client';

import { Id } from '@convex/_generated/dataModel';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Bell, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
  const notifications = useQuery(api.notifications.list);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  if (notifications === undefined) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: Id<'notifications'>) => {
    await markAsRead({ notificationId: id });
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

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
                          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                        >
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
