'use client';

import { motion } from 'framer-motion';
import { Linkedin, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ShareToLinkedInProps {
  title: string;
  description: string;
  // projectTitle: string;
  projectUrl?: string;
  type?: 'milestone' | 'funding' | 'launch';
}

export function ShareToLinkedIn({
  title,
  description,
  // projectTitle,
  projectUrl,
  type = 'milestone',
}: ShareToLinkedInProps) {
  const [shared, setShared] = useState(false);

  const getEmoji = () => {
    switch (type) {
      case 'milestone': return '🎯';
      case 'funding': return '💰';
      case 'launch': return '🚀';
      default: return '✨';
    }
  };

  const handleShare = () => {
    const url = projectUrl || window.location.href;
    const text = `${getEmoji()} ${title}\n\n${description}\n\n#startup #entrepreneurship #VentureDeck`;
    
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`;
    
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
    setShared(true);
    toast.success('Sharing to LinkedIn...');
    
    // Reset after 3 seconds
    setTimeout(() => setShared(false), 3000);
  };

  return (
    <motion.button
      onClick={handleShare}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
        transition-all duration-200
        ${shared 
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
          : 'bg-[#0077B5]/20 text-[#0077B5] hover:bg-[#0077B5]/30 border border-[#0077B5]/30'
        }
      `}
    >
      {shared ? (
        <>
          <CheckCircle className="w-4 h-4" />
          Shared!
        </>
      ) : (
        <>
          <Linkedin className="w-4 h-4" />
          Share on LinkedIn
        </>
      )}
    </motion.button>
  );
}

// Compact version for inline use
export function ShareToLinkedInIcon({
  projectUrl,
}: {
  title: string;
  description: string;
  projectUrl?: string;
}) {
  const handleShare = () => {
    const url = projectUrl || window.location.href;
    // const text = `${title}\n\n${description}\n\n#startup #VentureDeck`;
    
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
    toast.success('Opening LinkedIn...');
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-lg hover:bg-[#0077B5]/20 text-neutral-400 hover:text-[#0077B5] transition-colors"
      title="Share on LinkedIn"
    >
      <Linkedin className="w-4 h-4" />
    </button>
  );
}
