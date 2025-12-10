'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';
import { useBottomNav } from '@/context/BottomNavContext';
import { useUser } from '@clerk/nextjs';

export function BottomNav() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { actions } = useBottomNav();

  if (!isLoaded || !user) return null;

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
      <div className="glass-panel rounded-full shadow-2xl shadow-black/50 flex items-center justify-between h-16 px-4 gap-4">
        {/* Persistent Navigation Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-10 h-10 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
            title="Dashboard"
          >
            <Home className="w-5 h-5" />
          </Link>
          
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Page Actions */}
        <div className="flex items-center justify-end flex-1 gap-2 min-w-0">
          {actions}
        </div>
      </div>
    </nav>
  );
}
