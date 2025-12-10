'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BottomNavContextType {
  setActions: (actions: ReactNode | null) => void;
  actions: ReactNode | null;
}

const BottomNavContext = createContext<BottomNavContextType | undefined>(undefined);

export function BottomNavProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<ReactNode | null>(null);

  return (
    <BottomNavContext.Provider value={{ actions, setActions }}>
      {children}
    </BottomNavContext.Provider>
  );
}

export function useBottomNav() {
  const context = useContext(BottomNavContext);
  if (context === undefined) {
    throw new Error('useBottomNav must be used within a BottomNavProvider');
  }
  return context;
}
