'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Rocket, Bell, Briefcase, MessageSquare, Users, LayoutDashboard, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu } from './UserMenu';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/network', label: 'Network', icon: Users },
  { href: '/conversations', label: 'Messages', icon: MessageSquare },
];

export function TopNav() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname();
  const currentUser = useQuery(api.users.getCurrentUser);
  // Get unread notification count
  const unreadCount = useQuery(
    api.notifications.getUnreadCount,
    currentUser ? {} : "skip"
  ) ?? 0;

  // Don't show on landing page
  if (pathname === '/') return null;

  // Don't show on public pages when not signed in
  const publicPaths = ['/sign-in', '/sign-up', '/privacy', '/terms', '/contact', '/cookies', '/acceptable-use', '/disclaimer'];
  if (isLoaded && !isSignedIn && publicPaths.some(p => pathname.startsWith(p))) return null;

  // Don't show if not signed in
  if (isLoaded && !isSignedIn) return null;

  const isEntrepreneur = currentUser?.role === 'entrepreneur';

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0a0a0c]/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#0a0a0c]/80"
    >
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-9 h-9 bg-gradient-to-br from-primary via-[hsl(42_95%_55%)] to-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow duration-300"
            >
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="font-display font-bold text-lg tracking-tight text-white hidden lg:block group-hover:text-primary transition-colors duration-300">
              VentureDeck
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.href)
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Quick Action - Create Project for Entrepreneurs */}
          {isEntrepreneur && (
            <Link href="/projects/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl text-primary text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </motion.button>
            </Link>
          )}

          {/* Notifications */}
          <Link href="/notifications">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>
          </Link>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
      
      {/* Subtle bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </motion.header>
  );
}
