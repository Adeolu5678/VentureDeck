'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import { Doc, Id } from '@convex/_generated/dataModel';
import { useMemo, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Send, User, Hash, Plus, Lock, X, Link as LinkIcon } from 'lucide-react';
import MemberMenu from '@/components/MemberMenu';
import ChannelMenu from '@/components/ChannelMenu';
import { toast } from 'sonner';

interface Channel {
  _id: Id<'conversations'>;
  type: string;
  name?: string;
  visibility?: 'public' | 'private';
  participantIds: Id<'users'>[];
}

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params.id as Id<'workspaces'>;
  
  const user = useQuery(api.users.getCurrentUser);
  const workspace = useQuery(api.workspaces.get, { id: workspaceId });

  const channels = useQuery(api.conversations.listChannels, { workspaceId }) as Channel[] | undefined;
  
  const [selectedChannelId, setSelectedChannelId] = useState<Id<'conversations'> | null>(null);
  const [view, setView] = useState<'chat' | 'applications'>('chat');
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  const activeChannelId = useMemo(() => {
    if (selectedChannelId) return selectedChannelId;
    if (channels && channels.length > 0) {
      return channels.find(c => c.type === 'workspace_general')?._id || channels[0]._id;
    }
    return null;
  }, [selectedChannelId, channels]);

  const messagesQuery = useQuery(api.conversations.getMessages, activeChannelId ? { conversationId: activeChannelId } : "skip");
  const messages = useMemo(() => messagesQuery || [], [messagesQuery]);
  
  const sendMessage = useMutation(api.conversations.sendMessage);
  const createChannel = useMutation(api.conversations.createChannel);
  const joinChannel = useMutation(api.conversations.joinChannel);
  const generateInviteCode = useMutation(api.workspaces.generateInviteCode);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const applications = useQuery(api.applications.listByProject, workspace ? { projectId: workspace.projectId } : "skip") || [];
  const pendingApplications = applications.filter(app => app.status === 'pending' || app.status === 'interviewing');

  if (!workspace || !user) return null;

  const isOwner = workspace.members.includes(user._id) && workspace.members[0] === user._id; // Simplified owner check
  const activeChannel = channels?.find(c => c._id === activeChannelId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChannelId) return;

    await sendMessage({
      conversationId: activeChannelId,
      content: newMessage,
    });
    setNewMessage('');
  };

  const handleCreateChannel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const isPrivate = formData.get('isPrivate') === 'on';

    if (!name) return;

    try {
      const newChannelId = await createChannel({
        workspaceId,
        name,
        visibility: isPrivate ? 'private' : 'public',
        memberIds: [], // For now, private channels just include creator. Implementing member selection is a larger task.
      });
      setSelectedChannelId(newChannelId);
      setShowCreateChannel(false);
      toast.success('Channel created');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create channel');
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-lg truncate max-w-[150px]">{workspace.name}</h1>
              <Link href={`/projects/${workspace.projectId}`} className="text-xs text-primary hover:text-indigo-300">
                View Project
              </Link>
            </div>
            {isOwner && (
              <button 
                onClick={async () => {
                  try {
                    const code = await generateInviteCode({ workspaceId });
                    const url = `${window.location.origin}/invite/${code}`;
                    await navigator.clipboard.writeText(url);
                    toast.success('Invite link copied to clipboard');
                  } catch {
                    toast.error('Failed to generate invite link');
                  }
                }}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                title="Copy Invite Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-slate-500 uppercase">Chat Rooms</h2>
              <button onClick={() => setShowCreateChannel(true)} className="text-slate-500 hover:text-white transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {channels?.map(channel => {
                const isMember = channel.participantIds.includes(user._id);
                const isGeneral = channel.type === 'workspace_general';
                
                return (
                  <div 
                    key={channel._id}
                    onClick={() => {
                      if (isMember || isGeneral) {
                        setSelectedChannelId(channel._id);
                        setView('chat');
                      } else {
                        // Show join confirmation
                        if (confirm(`Do you want to join #${channel.name}?`)) {
                          joinChannel({ conversationId: channel._id })
                            .then(() => {
                              toast.success('Joined channel');
                              setSelectedChannelId(channel._id);
                              setView('chat');
                            })
                            .catch(() => toast.error('Failed to join channel'));
                        }
                      }
                    }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer group ${activeChannelId === channel._id && view === 'chat' ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-800/50'}`}
                  >
                    {channel.visibility === 'private' ? <Lock className="w-3 h-3 text-slate-400" /> : <Hash className="w-3 h-3 text-slate-400" />}
                    <span className={`truncate flex-1 ${!isMember && !isGeneral ? 'italic opacity-70' : ''}`}>
                      {channel.name || (isGeneral ? 'general' : 'unknown')}
                      {!isMember && !isGeneral && " (Join)"}
                    </span>
                    {channel.type !== 'workspace_general' && isMember && (
                      <div onClick={(e) => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChannelMenu channelId={channel._id} workspaceId={workspaceId} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {isOwner && (
             <div className="mb-6">
              <h2 className="text-xs font-semibold text-slate-500 uppercase mb-2">Management</h2>
              <div 
                onClick={() => setView('applications')}
                className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer ${view === 'applications' ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-800/50'}`}
              >
                <User className="w-4 h-4 text-slate-400" />
                Applications
                {pendingApplications.length > 0 && (
                  <span className="ml-auto bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {pendingApplications.length}
                  </span>
                )}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase mb-2">Members</h2>
            <div className="space-y-1">
              {workspace.members?.map((memberId: Id<'users'>) => (
                <MemberItem 
                  key={memberId} 
                  memberId={memberId} 
                  workspaceId={workspaceId}
                  projectId={workspace.projectId}
                  isCurrentUser={user._id === memberId}
                  isFounder={isOwner}
                  workspaceRoles={workspace.roles}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {view === 'chat' ? (
          <>
            <div className="h-14 border-b border-slate-800 flex items-center px-6 bg-slate-900/50 backdrop-blur-sm">
              {activeChannel?.visibility === 'private' ? <Lock className="w-5 h-5 text-slate-400 mr-2" /> : <Hash className="w-5 h-5 text-slate-400 mr-2" />}
              <span className="font-bold">{activeChannel?.name || 'general'}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg: Doc<'messages'>) => (
                <MessageItem key={msg._id} message={msg} currentUserId={user._id} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${activeChannel?.name || 'general'}`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:border-primary outline-none"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <ApplicationsView applications={pendingApplications} />
        )}
      </div>

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Create Chat Room</h3>
              <button onClick={() => setShowCreateChannel(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Room Name</label>
                <input 
                  name="name"
                  type="text" 
                  placeholder="e.g. marketing, design"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                  autoFocus
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="isPrivate" id="isPrivate" className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-primary" />
                <label htmlFor="isPrivate" className="text-sm text-slate-300 select-none">Private Room (Invite Only)</label>
              </div>
              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowCreateChannel(false)}
                  className="flex-1 py-2.5 glass-button text-slate-300 rounded-xl text-sm font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary/20"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MemberItem({ memberId, workspaceId, projectId, isCurrentUser, isFounder, workspaceRoles }: { 
  memberId: Id<'users'>, 
  workspaceId: Id<'workspaces'>,
  projectId: Id<'projects'>,
  isCurrentUser: boolean,
  isFounder: boolean,
  workspaceRoles?: { userId: Id<'users'>, role: string }[]
}) {
  const user = useQuery(api.users.getUser, { id: memberId });
  if (!user) return null;

  const role = workspaceRoles?.find(r => r.userId === memberId)?.role || 'Member';

  return (
    <div className="flex items-center justify-between px-2 py-1.5 text-slate-300 text-sm hover:bg-slate-800/50 rounded group">
      <Link href={`/users/${user._id}`} className="flex items-center gap-2 flex-1 truncate">
        <div className={`w-2 h-2 rounded-full ${user.role === 'entrepreneur' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
        <div className="flex flex-col min-w-0">
          <span className="truncate font-medium text-slate-200">
            {user.displayName || user.firstName || user.username}
            {isCurrentUser && <span className="text-slate-500 ml-1.5 font-normal text-xs">(You)</span>}
          </span>
          <span className="text-[10px] text-slate-500 truncate">{role}</span>
        </div>
      </Link>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MemberMenu 
            memberId={memberId}
            workspaceId={workspaceId}
            projectId={projectId}
            isCurrentUser={isCurrentUser}
            isFounder={isFounder}
            memberRole={role}
          />
      </div>
    </div>
  );
}

function MessageItem({ message, currentUserId }: { message: Doc<'messages'>, currentUserId: Id<'users'> }) {
  const sender = useQuery(api.users.getUser, { id: message.senderId });
  const isMe = message.senderId === currentUserId;

  if (!sender) return null;

  return (
    <div className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden relative">
        {sender.avatarUrl ? (
          <Image src={sender.avatarUrl} alt="Avatar" fill className="object-cover" />
        ) : (
          <User className="w-4 h-4 text-slate-400" />
        )}
      </div>
      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-medium text-slate-200">{sender.displayName || sender.firstName || sender.username}</span>
          <span className="text-xs text-slate-500">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className={`px-4 py-2 rounded-2xl text-sm ${
          isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'
        }`}>
          {message.content}
        </div>
      </div>
    </div>
  );
}

function ApplicationsView({ applications }: { applications: Doc<'applications'>[] }) {
  const acceptApplication = useMutation(api.applications.accept);
  const rejectApplication = useMutation(api.applications.reject);
  const startInterview = useMutation(api.applications.interview);
  const router = useRouter();

  const handleAccept = async (appId: Id<'applications'>) => {
    if (confirm('Accept this application? The user will be added to the workspace immediately.')) {
      await acceptApplication({ applicationId: appId });
    }
  };

  const handleInterview = async (appId: Id<'applications'>) => {
    try {
      const conversationId = await startInterview({ applicationId: appId });
      router.push(`/conversations/${conversationId}`);
    } catch (error) {
      console.error("Failed to start interview:", error);
      alert("Failed to start interview");
    }
  };

  const handleReject = async (appId: Id<'applications'>) => {
    if (confirm('Reject this application?')) {
      await rejectApplication({ applicationId: appId });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="h-14 border-b border-slate-800 flex items-center px-6 bg-slate-900/50 backdrop-blur-sm">
        <User className="w-5 h-5 text-slate-400 mr-2" />
        <span className="font-bold">Applications</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {applications.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">No applications yet.</div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <ApplicationItem 
                key={app._id} 
                application={app} 
                onAccept={() => handleAccept(app._id)}
                onInterview={() => handleInterview(app._id)}
                onReject={() => handleReject(app._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ApplicationItemProps {
  application: Doc<'applications'>;
  onAccept: () => void;
  onInterview: () => void;
  onReject: () => void;
}

function ApplicationItem({ application, onAccept, onInterview, onReject }: ApplicationItemProps) {
  const applicant = useQuery(api.users.getUser, { id: application.applicantId });
  
  if (!applicant) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <Link href={`/users/${applicant._id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden relative">
             {applicant.avatarUrl ? (
              <Image src={applicant.avatarUrl} alt="" fill className="object-cover" />
            ) : (
              <User className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-white">{applicant.displayName || applicant.firstName || applicant.username}</h3>
            <p className="text-sm text-primary">{application.role}</p>
          </div>
        </Link>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
          application.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
          application.status === 'interviewing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
          application.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </span>
      </div>
      
      <div className="bg-slate-950/50 rounded-lg p-4 mb-4 text-slate-300 text-sm whitespace-pre-wrap">
        {application.message}
      </div>

      {(application.status === 'pending' || application.status === 'interviewing') && (
        <div className="flex gap-3">
          <button 
            onClick={onAccept}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Accept
          </button>
          <button 
            onClick={onInterview}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Interview
          </button>
          <button 
            onClick={onReject}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
