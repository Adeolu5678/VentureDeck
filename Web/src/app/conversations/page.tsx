'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Briefcase, User, ArrowLeft, Sparkles } from 'lucide-react';

export default function ConversationsPage() {
  const { user } = useUser();
  const conversations = useQuery(api.conversations.list);

  if (!user) return null;

  // Group conversations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const interviewGroups: Record<string, any[]> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const investorGroups: Record<string, any[]> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const workspaceGroups: Record<string, any[]> = {};

  conversations?.forEach(c => {
    if (c.type === 'interview') {
      const key = c.projectTitle || 'Other Interviews';
      if (!interviewGroups[key]) interviewGroups[key] = [];
      interviewGroups[key].push(c);
    } else if (c.type === 'direct') {
      // Group by Project for Investors/Founders
      // If no project linked, put in "Direct Messages"
      const key = c.projectTitle || 'Direct Messages';
      if (!investorGroups[key]) investorGroups[key] = [];
      investorGroups[key].push(c);
    } else {
      // Workspace chats
      const key = c.workspaceName || 'Other Workspaces';
      if (!workspaceGroups[key]) workspaceGroups[key] = [];
      workspaceGroups[key].push(c);
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 pb-10 px-4 md:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-4xl">
        <header className="flex items-center gap-3 mb-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <div className="bg-primary/20 p-2.5 rounded-xl">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
            <p className="text-slate-400 text-sm">Your professional network</p>
          </div>
          <div className="ml-auto">
             <Link
                href="/dashboard"
                className="p-2 hover:bg-slate-800 rounded-full transition-colors inline-flex"
            >
                <ArrowLeft className="w-6 h-6 text-slate-400" />
            </Link>
          </div>
        </header>

        <main className="space-y-8">
            {conversations === undefined ? (
                <div className="text-center py-10 text-slate-500">Loading conversations...</div>
            ) : conversations.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/30 border border-slate-800 rounded-2xl">
                    <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white">No conversations yet</h3>
                    <p className="text-slate-500">Start a project or contact a founder to begin.</p>
                </div>
            ) : (
                <>
                    {/* Interviews Section */}
                    {Object.keys(interviewGroups).length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-emerald-400" />
                                Interviews
                            </h2>
                            <div className="space-y-6">
                                {Object.entries(interviewGroups).map(([projectTitle, convs]) => (
                                    <div key={projectTitle} className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
                                        <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 font-medium text-slate-300">
                                            {projectTitle}
                                        </div>
                                        <div className="p-2 space-y-2">
                                            {convs.map(c => (
                                                <ConversationCard key={c._id} conversation={c} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Investors Section */}
                    {Object.keys(investorGroups).length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-400" />
                                Investors & Direct Messages
                            </h2>
                            <div className="space-y-6">
                                {Object.entries(investorGroups).map(([projectTitle, convs]) => (
                                    <div key={projectTitle} className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
                                        <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 font-medium text-slate-300">
                                            {projectTitle}
                                        </div>
                                        <div className="p-2 space-y-2">
                                            {convs.map(c => (
                                                <ConversationCard key={c._id} conversation={c} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Workspaces Section */}
                    {Object.keys(workspaceGroups).length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                Workspaces
                            </h2>
                            <div className="space-y-6">
                                {Object.entries(workspaceGroups).map(([workspaceName, convs]) => (
                                    <div key={workspaceName} className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
                                        <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 font-medium text-slate-300">
                                            {workspaceName}
                                        </div>
                                        <div className="p-2 space-y-2">
                                            {convs.map(c => (
                                                <ConversationCard key={c._id} conversation={c} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </main>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ConversationCard({ conversation }: { conversation: any }) {
    const typeConfig = {
        direct: {
          label: 'Direct Message',
          icon: User,
          color: 'text-blue-400',
          bg: 'bg-blue-900/20',
        },
        workspace_general: {
          label: 'Workspace',
          icon: Briefcase,
          color: 'text-purple-400',
          bg: 'bg-purple-900/20',
        },
        interview: {
          label: 'Interview',
          icon: MessageSquare,
          color: 'text-emerald-400',
          bg: 'bg-emerald-900/20',
        },
      }[conversation.type as 'direct' | 'workspace_general' | 'interview'] || {
          label: 'Chat',
          icon: MessageSquare,
          color: 'text-slate-400',
          bg: 'bg-slate-900/20',
      };
    
      const Icon = typeConfig.icon;

      // Determine Display Name based on context
      let displayName = conversation.name || 'Chat';
      let subText = '';

      if (conversation.type === 'interview') {
          // For interview: "Applicant Name - Role" (if founder) or "Project Name - Role" (if applicant)
          // We have enriched data: projectRole ('Investor' or 'Founder'), applicationRole, otherUserName
          if (conversation.projectRole === 'Founder') {
               displayName = `${conversation.otherUserName || 'Applicant'} - ${conversation.applicationRole || 'Candidate'}`;
          } else {
               displayName = `${conversation.projectTitle || 'Project'} - ${conversation.applicationRole || 'Candidate'}`;
          }
      } else if (conversation.type === 'direct') {
          // For DM: "Other User Name"
          displayName = conversation.otherUserName || 'Direct Message';
          subText = conversation.otherUserRole || '';
      } else if (conversation.type === 'workspace_general') {
          displayName = 'General Chat';
      }

    return (
        <Link href={`/conversations/${conversation._id}`} className="block w-full">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-primary/50 transition-colors flex items-center gap-3">
                <div className={`p-2 rounded-lg ${typeConfig.bg} ${typeConfig.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                        <p className="font-medium text-white truncate">
                            {displayName}
                        </p>
                        <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                            {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                        </span>
                    </div>
                    {subText && (
                        <p className="text-xs text-slate-500 truncate">{subText}</p>
                    )}
                </div>
            </div>
        </Link>
    );
}
