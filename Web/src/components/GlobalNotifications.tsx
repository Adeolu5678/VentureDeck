'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function GlobalNotifications() {
  const notifications = useQuery(api.notifications.list);
  const router = useRouter();
  
  // Keep track of the last notification ID we saw to avoid showing duplicates on initial load
  // or we can just check if the new notification is created AFTER the component mounted.
  // A better approach for "real-time" toasts is to listen to the query and check for *new* items.
  
  const lastNotificationIdRef = useRef<string | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!notifications) return;

    if (isFirstLoad.current) {
      if (notifications.length > 0) {
        lastNotificationIdRef.current = notifications[0]._id;
      }
      isFirstLoad.current = false;
      return;
    }

    const latestNotification = notifications[0];
    if (!latestNotification) return;

    if (latestNotification._id !== lastNotificationIdRef.current) {
      // New notification!
      lastNotificationIdRef.current = latestNotification._id;
      
      // Only show if it's unread (should be, since it's new)
      if (!latestNotification.read) {
        toast(latestNotification.title, {
          description: latestNotification.message,
          action: latestNotification.link ? {
            label: 'View',
            onClick: () => router.push(latestNotification.link!),
          } : undefined,
        });
      }
    }
  }, [notifications, router]);

  return null;
}
