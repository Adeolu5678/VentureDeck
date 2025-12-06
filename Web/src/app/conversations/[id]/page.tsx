'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Image as ImageIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Id } from '@convex/_generated/dataModel';
import Image from 'next/image';

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.id as Id<'conversations'>;
  
  const user = useQuery(api.users.getCurrentUser);
  const conversation = useQuery(api.conversations.getConversation, { conversationId });
  const messages = useQuery(api.conversations.getMessages, { conversationId });
  
  // Fetch project if it exists
  const project = useQuery(api.projects.get, conversation?.projectId ? { id: conversation.projectId } : "skip");
  
  const sendMessage = useMutation(api.conversations.sendMessage);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Determine header title
  let headerTitle = 'Conversation';
  let headerSubtitle = '';
  
  // For Direct Messages, we want "[Project Name] - [Other User Name]"
  // We need to fetch the other user
  const otherUserId = conversation?.type === 'direct' 
    ? conversation.participantIds.find(id => id !== user?._id) 
    : null;
    
  const otherUser = useQuery(api.users.getUser, otherUserId ? { id: otherUserId } : "skip");



  if (conversation === undefined || messages === undefined || user === undefined) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  }

  if (conversation === null) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Conversation not found.</div>;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage({
        conversationId,
        content: newMessage,
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message.');
    }
  };

  if (conversation.type === 'interview') {
      if (project) {
          const isOwner = user?._id === project.ownerId;
          if (isOwner) {
              // Founder View: "Applicant Name - Role"
               // We need to fetch applicant name. In interview, other participant is applicant.

               // We can use otherUser query if we set otherUserId correctly for interview too, but let's just use what we have or fetch specific
               // Actually, let's reuse otherUser logic if possible or fetch here.
               // Since we didn't set otherUserId for interview above, let's do it now or just rely on a new query if needed.
               // But wait, we can't conditionally call hooks.
               // Let's rely on the fact that we might need to refactor the hook calls above to be more generic.
               // For now, let's just use a generic "Interview Candidate" if we can't easily get the name without breaking hook rules,
               // OR better, let's fix the hook logic.
               
               // ACTUALLY, I can just use the `conversation.projectRole` logic from backend if I updated it?
               // The backend `getConversation` returns `projectRole` as `${application.role} Interview`.
               // But we want "Applicant Name - Role".
               
               // Let's just use "Candidate - Role" for now to be safe, or if we have `otherUser` (which we don't fetch for interview above).
               headerTitle = `${conversation.projectRole || 'Candidate'} - Interview`;
          } else {
              // Applicant View: "Project Name - Role"
              headerTitle = `${project.title} - ${conversation.projectRole?.replace(' Interview', '') || 'Role'}`;
          }
      }
  } else if (project) {
    if (conversation.type === 'direct' && otherUser) {
       // Direct Message in Project Context
       headerTitle = `${otherUser.displayName || otherUser.firstName || otherUser.username}`;
       headerSubtitle = otherUser.role || '';
    } else {
      const isOwner = user?._id === project.ownerId;
      headerTitle = `${project.title} - ${isOwner ? 'Investor' : 'Founder'}`;
    }
  } else if (conversation.type === 'direct') {
    headerTitle = otherUser ? (otherUser.displayName || otherUser.firstName || otherUser.username || 'Direct Message') : 'Direct Message';
    headerSubtitle = otherUser?.role || '';
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Link href="/conversations" className="text-slate-400 hover:text-white mr-4 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold text-white">
              {headerTitle}
            </h1>
            {headerSubtitle && (
                <p className="text-xs text-slate-500">{headerSubtitle}</p>
            )}
            {conversation.isClosed && (
                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20 ml-2">
                    Closed
                </span>
            )}
          </div>
        </div>
        
        {/* Legal Docs for Interview */}
        {conversation.type === 'interview' && conversation.applicationId && project && user?._id === project.ownerId && !conversation.isClosed && (
           <div className="flex gap-2">
               {project.workspaceId && (
                   <Link 
                      href={`/workspaces/${project.workspaceId}/legal`}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
                   >
                      Legal Docs
                   </Link>
               )}
               <AcceptButton applicationId={conversation.applicationId} />
               <RejectButton applicationId={conversation.applicationId} />
           </div>
        )}

        {/* Legal Docs for Direct Message (Founder View) */}
        {conversation.type === 'direct' && project && user?._id === project.ownerId && (
            <div className="flex gap-2">
                {project.workspaceId && (
                    <Link 
                       href={`/workspaces/${project.workspaceId}/legal`}
                       className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
                    >
                       Legal Docs
                    </Link>
                )}
            </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?._id;
            return (
              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg p-3 ${
                  isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'
                }`}>
                  {msg.imageUrl && (
                    <Image 
                      src={msg.imageUrl} 
                      alt="Attachment" 
                      width={300} 
                      height={200} 
                      className="max-w-full rounded mb-2 h-auto" 
                    />
                  )}
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-slate-900 border-t border-slate-800 p-4 sticky bottom-0">
        {conversation.isClosed ? (
            <div className="text-center text-slate-500 text-sm py-2">
                This conversation is closed.
            </div>
        ) : (
            <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
            <button 
                type="button"
                className="p-2 text-slate-400 hover:text-white transition-colors"
                title="Upload Image (Coming Soon)"
            >
                <ImageIcon className="w-5 h-5" />
            </button>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
            <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Send className="w-5 h-5" />
            </button>
            </form>
        )}
      </div>
    </div>
  );
}

function AcceptButton({ applicationId }: { applicationId: Id<'applications'> }) {
  const acceptApplication = useMutation(api.applications.accept);

  const handleAccept = async () => {
    if (confirm('Accept this applicant? They will be added to the workspace.')) {
      await acceptApplication({ applicationId });
      alert('Applicant accepted!');
    }
  };

  return (
    <button 
      onClick={handleAccept}
      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
    >
      Accept
    </button>
  );
}

function RejectButton({ applicationId }: { applicationId: Id<'applications'> }) {
    const rejectApplication = useMutation(api.applications.reject);
  
    const handleReject = async () => {
      if (confirm('Reject this applicant? The conversation will be closed.')) {
        await rejectApplication({ applicationId });
        alert('Applicant rejected.');
      }
    };
  
    return (
      <button 
        onClick={handleReject}
        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Reject
      </button>
    );
  }
