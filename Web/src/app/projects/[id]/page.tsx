'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, DollarSign, PieChart, FileText, MessageSquare, Send, CheckCircle, ExternalLink, Globe, Shield } from 'lucide-react';
import { useState } from 'react';
import { Id } from '@convex/_generated/dataModel';
import Image from 'next/image';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as Id<'projects'>;
  
  const user = useQuery(api.users.getCurrentUser);
  const project = useQuery(api.projects.get, { id: projectId });
  
  const createApplication = useMutation(api.applications.create);
  const createDirectMessage = useMutation(api.conversations.createDirectMessage);

  const [isApplying, setIsApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [applicationRole, setApplicationRole] = useState('');
  const [applicationSent, setApplicationSent] = useState(false);

  if (project === undefined || user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (project === null) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Project not found.</div>;
  }

  const isOwner = user && user._id === project.ownerId;
  const isInvestor = user?.role === 'investor';
  const isEntrepreneur = user?.role === 'entrepreneur';

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationRole || !applicationMessage) return;
    
    try {
      await createApplication({
        projectId,
        role: applicationRole,
        message: applicationMessage,
      });
      setApplicationSent(true);
      setIsApplying(false);
    } catch (error) {
      console.error('Failed to apply:', error);
      alert('Failed to apply. You may have already applied.');
    }
  };

  const handleContactFounder = async () => {
    try {
      const conversationId = await createDirectMessage({
        participantId: project.ownerId,
      });
      // Redirect to conversation
      // router.push(`/conversations/${conversationId}`);
      alert(`Conversation created! ID: ${conversationId}`);
    } catch (error) {
      console.error('Failed to contact founder:', error);
      alert('Failed to contact founder.');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header Image / Pattern */}
      <div className="h-80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        
        <div className="absolute top-6 left-6 z-20">
          <Link href="/dashboard" className="flex items-center text-slate-300 hover:text-white transition-colors glass-button px-4 py-2 rounded-full text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-40 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="glass-panel rounded-3xl p-8 md:p-10 mb-8">
              <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
                <div className="flex items-center gap-6">
                  {project.logoUrl ? (
                    <Image src={project.logoUrl} alt={project.title} width={112} height={112} className="w-28 h-28 rounded-2xl object-cover border-4 border-slate-800/50 shadow-2xl" />
                  ) : (
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-4xl font-bold text-white border-4 border-slate-800/50 shadow-2xl">
                      {project.title.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">{project.title}</h1>
                    <p className="text-xl text-indigo-400 font-medium">{project.tagline}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                   <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-medium border border-indigo-500/20">
                    {project.industry}
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                    project.status === 'published' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="prose prose-invert prose-lg max-w-none">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  About the Project
                </h3>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{project.description}</p>
              </div>

              {project.pitchDeckUrl && (
                <div className="mt-10 pt-8 border-t border-white/5">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Resources
                  </h3>
                  <a 
                    href={project.pitchDeckUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group inline-flex items-center px-6 py-4 bg-slate-800/50 hover:bg-slate-800 border border-white/10 hover:border-indigo-500/50 rounded-xl text-white transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Pitch Deck</div>
                      <div className="text-xs text-slate-400">View PDF Document</div>
                    </div>
                    <ExternalLink className="w-4 h-4 ml-4 text-slate-500 group-hover:text-white transition-colors" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 space-y-6">
            {/* Investment Terms */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-400" />
                Investment Terms
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  <div className="flex items-center text-slate-400 text-sm">
                    <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                    <span>Funding Goal</span>
                  </div>
                  <span className="font-bold text-white text-lg">${project.fundingGoal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  <div className="flex items-center text-slate-400 text-sm">
                    <PieChart className="w-4 h-4 mr-2 text-indigo-500" />
                    <span>Equity Offered</span>
                  </div>
                  <span className="font-bold text-white text-lg">{project.equityOffered}%</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="glass-panel rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-400" />
                Actions
              </h3>
              
              {isOwner ? (
                <div className="space-y-3">
                  <Link 
                    href={`/workspaces/${project.workspaceId}`}
                    className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-center rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                  >
                    Go to Workspace
                  </Link>
                  <Link 
                    href={`/projects/${projectId}/milestones`}
                    className="block w-full py-3 px-4 glass-button text-slate-300 text-center rounded-xl font-medium"
                  >
                    Manage Milestones
                  </Link>
                  <Link 
                    href={`/projects/${projectId}/bounties`}
                    className="block w-full py-3 px-4 glass-button text-slate-300 text-center rounded-xl font-medium"
                  >
                    Manage Bounties
                  </Link>
                  <button className="block w-full py-3 px-4 glass-button text-slate-300 text-center rounded-xl font-medium">
                    Edit Project
                  </button>
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
                    className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center"
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    Soft Circle
                  </Link>
                </div>
              ) : isEntrepreneur ? (
                !applicationSent ? (
                  !isApplying ? (
                    <button 
                      onClick={() => setIsApplying(true)}
                      className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Apply to Join
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
                          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/20"
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
