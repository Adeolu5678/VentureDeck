'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function GlobalNotifications() {
  const notifications = useQuery(api.notifications.list);
  const router = useRouter();
  
  const lastNotificationIdRef = useRef<string | null>(null);
  const isFirstLoad = useRef(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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
      lastNotificationIdRef.current = latestNotification._id;
      
      if (!latestNotification.read && isMountedRef.current) {
        toast(latestNotification.title, {
          description: latestNotification.message,
          action: latestNotification.link ? {
            label: 'View',
            onClick: () => {
              if (isMountedRef.current && latestNotification.link) {
                router.push(latestNotification.link);
              }
            },
          } : undefined,
        });
      }
    }
  }, [notifications, router]);

  return null;
}
