'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Id } from '@convex/_generated/dataModel';
import { DollarSign, User, CheckCircle, Clock, XCircle } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import Link from 'next/link';
import Image from 'next/image';
import { useBottomNav } from '@/context/BottomNavContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Type for enriched soft circle with investor details
interface EnrichedSoftCircle {
  _id: Id<'soft_circles'>;
  projectId: Id<'projects'>;
  investorId: Id<'users'>;
  amount: number;
  status: 'interested' | 'committed' | 'withdrawn';
  createdAt: number;
  updatedAt?: number;
  investor: {
    _id: Id<'users'>;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    role?: string;
  } | null;
}

export default function SoftCirclesPage() {
  const params = useParams();
  const projectId = params.id as Id<'projects'>;
  
  const user = useQuery(api.users.getCurrentUser);
  const project = useQuery(api.projects.get, { id: projectId });
  const commitments = useQuery(api.soft_circles.get, { projectId }) as EnrichedSoftCircle[] | undefined;

  const commit = useMutation(api.soft_circles.commit);
  const updateStatus = useMutation(api.soft_circles.updateStatus);
  const { setActions } = useBottomNav();

  const myCommitment = commitments?.find((c) => c.investorId === user?._id);

  const [amount, setAmount] = useState(myCommitment ? myCommitment.amount.toString() : '');
  const [committed, setCommitted] = useState(false);

  // Update local state if myCommitment loads later
  useEffect(() => {
    if (myCommitment && !committed) {
      // eslint-disable-next-line
      setAmount((prev) => (prev === '' ? myCommitment.amount.toString() : prev));
    }
  }, [myCommitment, committed]);

  const isOwner = user && project ? user._id === project.ownerId : false;
  const isInvestor = user ? user.role === 'investor' : false;

  useEffect(() => {
    if (isInvestor) {
      setActions(
        <PremiumButton
          type="submit"
          form="soft-circle-form"
          variant="primary"
          className="flex-1 rounded-full"
        >
          {myCommitment ? 'Update Commitment' : 'Commit Interest'}
        </PremiumButton>
      );
    }
    return () => setActions(null);
  }, [isInvestor, myCommitment, setActions]);

  if (!project || !user) return null;

  const activeCommitments = commitments?.filter(c => c.status !== 'withdrawn') || [];
  const totalCommitted = activeCommitments.reduce((sum, c) => sum + c.amount, 0);
  const percentFunded = Math.min(100, Math.round((totalCommitted / project.fundingGoal) * 100));

  const handleCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await commit({
        projectId,
        amount: Number(amount),
      });
      setCommitted(true);
      toast.success('Interest recorded!');
    } catch {
      toast.error('Failed to record interest');
    }
  };

  const handleStatusUpdate = async (id: Id<'soft_circles'>, newStatus: 'interested' | 'committed' | 'withdrawn') => {
    try {
      await updateStatus({ id, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'committed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
            <CheckCircle className="w-3 h-3" /> Committed
          </span>
        );
      case 'withdrawn':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
            <XCircle className="w-3 h-3" /> Withdrawn
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
            <Clock className="w-3 h-3" /> Interested
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href={`/projects/${projectId}`} className="text-sm text-muted-foreground hover:text-foreground mb-2 block">
            &larr; Back to Project
          </Link>
          <h1 className="text-2xl font-bold">Soft Circles</h1>
          <p className="text-muted-foreground">Gauge investor interest before the round opens.</p>
        </div>

        {/* Progress Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted border border-border rounded-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Soft Circled</div>
              <div className="text-3xl font-bold text-foreground">${totalCommitted.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Funding Goal</div>
              <div className="text-xl font-semibold text-muted-foreground">${project.fundingGoal.toLocaleString()}</div>
            </div>
          </div>

          <div className="h-4 bg-background rounded-full overflow-hidden mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentFunded}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-emerald-500"
            />
          </div>
          <div className="text-right text-sm text-primary font-medium">{percentFunded}% Committed</div>
        </motion.div>

        {/* Investor Action */}
        {isInvestor && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-muted border border-border rounded-xl p-8 mb-8"
          >
            <h2 className="text-xl font-bold mb-4">
              {myCommitment ? 'Edit Your Commitment' : 'Express Interest'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {myCommitment 
                ? 'You have already expressed interest. You can update your committed amount below.' 
                : 'Indicate your interest in this round. This is non-binding but helps the founder gauge demand.'}
            </p>
            <form id="soft-circle-form" onSubmit={handleCommit} className="flex gap-4">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount (USD)"
                  className="w-full pl-10 bg-background border border-input rounded-lg p-3 text-foreground focus:border-primary outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors"
              >
                {myCommitment ? 'Update' : 'Commit'}
              </button>
            </form>
            
            {/* Withdraw option for investor */}
            {myCommitment && myCommitment.status !== 'withdrawn' && (
              <div className="mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => handleStatusUpdate(myCommitment._id, 'withdrawn')}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Withdraw my interest
                </button>
              </div>
            )}
          </motion.div>
        )}

        {committed && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary/20 border border-primary/50 rounded-xl p-6 mb-8 text-center"
          >
            <h3 className="text-lg font-bold text-primary mb-2">Interest Recorded!</h3>
            <p className="text-primary/80">The founder has been notified of your soft commitment.</p>
          </motion.div>
        )}

        {/* Owner View */}
        {isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-4">Interested Investors</h3>
            {!commitments || commitments.length === 0 ? (
              <div className="text-muted-foreground italic bg-muted/50 border border-border rounded-xl p-8 text-center">
                No commitments yet. Share your project to attract investors!
              </div>
            ) : (
              <div className="space-y-4">
                {commitments.map((c, index) => (
                  <motion.div 
                    key={c._id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-muted/50 border border-border rounded-xl p-4 flex items-center justify-between ${
                      c.status === 'withdrawn' ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Investor Avatar */}
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                        {c.investor?.avatarUrl ? (
                          <Image 
                            src={c.investor.avatarUrl} 
                            alt={c.investor.displayName || c.investor.username} 
                            width={48} 
                            height={48}
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      
                      {/* Investor Info */}
                      <div>
                        <Link 
                          href={`/users/${c.investor?._id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {c.investor?.displayName || c.investor?.username || 'Anonymous Investor'}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(c.status)}
                          <span className="text-xs text-muted-foreground">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-primary text-lg">${c.amount.toLocaleString()}</div>
                      </div>
                      
                      {/* Status Update Dropdown for Owner */}
                      {c.status !== 'withdrawn' && (
                        <select
                          value={c.status}
                          onChange={(e) => handleStatusUpdate(c._id, e.target.value as 'interested' | 'committed' | 'withdrawn')}
                          className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                        >
                          <option value="interested">Interested</option>
                          <option value="committed">Committed</option>
                          <option value="withdrawn">Withdrawn</option>
                        </select>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
