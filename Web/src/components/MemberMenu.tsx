import { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, User, MessageSquare, Shield, Ban, X } from 'lucide-react';
import { Id } from '@convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { toast } from 'sonner';
import { logError } from '@/lib/errorTracking';

interface MemberMenuProps {
  memberId: Id<'users'>;
  workspaceId?: Id<'workspaces'>;
  projectId?: Id<'projects'>;
  isCurrentUser: boolean;
  isFounder: boolean; // If the current user is the founder
  memberRole?: string;
  onKick?: () => void;
}

export default function MemberMenu({ 
  memberId, 
  workspaceId, 
  projectId,
  isCurrentUser, 
  isFounder,
  memberRole,
  onKick
}: MemberMenuProps) {
  const router = useRouter();
  const kickMember = useMutation(api.workspaces.kickMember);
  const updateRole = useMutation(api.workspaces.updateRole);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isChangePositionOpen, setIsChangePositionOpen] = useState(false);
  const [newRole, setNewRole] = useState(memberRole || '');

  const handleViewProfile = () => {
    router.push(`/users/${memberId}`);
    setIsOpen(false);
  };

  const createDirectMessage = useMutation(api.conversations.createDirectMessage);

  const handleMessage = async () => {
    try {
      const conversationId = await createDirectMessage({ 
        participantId: memberId,
        projectId 
      });
      router.push(`/conversations/${conversationId}`);
      setIsOpen(false);
    } catch (error) {
      logError(error, { component: 'MemberMenu', action: 'createDirectMessage' });
      toast.error('Failed to start conversation');
    }
  };

  const handleKick = async () => {
    if (!workspaceId) return;
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    try {
      await kickMember({ workspaceId, memberId });
      toast.success('Member removed from workspace');
      if (onKick) onKick();
    } catch (error) {
      toast.error('Failed to remove member');
      logError(error, { component: 'MemberMenu', action: 'kickMember' });
    }
    setIsOpen(false);
  };

  const handleChangePosition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId || !newRole.trim()) return;

    try {
      await updateRole({ workspaceId, userId: memberId, role: newRole });
      toast.success('Position updated');
      setIsChangePositionOpen(false);
    } catch (error) {
      toast.error('Failed to update position');
      logError(error, { component: 'MemberMenu', action: 'updateRole' });
    }
  };

  if (isCurrentUser) return null;

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewProfile}>
            <User className="mr-2 h-4 w-4" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleMessage}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Message Privately
          </DropdownMenuItem>
          
          {isFounder && workspaceId && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                setNewRole(memberRole || '');
                setIsChangePositionOpen(true);
                setIsOpen(false);
              }}>
                <Shield className="mr-2 h-4 w-4" />
                Change Position
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleKick} className="text-red-600 focus:text-red-600">
                <Ban className="mr-2 h-4 w-4" />
                Kick Member
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Change Position Modal */}
      {isChangePositionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Change Position</h3>
              <button onClick={() => setIsChangePositionOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleChangePosition} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">New Position</label>
                <input 
                  type="text" 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. CTO, Developer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsChangePositionOpen(false)}
                  className="flex-1 py-2 glass-button text-slate-300 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
