'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Briefcase, User, DollarSign, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Id, Doc } from '@convex/_generated/dataModel';
import { PageHeader } from '@/components/ui/PageHeader';

type EnrichedConversation = Doc<'conversations'> & {
  projectTitle?: string;
  projectRole?: string;
  applicationRole?: string;
  otherUserName?: string;
  otherUserRole?: string;
  otherUserUsername?: string;
  workspaceName?: string;
  applicantId?: Id<'users'>;
};

type Tab = 'private' | 'interviews' | 'funding';
type InterviewSubTab = 'received' | 'sent';

export default function ConversationsPage() {
  const { user } = useUser();
  const conversationsData = useQuery(api.conversations.list, {});

  if (!user || conversationsData === undefined) {
    return (
      <div className="min-h-screen text-white pt-20 flex justify-center">
        <div className="text-slate-500">Loading conversations...</div>
      </div>
    );
  }
  
  const conversations = conversationsData.conversations || [];
  
  return <ConversationsContent conversations={conversations} />;
}

function ConversationsContent({ conversations }: { conversations: EnrichedConversation[] }) {
  const convexUser = useQuery(api.users.getCurrentUser);
  const [activeTab, setActiveTab] = useState<Tab>('private');
  const [interviewSubTab, setInterviewSubTab] = useState<InterviewSubTab>('received');
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  if (!convexUser) return null;

  const privateConversations = conversations.filter(
    c => c.type === 'direct' && !c.projectId && !c.workspaceId
  );

  const fundingConversations = conversations.filter(
    c => c.type === 'direct' && c.projectId
  );

  const allInterviews = conversations.filter(c => c.type === 'interview');
  
  // Received: I am the applicant.
  // Sent: I am the project owner (granting the interview).
  // We need to know who is the applicant. 
  // Assuming the conversation object has `applicantId`.
  const receivedInterviews = allInterviews.filter(c => c.applicantId === convexUser._id);
  const sentInterviews = allInterviews.filter(c => c.applicantId !== convexUser._id);

  // Group Sent Interviews by Project
  const sentInterviewsByProject: Record<string, EnrichedConversation[]> = {};
  sentInterviews.forEach(c => {
    const key = c.projectTitle || 'Unknown Project';
    if (!sentInterviewsByProject[key]) sentInterviewsByProject[key] = [];
    sentInterviewsByProject[key].push(c);
  });

  const toggleProject = (projectTitle: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectTitle]: !prev[projectTitle]
    }));
  };

  return (
    <div className="min-h-screen text-white pt-20 pb-24 px-4 md:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-4xl">
        <PageHeader 
          title="Conversations" 
          description="Your professional network"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Conversations" }
          ]}
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('private')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
              activeTab === 'private' 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            Private Messages
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
              activeTab === 'interviews' 
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            Interviews
          </button>
          <button
            onClick={() => setActiveTab('funding')}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
              activeTab === 'funding' 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            Funding
          </button>
        </div>

        <main className="space-y-4">
          {/* Private Messages */}
          {activeTab === 'private' && (
            <div className="space-y-3">
              {privateConversations.length === 0 ? (
                <EmptyState message="No private messages yet." />
              ) : (
                privateConversations.map(c => (
                  <ConversationCard 
                    key={c._id} 
                    conversation={c} 
                    title={c.otherUserName || 'Unknown User'}
                    subtitle={`@${c.otherUserUsername || 'username'}`}
                    icon={User}
                    colorClass="text-blue-400 bg-blue-900/20"
                  />
                ))
              )}
            </div>
          )}

          {/* Interviews */}
          {activeTab === 'interviews' && (
            <div>
              <div className="flex gap-4 mb-4 border-b border-slate-800 pb-2">
                <button 
                  onClick={() => setInterviewSubTab('received')}
                  className={cn("text-sm font-medium pb-2 relative", interviewSubTab === 'received' ? "text-emerald-400" : "text-slate-400 hover:text-white")}
                >
                  Received
                  {interviewSubTab === 'received' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full -mb-2.5" />}
                </button>
                <button 
                  onClick={() => setInterviewSubTab('sent')}
                  className={cn("text-sm font-medium pb-2 relative", interviewSubTab === 'sent' ? "text-emerald-400" : "text-slate-400 hover:text-white")}
                >
                  Sent
                  {interviewSubTab === 'sent' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full -mb-2.5" />}
                </button>
              </div>

              {interviewSubTab === 'received' ? (
                <div className="space-y-3">
                  {receivedInterviews.length === 0 ? (
                    <EmptyState message="No interview applications sent." />
                  ) : (
                    receivedInterviews.map(c => (
                      <ConversationCard 
                        key={c._id} 
                        conversation={c} 
                        title={`${c.projectTitle || 'Project'} - ${c.applicationRole || 'Role'}`}
                        subtitle={c.otherUserName || 'Interviewer'}
                        icon={Briefcase}
                        colorClass="text-emerald-400 bg-emerald-900/20"
                      />
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.keys(sentInterviewsByProject).length === 0 ? (
                    <EmptyState message="No interviews scheduled for your projects." />
                  ) : (
                    Object.entries(sentInterviewsByProject).map(([projectTitle, convs]) => (
                      <div key={projectTitle} className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden">
                        <button 
                          onClick={() => toggleProject(projectTitle)}
                          className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-800/50 transition-colors"
                        >
                          <span className="font-medium text-white">{projectTitle}</span>
                          {expandedProjects[projectTitle] ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                        </button>
                        
                        {expandedProjects[projectTitle] && (
                          <div className="p-2 space-y-2 border-t border-slate-800">
                            {convs.map(c => (
                              <ConversationCard 
                                key={c._id} 
                                conversation={c} 
                                title={`${c.otherUserName || 'Applicant'} - ${c.applicationRole || 'Candidate'}`}
                                subtitle="Interview"
                                icon={MessageSquare}
                                colorClass="text-emerald-400 bg-emerald-900/20"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Funding */}
          {activeTab === 'funding' && (
            <div className="space-y-3">
              {fundingConversations.length === 0 ? (
                <EmptyState message="No funding discussions yet." />
              ) : (
                fundingConversations.map(c => (
                  <ConversationCard 
                    key={c._id} 
                    conversation={c} 
                    title={c.projectTitle || 'Project Funding'}
                    subtitle={`With ${c.otherUserName || 'User'}`}
                    icon={DollarSign}
                    colorClass="text-blue-400 bg-blue-900/20"
                  />
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-10 bg-slate-900/30 border border-slate-800 rounded-2xl">
      <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
      <p className="text-slate-500">{message}</p>
    </div>
  );
}

function ConversationCard({ 
  conversation, 
  title, 
  subtitle, 
  icon: Icon, 
  colorClass 
}: { 
  conversation: EnrichedConversation, 
  title: string, 
  subtitle: string, 
  icon: React.ElementType, 
  colorClass: string 
}) {
  return (
    <Link href={`/conversations/${conversation._id}`} className="block w-full">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 hover:border-primary/50 transition-colors flex items-center gap-3">
        <div className={`p-2 rounded-lg shrink-0 ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <p className="font-medium text-white truncate">
              {title}
            </p>
            <span className="text-[10px] text-slate-500 shrink-0 ml-2">
              {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}
