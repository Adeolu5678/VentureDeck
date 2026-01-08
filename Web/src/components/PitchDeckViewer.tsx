'use client';

import { useState } from 'react';
import { FileText, ExternalLink, Maximize2, Minimize2, X } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { motion, AnimatePresence } from 'framer-motion';

interface PitchDeckViewerProps {
  url: string;
  title?: string;
}

export function PitchDeckViewer({ url, title = 'Pitch Deck' }: PitchDeckViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if URL is a PDF or image
  const isPdf = url.toLowerCase().endsWith('.pdf') || url.includes('storage.googleapis.com');
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative bg-card border border-border rounded-2xl overflow-hidden ${
                isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl h-[80vh]'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/50">
                <h3 className="font-bold text-lg flex items-center gap-2">
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
