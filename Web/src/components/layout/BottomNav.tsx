'use client';

import { usePathname } from 'next/navigation';
import { useBottomNav } from '@/context/BottomNavContext';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';

export function BottomNav() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const { actions } = useBottomNav();

  // Don't show on public pages (homepage, sign-in, sign-up, etc.)
  const publicPaths = ['/', '/sign-in', '/sign-up', '/privacy', '/terms', '/contact'];
  const isPublicPage = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));

  // Don't show if not loaded, no user, public page, or no actions
  if (!isLoaded || !user || isPublicPage || !actions) return null;

  return (
    <motion.nav 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="relative">
        {/* Glow effect behind nav */}
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl opacity-50" />
        
        <div className="relative glass-panel rounded-full shadow-2xl shadow-black/50 flex items-center h-[60px] px-4 gap-3 border-primary/10">
          {/* Dynamic Page Actions */}
          <div className="flex items-center justify-center flex-1 gap-2 min-w-0">
            {actions}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
