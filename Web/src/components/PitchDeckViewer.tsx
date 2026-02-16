'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FileText, ExternalLink, Maximize2, Minimize2, X } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { motion, AnimatePresence } from 'framer-motion';

const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS))
    .filter((el) => (el as HTMLElement).offsetParent !== null) as HTMLElement[];
}

interface PitchDeckViewerProps {
  url: string;
  title?: string;
}

export function PitchDeckViewer({ url, title = 'Pitch Deck' }: PitchDeckViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  }, [handleClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Tab" || !modalRef.current) return;

    const focusableElements = getFocusableElements(modalRef.current);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      requestAnimationFrame(() => {
        if (modalRef.current) {
          const focusableElements = getFocusableElements(modalRef.current);
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
      });
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
      previousActiveElement.current?.focus();
    };
  }, [isOpen, handleEscape, handleKeyDown]);

  // Check if URL is a PDF or image
  const isPdf = url.toLowerCase().endsWith('.pdf') || (() => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'storage.googleapis.com';
    } catch {
      return false;
    }
  })();
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

  return (
    <>
      {/* Trigger Button */}
      <PremiumButton 
        variant="glass" 
        onClick={() => setIsOpen(true)}
        leftIcon={<FileText className="w-4 h-4" />}
      >
        View Pitch Deck
      </PremiumButton>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
{/* Content */}
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="pitch-deck-title"
              className={`relative bg-card border border-border rounded-2xl overflow-hidden ${
                isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl h-[80vh]'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/50">
                <h3 id="pitch-deck-title" className="font-bold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  {title}
                </h3>
                <div className="flex items-center gap-2">
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
onClick={() => setIsOpen(false)}
                    aria-label="Close"
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Viewer */}
              <div className="h-[calc(100%-60px)] bg-slate-950">
                {isPdf ? (
                  <object
                    data={url}
                    type="application/pdf"
                    className="w-full h-full"
                  >
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Unable to display PDF in browser.
                      </p>
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open PDF in new tab
                      </a>
                    </div>
                  </object>
                ) : isImage ? (
                  <div className="w-full h-full flex items-center justify-center p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={url} 
                      alt={title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <iframe
                    src={url}
                    className="w-full h-full border-0"
                    title={title}
                    allowFullScreen
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PitchDeckViewer;
