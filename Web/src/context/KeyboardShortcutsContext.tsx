'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { PremiumModal } from '@/components/ui/PremiumModal';
import { Keyboard, Command } from 'lucide-react';
import { motion } from 'framer-motion';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  ctrl?: boolean;
  shift?: boolean;
  category: 'navigation' | 'actions' | 'general';
}

interface KeyboardShortcutsContextType {
  registerShortcut: (shortcut: Shortcut) => void;
  unregisterShortcut: (key: string) => void;
  openHelpModal: () => void;
  closeHelpModal: () => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider');
  }
  return context;
}

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  const router = useRouter();
  const [shortcuts, setShortcuts] = useState<Map<string, Shortcut>>(new Map());
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Default shortcuts
  const defaultShortcuts: Shortcut[] = [
    { key: 'd', ctrl: true, description: 'Go to Dashboard', action: () => router.push('/dashboard'), category: 'navigation' },
    { key: 'p', ctrl: true, description: 'Go to Projects', action: () => router.push('/projects'), category: 'navigation' },
    { key: 'n', ctrl: true, description: 'Go to Network', action: () => router.push('/network'), category: 'navigation' },
    { key: 'm', ctrl: true, description: 'Go to Messages', action: () => router.push('/conversations'), category: 'navigation' },
    { key: '/', description: 'Show keyboard shortcuts', action: () => setIsHelpOpen(true), category: 'general' },
  ];

  const registerShortcut = useCallback((shortcut: Shortcut) => {
    setShortcuts(prev => {
      const next = new Map(prev);
      const key = `${shortcut.ctrl ? 'ctrl+' : ''}${shortcut.shift ? 'shift+' : ''}${shortcut.key}`;
      next.set(key, shortcut);
      return next;
    });
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts(prev => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const openHelpModal = useCallback(() => setIsHelpOpen(true), []);
  const closeHelpModal = useCallback(() => setIsHelpOpen(false), []);

  // Register default shortcuts on mount
  useEffect(() => {
    defaultShortcuts.forEach(registerShortcut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Global keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      const key = `${e.ctrlKey || e.metaKey ? 'ctrl+' : ''}${e.shiftKey ? 'shift+' : ''}${e.key.toLowerCase()}`;
      const shortcut = shortcuts.get(key);

      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  // Group shortcuts by category
  const groupedShortcuts = Array.from(shortcuts.values()).reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  const categoryLabels = {
    navigation: 'Navigation',
    actions: 'Actions',
    general: 'General',
  };

  return (
    <KeyboardShortcutsContext.Provider value={{ registerShortcut, unregisterShortcut, openHelpModal, closeHelpModal }}>
      {children}

      <PremiumModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Keyboard Shortcuts"
        description="Navigate faster with keyboard shortcuts"
        size="md"
      >
        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {categoryLabels[category as keyof typeof categoryLabels] || category}
              </h4>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <motion.div
                    key={`${shortcut.key}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between py-2 px-3 bg-white/[0.02] rounded-lg border border-white/[0.05]"
                  >
                    <span className="text-sm text-foreground">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.ctrl && (
                        <>
                          <kbd className="px-2 py-1 text-xs font-mono bg-white/10 rounded border border-white/20">
                            <Command className="w-3 h-3 inline-block" />
                          </kbd>
                          <span className="text-muted-foreground">+</span>
                        </>
                      )}
                      {shortcut.shift && (
                        <>
                          <kbd className="px-2 py-1 text-xs font-mono bg-white/10 rounded border border-white/20">
                            Shift
                          </kbd>
                          <span className="text-muted-foreground">+</span>
                        </>
                      )}
                      <kbd className="px-2 py-1 text-xs font-mono bg-white/10 rounded border border-white/20 uppercase">
                        {shortcut.key}
                      </kbd>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Keyboard className="w-4 h-4" />
            Press <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded mx-1">/</kbd> anywhere to show this help
          </p>
        </div>
      </PremiumModal>
    </KeyboardShortcutsContext.Provider>
  );
}
