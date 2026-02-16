'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect, useCallback } from 'react';
import { User, Settings, LogOut, ChevronDown, LayoutGrid, Shield } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';

export function UserMenu() {
  const { user: clerkUser } = useUser();
  const convexUser = useQuery(api.users.getCurrentUser);
  const [isOpen, setIsOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | HTMLButtonElement)[]>([]);

  const menuItems = [
    { type: 'link' as const, href: (id: string) => `/profile/${id}`, icon: User, label: 'Profile' },
    { type: 'link' as const, href: () => '/workspaces', icon: LayoutGrid, label: 'Workspaces' },
    { type: 'link' as const, href: () => '/settings', icon: Settings, label: 'Settings' },
    ...(convexUser?.isAdmin ? [{ type: 'link' as const, href: () => '/admin', icon: Shield, label: 'Admin Dashboard', isAdmin: true }] : []),
    { type: 'divider' as const },
    { type: 'signout' as const, icon: LogOut, label: 'Sign Out' },
  ];

  const focusableItems = menuItems.filter(item => item.type !== 'divider');

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setFocusIndex(-1);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeMenu]);

  useEffect(() => {
    if (isOpen && focusIndex >= 0 && menuItemsRef.current[focusIndex]) {
      menuItemsRef.current[focusIndex].focus();
    }
  }, [isOpen, focusIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        setFocusIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusIndex(prev => (prev + 1) % focusableItems.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusIndex(prev => prev <= 0 ? focusableItems.length - 1 : prev - 1);
        break;
      case 'Enter':
      case ' ':
        if (focusIndex >= 0 && menuItemsRef.current[focusIndex]) {
          e.preventDefault();
          menuItemsRef.current[focusIndex].click();
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeMenu();
        break;
      case 'Tab':
        closeMenu();
        break;
    }
  };

  const handleTriggerClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      setFocusIndex(0);
    } else {
      closeMenu();
    }
  };

  if (!clerkUser) return null;

  const user = convexUser ? {
    ...convexUser,
    id: convexUser._id,
    name: convexUser.username || clerkUser.fullName,
    email: convexUser.email || clerkUser.primaryEmailAddress?.emailAddress,
    avatarUrl: convexUser.avatarUrl || clerkUser.imageUrl,
  } : { 
    id: clerkUser.id,
    name: clerkUser.fullName, 
    email: clerkUser.primaryEmailAddress?.emailAddress,
    avatarUrl: clerkUser.imageUrl,
  };

  const displayName = user.name;
  const email = user.email;
  const avatarUrl = user.avatarUrl;

return (
    <div className="relative" ref={menuRef}>
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
      >
        <div className="relative w-8 h-8">
          <Image
            src={avatarUrl || ''}
            alt={displayName || 'User'}
            fill
            className="rounded-full object-cover ring-2 ring-indigo-500/20"
          />
        </div>
        <span className="text-sm font-medium text-slate-200 hidden md:block">
          {displayName}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          role="menu"
          aria-label="User menu"
          className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/60 py-2 z-[100] animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="px-4 py-3 border-b border-white/5 mb-2">
            <p className="text-sm font-medium text-white">{displayName}</p>
            <p className="text-xs text-slate-400 truncate">{email}</p>
          </div>
          
          <Link
            ref={el => { if (el) menuItemsRef.current[0] = el; }}
            href={`/profile/${user.id}`}
            role="menuitem"
            tabIndex={focusIndex === 0 ? 0 : -1}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:bg-white/5 focus:text-white"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4" />
            Profile
          </Link>

          <Link
            ref={el => { if (el) menuItemsRef.current[1] = el; }}
            href="/workspaces"
            role="menuitem"
            tabIndex={focusIndex === 1 ? 0 : -1}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:bg-white/5 focus:text-white"
            onClick={() => setIsOpen(false)}
          >
            <LayoutGrid className="w-4 h-4" />
            Workspaces
          </Link>
          
          <Link
            ref={el => { if (el) menuItemsRef.current[2] = el; }}
            href="/settings"
            role="menuitem"
            tabIndex={focusIndex === 2 ? 0 : -1}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:bg-white/5 focus:text-white"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>

          {convexUser?.isAdmin && (
            <Link
              ref={el => { if (el) menuItemsRef.current[3] = el; }}
              href="/admin"
              role="menuitem"
              tabIndex={focusIndex === 3 ? 0 : -1}
              className="flex items-center gap-2 px-4 py-2 text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors focus:outline-none focus:bg-amber-500/10 focus:text-amber-300"
              onClick={() => setIsOpen(false)}
            >
              <Shield className="w-4 h-4" />
              Admin Dashboard
            </Link>
          )}
          
          <div className="border-t border-white/5 my-1" role="separator"></div>
          
          <SignOutButton>
            <button 
              ref={el => { if (el) menuItemsRef.current[convexUser?.isAdmin ? 4 : 3] = el; }}
              role="menuitem"
              tabIndex={focusIndex === (convexUser?.isAdmin ? 4 : 3) ? 0 : -1}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left focus:outline-none focus:bg-red-500/10 focus:text-red-300"
              onClick={() => setIsOpen(false)}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </SignOutButton>
        </div>
      )}
    </div>
  );
}
