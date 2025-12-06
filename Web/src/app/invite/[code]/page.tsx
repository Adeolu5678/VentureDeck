'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, ArrowRight, XCircle } from 'lucide-react';

export default function InvitePage() {
  const params = useParams();
  const inviteCode = params.code as string;
  const router = useRouter();
  
  const workspace = useQuery(api.workspaces.getWorkspaceByInviteCode, { inviteCode });
  const joinWorkspace = useMutation(api.workspaces.joinByInviteCode);
  
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!workspace) return;
    
    setIsJoining(true);
    try {
      const workspaceId = await joinWorkspace({ inviteCode });
      toast.success('Joined workspace successfully');
      router.push(`/workspaces/${workspaceId}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to join workspace');
      setIsJoining(false);
    }
  };

  if (workspace === undefined) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (workspace === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Invalid Invite Link</h1>
          <p className="text-slate-400 mb-6">
            This invite link is invalid or has expired. Please ask the workspace owner for a new link.
          </p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 text-center shadow-2xl relative z-10">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
          <span className="text-3xl font-bold text-indigo-500">{workspace.name.charAt(0).toUpperCase()}</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Join {workspace.name}</h1>
        <p className="text-slate-400 mb-8">
          You&apos;ve been invited to join this workspace on VentureDeck.
        </p>

        <button 
          onClick={handleJoin}
          disabled={isJoining}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {isJoining ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              Join Workspace
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
