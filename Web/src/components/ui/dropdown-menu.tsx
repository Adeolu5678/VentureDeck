import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, open, onOpenChange }) => {
  const [isOpenState, setIsOpenState] = useState(false);
  const isOpen = open !== undefined ? open : isOpenState;
  const setIsOpen = onOpenChange || setIsOpenState;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return React.cloneElement(child as React.ReactElement<any>, { isOpen, setIsOpen });
        }
        return child;
      })}
    </div>
  );
};

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode; asChild?: boolean; isOpen?: boolean; setIsOpen?: (open: boolean) => void }
>(({ children, asChild, isOpen, setIsOpen, ...props }, ref) => {
  const handleClick = () => {
    setIsOpen?.(!isOpen);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
      ...props,
      onClick: handleClick,
    });
  }

  return (
    <button onClick={handleClick} ref={ref} {...props}>
      {children}
    </button>
  );
});
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; align?: 'start' | 'end' | 'center'; isOpen?: boolean; setIsOpen?: (open: boolean) => void; className?: string }
>(({ children, align = 'center', isOpen, setIsOpen: _setIsOpen, className, ...props }, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = _setIsOpen;
  if (!isOpen) return null;

  const alignClass =
    align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2';

  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-slate-800 bg-slate-950 p-1 text-slate-50 shadow-md animate-in fade-in-0 zoom-in-95',
        alignClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; onClick?: () => void; className?: string }
>(({ children, onClick, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-800 hover:text-slate-50 focus:bg-slate-800 focus:text-slate-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-slate-800', className)}
      {...props}
    />
  );
});
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
