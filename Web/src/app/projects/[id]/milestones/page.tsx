'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Id } from '@convex/_generated/dataModel';
import { CheckCircle, Circle, Plus, Trash2, Award, TrendingUp, Shield, Target, Calendar } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PremiumModal } from '@/components/ui/PremiumModal';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { PremiumTextarea } from '@/components/ui/PremiumTextarea';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';

interface Milestone {
  _id: Id<'milestones'>;
  projectId: Id<'projects'>;
  title: string;
  description: string;
  date: number;
  status: 'pending' | 'completed' | 'verified';
  verifiedBy?: Id<'users'>;
  createdAt: number;
}

export default function MilestonesPage() {
  const params = useParams();
  const projectId = params.id as Id<'projects'>;
  
  const user = useQuery(api.users.getCurrentUser);
  const project = useQuery(api.projects.get, { id: projectId });
  const milestones = useQuery(api.milestones.list, { projectId }) as Milestone[] | undefined;
  const tractionScore = useQuery(api.milestones.getTractionScore, { projectId });

  const createMilestone = useMutation(api.milestones.create);
  const updateStatus = useMutation(api.milestones.updateStatus);
  const removeMilestone = useMutation(api.milestones.remove);

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const isOwner = user && project ? user._id === project.ownerId : false;
  const isAdmin = user?.isAdmin === true;

  // Note: Action button is now in PageHeader, no need for BottomNav

  if (!project || !user) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMilestone({
        projectId,
        title,
        description,
        date: new Date(date).getTime(),
      });
      setIsCreating(false);
      setTitle('');
      setDescription('');
      setDate('');
      toast.success('Milestone created!');
    } catch {
      toast.error('Failed to create milestone');
    }
  };

  const handleMarkComplete = async (id: Id<'milestones'>) => {
    try {
      await updateStatus({ id, status: 'completed' });
      toast.success('Milestone marked as completed!');
    } catch {
      toast.error('Failed to update milestone');
    }
  };

  const handleVerify = async (id: Id<'milestones'>) => {
    try {
      await updateStatus({ id, status: 'verified' });
      toast.success('Milestone verified!');
    } catch {
      toast.error('Failed to verify milestone');
    }
  };

  const handleDelete = async (id: Id<'milestones'>) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;
    try {
      await removeMilestone({ id });
      toast.success('Milestone deleted');
    } catch {
      toast.error('Failed to delete milestone');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'border-emerald-500 bg-emerald-500/10';
      case 'completed':
        return 'border-primary bg-primary/10';
      default:
        return 'border-border bg-muted';
    }
  };

  const completedCount = milestones?.filter(m => m.status === 'completed' || m.status === 'verified').length || 0;
  const totalCount = milestones?.length || 0;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="Milestones"
          description={`Track the progress of ${project.title}`}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: project.title, href: `/projects/${projectId}` },
            { label: "Milestones" }
          ]}
          actions={
            isOwner ? (
              <PremiumButton onClick={() => setIsCreating(true)} variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                Add Milestone
              </PremiumButton>
            ) : undefined
          }
        />

        {/* Traction Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Traction Score</div>
                <div className="text-3xl font-bold">{tractionScore || 0}<span className="text-lg text-muted-foreground">/100</span></div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Progress</span>
              </div>
              <div className="text-lg font-semibold">{completedCount} / {totalCount} completed</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-background/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tractionScore || 0}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-emerald-500"
            />
          </div>
        </motion.div>

        {/* Timeline */}
        {!milestones || milestones.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No milestones yet"
            description={isOwner ? "Start tracking your project's progress by adding milestones" : "This project hasn't added any milestones yet"}
            action={
              isOwner ? (
                <PremiumButton onClick={() => setIsCreating(true)} leftIcon={<Plus className="w-4 h-4" />}>
                  Add Your First Milestone
                </PremiumButton>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={milestone._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative border rounded-xl p-5 ${getStatusColor(milestone.status)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      milestone.status === 'verified' ? 'bg-emerald-500/20' :
                      milestone.status === 'completed' ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      {getStatusIcon(milestone.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{milestone.title}</h3>
                        {milestone.status === 'verified' && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Verified
                          </span>
                        )}
                        {milestone.status === 'completed' && (
                          <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                      <time className="text-xs text-primary font-medium">
                        Target: {new Date(milestone.date).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Mark Complete Button (Owner only, pending milestones) */}
                    {isOwner && milestone.status === 'pending' && (
                      <PremiumButton
                        onClick={() => handleMarkComplete(milestone._id)}
                        variant="glass"
                        size="sm"
                        leftIcon={<CheckCircle className="w-4 h-4" />}
                      >
                        Complete
                      </PremiumButton>
                    )}
                    
                    {isAdmin && milestone.status === 'completed' && (
                      <PremiumButton
                        onClick={() => handleVerify(milestone._id)}
                        variant="secondary"
                        size="sm"
                        leftIcon={<Shield className="w-4 h-4" />}
                        className="text-emerald-400 border-emerald-500/20"
                      >
                        Verify
                      </PremiumButton>
                    )}
                    
                    {/* Delete Button (Owner only) */}
                    {isOwner && (
                      <PremiumButton
                        onClick={() => handleDelete(milestone._id)}
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </PremiumButton>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        <PremiumModal isOpen={isCreating} onClose={() => setIsCreating(false)} title="Add Milestone" description="Track a key goal for your project">
          <form onSubmit={handleCreate} className="space-y-4">
            <PremiumInput
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., MVP Launch, First 100 Users"
              leftIcon={<Target className="w-4 h-4" />}
              required
            />
            <PremiumTextarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this milestone represent?"
              required
            />
            <PremiumInput
              label="Target Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4" />}
              required
            />
            <div className="flex gap-2 pt-2">
              <PremiumButton type="button" variant="ghost" onClick={() => setIsCreating(false)} className="flex-1">
                Cancel
              </PremiumButton>
              <PremiumButton type="submit" variant="gradient" className="flex-1">
                Create Milestone
              </PremiumButton>
            </div>
          </form>
        </PremiumModal>
      </div>
    </div>
  );
}
