'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { Award, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { PremiumButton } from '@/components/ui/PremiumButton';

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

interface VouchModalProps {
  targetUserId: Id<'users'>;
  targetUserName: string;
  isOpen: boolean;
  onClose: () => void;
}

const RELATIONSHIP_OPTIONS = [
  'Former Co-founder',
  'Former Colleague',
  'Business Partner',
  'Investor',
  'Advisor/Mentor',
  'Client',
  'Friend',
  'Other',
];

export function VouchModal({ targetUserId, targetUserName, isOpen, onClose }: VouchModalProps) {
  const [relationship, setRelationship] = useState('');
  const [customRelationship, setCustomRelationship] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const createVouch = useMutation(api.vouches.create);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  }, [onClose]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalRelationship = relationship === 'Other' ? customRelationship : relationship;
    
    if (!finalRelationship.trim()) {
      toast.error('Please specify your relationship');
      return;
    }
    
    if (!text.trim()) {
      toast.error('Please write a vouch message');
      return;
    }

    setIsSubmitting(true);
    try {
      await createVouch({
        targetId: targetUserId,
        relationship: finalRelationship,
        text: text.trim(),
      });
      toast.success('Vouch submitted successfully!');
      onClose();
      // Reset form
      setRelationship('');
      setCustomRelationship('');
      setText('');
    } catch {
      toast.error('Failed to submit vouch');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vouch-modal-title"
            className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 id="vouch-modal-title" className="text-lg font-bold">Write a Vouch</h2>
                  <p className="text-sm text-muted-foreground">for {targetUserName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Relationship */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg p-3 text-sm focus:border-primary outline-none"
                  required
                >
                  <option value="">Select relationship...</option>
                  {RELATIONSHIP_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                
                {relationship === 'Other' && (
                  <input
                    type="text"
                    value={customRelationship}
                    onChange={(e) => setCustomRelationship(e.target.value)}
                    placeholder="Specify relationship..."
                    className="w-full mt-2 bg-input border border-border rounded-lg p-3 text-sm focus:border-primary outline-none"
                    required
                  />
                )}
              </div>

              {/* Vouch Text */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Vouch
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Why do you vouch for ${targetUserName}? Share your experience working with them, their strengths, and what makes them stand out...`}
                  className="w-full bg-input border border-border rounded-lg p-3 text-sm focus:border-primary outline-none h-32 resize-none"
                  required
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground text-right mt-1">
                  {text.length}/500 characters
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-sm">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Your vouch is public.</strong> It will appear on {targetUserName}&apos;s profile and helps build their professional reputation on VentureDeck.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <PremiumButton
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={isSubmitting}
                  leftIcon={<Award className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Vouch'}
                </PremiumButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VouchModal;
