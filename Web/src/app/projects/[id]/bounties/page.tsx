'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Id } from '@convex/_generated/dataModel';
import { DollarSign, Plus, User, Send, Check, X, ExternalLink, Clock, CheckCircle, XCircle, Undo2, Gift } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumModal } from '@/components/ui/PremiumModal';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { PremiumTextarea } from '@/components/ui/PremiumTextarea';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { motion } from 'framer-motion';

export default function BountiesPage() {
  const params = useParams();
  const projectId = params.id as Id<'projects'>;
  
  const user = useQuery(api.users.getCurrentUser);
  const project = useQuery(api.projects.get, { id: projectId });
  const bounties = useQuery(api.bounties.list, { projectId }) || [];
  
  const createBounty = useMutation(api.bounties.create);
  const claimBounty = useMutation(api.bounties.claim);
  const submitBounty = useMutation(api.bounties.submit);
  const approveBounty = useMutation(api.bounties.approveSubmission);
  const rejectBounty = useMutation(api.bounties.rejectSubmission);
  const unclaimBounty = useMutation(api.bounties.unclaim);
  const markAsPaid = useMutation(api.bounties.markAsPaid);

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState('');
  
  // Submission state
  const [submittingId, setSubmittingId] = useState<Id<'bounties'> | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  
  // Review state
  const [reviewingId, setReviewingId] = useState<Id<'bounties'> | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  if (!project || !user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isOwner = user._id === project.ownerId;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBounty({ projectId, title, description, reward });
      setIsCreating(false);
      setTitle('');
      setDescription('');
      setReward('');
      toast.success('Bounty posted!');
    } catch {
      toast.error('Failed to create bounty');
    }
  };

  const handleClaim = async (bountyId: Id<'bounties'>) => {
    try {
      await claimBounty({ id: bountyId });
      toast.success('Bounty claimed! Start working on it.');
    } catch {
      toast.error('Failed to claim bounty');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingId) return;
    try {
      await submitBounty({ id: submittingId, submissionUrl, submissionNote });
      setSubmittingId(null);
      setSubmissionUrl('');
      setSubmissionNote('');
      toast.success('Work submitted for review!');
    } catch {
      toast.error('Failed to submit work');
    }
  };

  const handleApprove = async (bountyId: Id<'bounties'>) => {
    try {
      await approveBounty({ id: bountyId, reviewNote });
      setReviewingId(null);
      setReviewNote('');
      toast.success('Bounty approved!');
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (bountyId: Id<'bounties'>) => {
    if (!reviewNote.trim()) {
      toast.error('Please provide feedback for the contributor');
      return;
    }
    try {
      await rejectBounty({ id: bountyId, reviewNote });
      setReviewingId(null);
      setReviewNote('');
      toast.success('Sent back for revision');
    } catch {
      toast.error('Failed to reject');
    }
  };

  const handleUnclaim = async (bountyId: Id<'bounties'>) => {
    if (confirm('Are you sure you want to give up this bounty?')) {
      try {
        await unclaimBounty({ id: bountyId });
        toast.success('Bounty released');
      } catch {
        toast.error('Failed to unclaim');
      }
    }
  };

  const handleMarkPaid = async (bountyId: Id<'bounties'>) => {
    try {
      await markAsPaid({ id: bountyId });
      toast.success('Marked as paid!');
    } catch {
      toast.error('Failed to mark as paid');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      open: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      assigned: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      submitted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      completed: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      paid: 'bg-green-500/10 text-green-400 border-green-500/20',
    };
    const icons: Record<string, JSX.Element> = {
      open: <Clock className="w-3 h-3" />,
      assigned: <User className="w-3 h-3" />,
      submitted: <Send className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />,
      paid: <DollarSign className="w-3 h-3" />,
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 ${styles[status] || styles.open}`}>
        {icons[status]} {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Micro-Bounties"
          description="Small tasks, big impact. Earn rewards by contributing."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: project.title, href: `/projects/${projectId}` },
            { label: "Bounties" }
          ]}
          actions={
            isOwner ? (
              <PremiumButton onClick={() => setIsCreating(true)} variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                Post Bounty
              </PremiumButton>
            ) : undefined
          }
        />

        <div className="grid gap-4">
          {bounties.map((bounty, index) => (
            <motion.div
              key={bounty._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PremiumCard className="p-0 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{bounty.title}</h3>
                        {getStatusBadge(bounty.status)}
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{bounty.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center text-emerald-400 font-medium">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {bounty.reward}
                        </div>
                        {bounty.assigneeId && <AssigneeInfo assigneeId={bounty.assigneeId} />}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {/* Open bounty - anyone can claim */}
                      {!isOwner && bounty.status === 'open' && (
                        <PremiumButton onClick={() => handleClaim(bounty._id)} variant="primary" size="sm">
                          Claim Bounty
                        </PremiumButton>
                      )}

                      {/* Assigned to current user - can submit or unclaim */}
                      {bounty.assigneeId === user._id && bounty.status === 'assigned' && (
                        <>
                          <PremiumButton onClick={() => setSubmittingId(bounty._id)} variant="primary" size="sm" leftIcon={<Send className="w-4 h-4" />}>
                            Submit Work
                          </PremiumButton>
                          <PremiumButton onClick={() => handleUnclaim(bounty._id)} variant="ghost" size="sm" leftIcon={<Undo2 className="w-4 h-4" />}>
                            Give Up
                          </PremiumButton>
                        </>
                      )}

                      {/* Owner can review submitted bounties */}
                      {isOwner && bounty.status === 'submitted' && (
                        <PremiumButton onClick={() => setReviewingId(bounty._id)} variant="gradient" size="sm">
                          Review Submission
                        </PremiumButton>
                      )}

                      {/* Owner can mark completed as paid */}
                      {isOwner && bounty.status === 'completed' && (
                        <div className="relative group">
                          <PremiumButton onClick={() => handleMarkPaid(bounty._id)} variant="primary" size="sm" leftIcon={<DollarSign className="w-4 h-4" />}>
                            Mark as Paid
                          </PremiumButton>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded border border-amber-500/30">
                              💰 Payment integration coming soon
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submission details (visible when submitted) */}
                  {bounty.status === 'submitted' && bounty.submissionUrl && (
                    <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-400 font-medium mb-2">
                        <Send className="w-4 h-4" />
                        Submission Pending Review
                      </div>
                      <a href={bounty.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm">
                        <ExternalLink className="w-4 h-4" /> View Submission
                      </a>
                      {bounty.submissionNote && (
                        <p className="text-muted-foreground text-sm mt-2">{bounty.submissionNote}</p>
                      )}
                    </div>
                  )}

                  {/* Review feedback (visible to assignee when rejected) */}
                  {bounty.status === 'assigned' && bounty.reviewNote && (
                    <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-2 text-destructive font-medium mb-2">
                        <XCircle className="w-4 h-4" />
                        Revision Requested
                      </div>
                      <p className="text-muted-foreground text-sm">{bounty.reviewNote}</p>
                    </div>
                  )}

                  {/* Completed badge */}
                  {(bounty.status === 'completed' || bounty.status === 'paid') && bounty.reviewNote && (
                    <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-emerald-400 font-medium mb-2">
                        <CheckCircle className="w-4 h-4" />
                        {bounty.status === 'paid' ? 'Paid' : 'Approved'}
                      </div>
                      {bounty.reviewNote && <p className="text-muted-foreground text-sm">{bounty.reviewNote}</p>}
                    </div>
                  )}
                </div>
              </PremiumCard>
            </motion.div>
          ))}

          {bounties.length === 0 && (
            <EmptyState
              icon={Gift}
              title="No bounties yet"
              description={isOwner ? "Create your first bounty to attract contributors" : "Check back later for new opportunities"}
              action={
                isOwner ? (
                  <PremiumButton onClick={() => setIsCreating(true)} leftIcon={<Plus className="w-4 h-4" />}>
                    Post Your First Bounty
                  </PremiumButton>
                ) : undefined
              }
            />
          )}
        </div>

        {/* Create Modal */}
        <PremiumModal isOpen={isCreating} onClose={() => setIsCreating(false)} title="Post a Bounty" description="Create a task for contributors to complete">
          <form onSubmit={handleCreate} className="space-y-4">
            <PremiumInput
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Fix landing page bug"
              required
            />
            <PremiumTextarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what needs to be done..."
              required
            />
            <PremiumInput
              label="Reward"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="e.g. $500 or 0.5% Equity"
              leftIcon={<DollarSign className="w-4 h-4" />}
              required
            />
            <div className="flex gap-2 pt-2">
              <PremiumButton type="button" variant="ghost" onClick={() => setIsCreating(false)} className="flex-1">Cancel</PremiumButton>
              <PremiumButton type="submit" variant="gradient" className="flex-1">Post Bounty</PremiumButton>
            </div>
          </form>
        </PremiumModal>

        {/* Submit Modal */}
        <PremiumModal isOpen={!!submittingId} onClose={() => setSubmittingId(null)} title="Submit Your Work" description="Share your deliverable for review">
          <form onSubmit={handleSubmit} className="space-y-4">
            <PremiumInput
              label="Link to Deliverable"
              type="url"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="https://github.com/..."
              hint="GitHub PR, Figma link, or hosted file"
              leftIcon={<ExternalLink className="w-4 h-4" />}
              required
            />
            <PremiumTextarea
              label="Notes (optional)"
              value={submissionNote}
              onChange={(e) => setSubmissionNote(e.target.value)}
              placeholder="Explain what you've done..."
            />
            <div className="flex gap-2 pt-2">
              <PremiumButton type="button" variant="ghost" onClick={() => setSubmittingId(null)} className="flex-1">Cancel</PremiumButton>
              <PremiumButton type="submit" variant="gradient" className="flex-1" leftIcon={<Send className="w-4 h-4" />}>Submit</PremiumButton>
            </div>
          </form>
        </PremiumModal>

        {/* Review Modal */}
        <PremiumModal isOpen={!!reviewingId} onClose={() => setReviewingId(null)} title="Review Submission" description="Approve or request changes">
          {(() => {
            const bounty = bounties.find(b => b._id === reviewingId);
            if (!bounty) return null;
            return (
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <h4 className="font-semibold mb-2 text-white">{bounty.title}</h4>
                  <a href={bounty.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm">
                    <ExternalLink className="w-4 h-4" /> View Submission
                  </a>
                  {bounty.submissionNote && <p className="text-muted-foreground text-sm mt-2">{bounty.submissionNote}</p>}
                </div>
                <PremiumTextarea
                  label="Feedback"
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Great work! or What needs to be changed..."
                  hint="Required for rejection"
                />
                <div className="flex gap-2 pt-2">
                  <PremiumButton type="button" variant="ghost" onClick={() => handleReject(reviewingId!)} className="flex-1" leftIcon={<X className="w-4 h-4" />}>
                    Request Revision
                  </PremiumButton>
                  <PremiumButton type="button" variant="gradient" onClick={() => handleApprove(reviewingId!)} className="flex-1" leftIcon={<Check className="w-4 h-4" />}>
                    Approve
                  </PremiumButton>
                </div>
              </div>
            );
          })()}
        </PremiumModal>
      </div>
    </div>
  );
}

function AssigneeInfo({ assigneeId }: { assigneeId: Id<'users'> }) {
  const assignee = useQuery(api.users.getUser, { id: assigneeId });
  if (!assignee) return null;
  return (
    <Link href={`/users/${assigneeId}`} className="flex items-center text-muted-foreground hover:text-primary">
      <User className="w-4 h-4 mr-1" />
      {assignee.displayName || assignee.username}
    </Link>
  );
}

// Modal component removed - now using PremiumModal from components/ui

