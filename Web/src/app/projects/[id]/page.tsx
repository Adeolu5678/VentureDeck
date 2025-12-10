'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, DollarSign, PieChart, MessageSquare, Send, CheckCircle, Globe, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { Id, Doc } from '@convex/_generated/dataModel';
import Image from 'next/image';
import MemberMenu from '@/components/MemberMenu';
import { toast } from 'sonner';
import { useBottomNav } from '@/context/BottomNavContext';
import { useEffect, useCallback } from 'react';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as Id<'projects'>;
  const router = useRouter();

  const user = useQuery(api.users.getCurrentUser);
  const project = useQuery(api.projects.get, { id: projectId });
  const myApplication = useQuery(api.applications.getMyApplicationStatus, { projectId });
  
  const apply = useMutation(api.applications.create);
  const createDirectMessage = useMutation(api.conversations.createDirectMessage);

  const [isApplying, setIsApplying] = useState(false);
  const [applicationRole, setApplicationRole] = useState('');
  const [applicationMessage, setApplicationMessage] = useState('');
  const { setActions } = useBottomNav();

  const isOwner = !!(user && project && project.ownerId === user._id);
  const isMember = myApplication?.status === 'accepted' || isOwner;
  const isInvestor = user?.role === 'investor';
  const isEntrepreneur = user?.role === 'entrepreneur';
  const applicationSent = !!myApplication;

  const handleApply = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await apply({
        projectId,
        role: applicationRole,
        message: applicationMessage,
      });
      setIsApplying(false);
      toast.success('Application sent successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send application');
    }
  }, [user, apply, projectId, applicationRole, applicationMessage]);

  const handleContactFounder = useCallback(async () => {
    if (!user || !project) return;
    try {
      const conversationId = await createDirectMessage({
        participantId: project.ownerId,
        projectId: project._id,
      });
      router.push(`/conversations/${conversationId}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to start conversation');
    }
  }, [user, project, createDirectMessage, router]);



  useEffect(() => {
    let action = null;

    if (isOwner) {
      action = (
        <Link 
          href={`/projects/${projectId}/edit`}
          className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white text-center rounded-full font-medium transition-all text-sm"
        >
          Edit Project
        </Link>
      );
    } else if (isInvestor) {
      action = (
        <button 
          onClick={handleContactFounder}
          className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center text-sm"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Contact Founder
        </button>
      );
    } else if (isEntrepreneur) {
      if (!applicationSent || myApplication?.status === 'rejected') {
         action = (
            <button 
              onClick={() => setIsApplying(true)}
              className="flex-1 py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-full font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center text-sm"
            >
              <Send className="w-4 h-4 mr-2" />
              {myApplication?.status === 'rejected' ? 'Re-apply' : 'Apply'}
            </button>
         );
      } else {
        action = (
          <div className="flex-1 py-2 px-4 bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 rounded-full font-medium flex items-center justify-center text-sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            Sent
          </div>
        );
      }
    }

    setActions(action);
    return () => setActions(null);
  }, [isOwner, isInvestor, isEntrepreneur, applicationSent, myApplication, projectId, handleContactFounder, setActions]);

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      {/* Header Image */}
      <div className="h-64 w-full relative bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-end gap-6 mb-8">
              <div className="w-32 h-32 rounded-2xl bg-slate-800 border-4 border-slate-950 shadow-2xl flex items-center justify-center overflow-hidden relative">
                {project.logoUrl ? (
                  <Image src={project.logoUrl} alt={project.title} fill className="object-cover" />
                ) : (
                  <PieChart className="w-12 h-12 text-slate-600" />
                )}
              </div>
              <div className="mb-4">
                <h1 className="text-4xl font-bold text-white mb-2">{project.title}</h1>
                <p className="text-xl text-slate-400">{project.tagline}</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* About */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-4">About</h2>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{project.description}</p>
                
                <div className="mt-8 flex flex-wrap gap-2">
                  {project.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-slate-400 text-sm font-medium">Funding Goal</span>
                  </div>
                  <div className="text-2xl font-bold text-white">${project.fundingGoal.toLocaleString()}</div>
                </div>
                <div className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <PieChart className="w-5 h-5" />
                    </div>
                    <span className="text-slate-400 text-sm font-medium">Equity Offered</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{project.equityOffered}%</div>
                </div>
                <div className="glass-panel rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="text-slate-400 text-sm font-medium">Industry</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{project.industry}</div>
                </div>
              </div>

              {/* Features (Milestones & Bounties) */}
              <FeaturesSection projectId={projectId} />

              {/* Team */}
              <TeamSection projectId={projectId} isOwner={!!isOwner} />

              {/* Soft Circles (Owner Only) */}
              {isOwner && <SoftCirclesSection projectId={projectId} />}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Actions */}
            <div className="glass-panel rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Actions
              </h3>
              
              {isOwner ? (
                <div className="space-y-3">
                  {project.workspaceId && (
                    <Link 
                      href={`/workspaces/${project.workspaceId}`}
                      className="block w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white text-center rounded-xl font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    >
                      Go to Workspace
                    </Link>
                  )}
                  <Link 
                    href={`/projects/${projectId}/edit`}
                    className="block w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white text-center rounded-xl font-medium transition-all"
                  >
                    Edit Project
                  </Link>
                </div>
              ) : isMember ? (
                 <div className="space-y-3">
                  {project.workspaceId && (
                    <Link 
                      href={`/workspaces/${project.workspaceId}`}
                      className="block w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white text-center rounded-xl font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    >
                      Go to Workspace
                    </Link>
                  )}
                </div>
              ) : isInvestor ? (
                <div className="space-y-3">
                  <button 
                    onClick={handleContactFounder}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Contact Founder
                  </button>
                  <Link 
                    href={`/projects/${projectId}/soft-circles`}
                    className="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center"
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    Soft Circle
                  </Link>
                </div>
              ) : isEntrepreneur ? (
                !applicationSent || myApplication?.status === 'rejected' ? (
                  !isApplying ? (
                    <button 
                      onClick={() => setIsApplying(true)}
                      className="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {myApplication?.status === 'rejected' ? 'Re-apply to Join' : 'Apply to Join'}
                    </button>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Role</label>
                        <input 
                          type="text" 
                          value={applicationRole}
                          onChange={(e) => setApplicationRole(e.target.value)}
                          placeholder="e.g. CTO, Developer"
                          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Message</label>
                        <textarea 
                          value={applicationMessage}
                          onChange={(e) => setApplicationMessage(e.target.value)}
                          placeholder="Why are you a good fit?"
                          className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 h-24 resize-none transition-colors"
                          required
                        />
                      </div>
                      <div className="flex gap-3">
                        <button 
                          type="button"
                          onClick={() => setIsApplying(false)}
                          className="flex-1 py-2.5 glass-button text-slate-300 rounded-xl text-sm font-medium"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary/20"
                        >
                          Send
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  <div className="w-full py-4 px-4 bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 rounded-xl font-medium flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Application Sent
                  </div>
                )
              ) : (
                <div className="text-center text-slate-500 text-sm p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  Log in to interact with this project.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamSection({ projectId, isOwner }: { projectId: Id<'projects'>, isOwner: boolean }) {
  const workspace = useQuery(api.workspaces.getPublicInfoByProject, { projectId });
  const updateRole = useMutation(api.workspaces.updateRole);
  const project = useQuery(api.projects.get, { id: projectId });
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [newRole, setNewRole] = useState('');

  if (!workspace || !project) return null;

  const handleUpdateRole = async (userId: Id<'users'>) => {
    if (!newRole.trim()) return;
    await updateRole({
      workspaceId: workspace._id,
      userId,
      role: newRole
    });
    setEditingMember(null);
    setNewRole('');
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        Team
      </h3>
      <div className="space-y-4">
        {workspace.members.map((memberId: Id<'users'>) => (
          <TeamMemberItem 
            key={memberId} 
            memberId={memberId} 
            workspaceId={workspace._id}
            projectId={projectId}
            roles={workspace.roles || []}
            isOwner={isOwner}
            projectOwnerId={project.ownerId}
            isEditing={editingMember === memberId}
            onEdit={() => {
              setEditingMember(memberId);
              const currentRole = workspace.roles?.find((r: { userId: Id<'users'>, role: string }) => r.userId === memberId)?.role || 'Member';
              setNewRole(currentRole);
            }}
            onCancel={() => setEditingMember(null)}
            onSave={() => handleUpdateRole(memberId)}
            newRole={newRole}
            setNewRole={setNewRole}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturesSection({ projectId }: { projectId: Id<'projects'> }) {
  const milestones = useQuery(api.milestones.list, { projectId });
  const bounties = useQuery(api.bounties.list, { projectId });
  const [activeTab, setActiveTab] = useState<'milestones' | 'bounties'>('milestones');

  if (!milestones && !bounties) return null;

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          Project Roadmap & Bounties
        </h3>
        <div className="flex bg-slate-900 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'milestones' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Milestones
          </button>
          <button
            onClick={() => setActiveTab('bounties')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'bounties' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bounties
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'milestones' ? (
          milestones?.length === 0 ? (
            <div className="text-center text-slate-500 py-4">No milestones yet.</div>
          ) : (
            milestones?.map((m) => (
              <div key={m._id} className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{m.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    m.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    m.status === 'verified' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    'bg-slate-700 text-slate-300 border-slate-600'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{m.description}</p>
                <div className="text-xs text-slate-500">Target: {new Date(m.date).toLocaleDateString()}</div>
              </div>
            ))
          )
        ) : (
          bounties?.length === 0 ? (
            <div className="text-center text-slate-500 py-4">No open bounties.</div>
          ) : (
            bounties?.map((b) => (
              <div key={b._id} className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{b.title}</h4>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {b.reward}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{b.description}</p>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{b.status}</span>
                  {b.status === 'open' && (
                    <button className="text-primary hover:text-indigo-300 font-medium">Claim</button>
                  )}
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}

function SoftCirclesSection({ projectId }: { projectId: Id<'projects'> }) {
  const softCircles = useQuery(api.soft_circles.get, { projectId });
  
  if (!softCircles || softCircles.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-emerald-400" />
        Soft Circle Commitments
      </h3>
      <div className="space-y-4">
        {softCircles.map((sc) => (
          <SoftCircleItem key={sc._id} softCircle={sc} />
        ))}
      </div>
    </div>
  );
}

function SoftCircleItem({ softCircle }: { softCircle: Doc<'soft_circles'> }) {
  const investor = useQuery(api.users.getUser, { id: softCircle.investorId });

  if (!investor) return null;

  return (
    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/5">
      <Link href={`/users/${investor._id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden relative">
          {investor.avatarUrl ? (
            <Image src={investor.avatarUrl} alt={investor.username || "User"} fill className="object-cover" />
          ) : (
            <User className="w-4 h-4 text-slate-400" />
          )}
        </div>
        <div>
          <div className="font-medium text-white text-sm">{investor.displayName || investor.firstName || investor.username}</div>
          <div className="text-xs text-emerald-400">Committed ${softCircle.amount.toLocaleString()}</div>
        </div>
      </Link>
      <div className="text-xs text-slate-500">
        {new Date(softCircle.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}

interface TeamMemberItemProps {
  memberId: Id<'users'>;
  workspaceId: Id<'workspaces'>;
  projectId: Id<'projects'>;
  roles: { userId: Id<'users'>, role: string }[];
  isOwner: boolean;
  projectOwnerId: Id<'users'>;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  newRole: string;
  setNewRole: (role: string) => void;
}

function TeamMemberItem({ memberId, workspaceId, projectId, roles, isOwner, projectOwnerId, isEditing, onCancel, onSave, newRole, setNewRole }: TeamMemberItemProps) {
  const user = useQuery(api.users.getUser, { id: memberId });
  const currentUser = useQuery(api.users.getCurrentUser);
  
  if (!user) return null;

  const isFounder = memberId === projectOwnerId;
  const role = isFounder ? 'Founder' : (roles.find((r) => r.userId === memberId)?.role || 'Member');

  return (
    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/5">
      <Link href={`/users/${user._id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden relative">
          {user.avatarUrl ? (
            <Image src={user.avatarUrl} alt={user.username || "User"} fill className="object-cover" />
          ) : (
            <User className="w-4 h-4 text-slate-400" />
          )}
        </div>
        <div>
          <div className="font-medium text-white text-sm">{user.displayName || user.firstName || user.username}</div>
          <div className="text-xs text-primary">{role}</div>
          {user.displayName && <div className="text-[10px] text-slate-500">@{user.username}</div>}
        </div>
      </Link>
      
      <div className="flex items-center gap-2">
        {isOwner && isEditing ? (
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                autoFocus
              />
              <button onClick={onSave} className="text-emerald-400 hover:text-emerald-300">
                <CheckCircle className="w-4 h-4" />
              </button>
              <button onClick={onCancel} className="text-slate-400 hover:text-slate-300">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <MemberMenu 
              memberId={memberId}
              workspaceId={workspaceId}
              projectId={projectId}
              isCurrentUser={currentUser?._id === memberId}
              isFounder={isOwner}
              memberRole={role}
              onKick={() => {}} // Refresh handled by Convex reactivity
            />
          )}
      </div>
    </div>
  );
}
