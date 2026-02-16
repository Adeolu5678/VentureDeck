'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserPlus, Settings, Check, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import NextImage from 'next/image';
import { logError } from '@/lib/errorTracking';

interface ChannelMenuProps {
  channelId: Id<'conversations'>;
  workspaceId: Id<'workspaces'>;
}

export default function ChannelMenu({ channelId, workspaceId }: ChannelMenuProps) {
  const [showInvite, setShowInvite] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const leaveChannel = useMutation(api.conversations.leaveChannel);

  const handleLeaveChannel = async () => {
    if (confirm('Are you sure you want to leave this room?')) {
      try {
        await leaveChannel({ conversationId: channelId });
        toast.success('Left room');
      } catch {
        toast.error('Failed to leave room');
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setShowInvite(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Members
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowSettings(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLeaveChannel} className="text-red-600 focus:text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Leave Room
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showInvite && (
        <InviteMembersModal 
          channelId={channelId} 
          workspaceId={workspaceId} 
          onClose={() => setShowInvite(false)} 
        />
      )}

      {showSettings && (
        <ChannelSettingsModal 
          channelId={channelId} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </>
  );
}

function InviteMembersModal({ channelId, workspaceId, onClose }: { channelId: Id<'conversations'>, workspaceId: Id<'workspaces'>, onClose: () => void }) {
  const workspace = useQuery(api.workspaces.get, { id: workspaceId });
  const channel = useQuery(api.conversations.getConversation, { conversationId: channelId });
  const addMembers = useMutation(api.conversations.addMembersToChannel);
  
  const [selectedMembers, setSelectedMembers] = useState<Id<'users'>[]>([]);

  if (!workspace || !channel) return null;

  // Filter out members who are already in the channel
  const availableMembers = workspace.members.filter(m => !channel.participantIds.includes(m));

  const toggleMember = (memberId: Id<'users'>) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleInvite = async () => {
    try {
      await addMembers({ conversationId: channelId, memberIds: selectedMembers });
      toast.success('Members invited');
      onClose();
    } catch (error) {
      logError(error, { component: 'ChannelMenu', action: 'inviteMembers' });
      toast.error('Failed to invite members');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-white mb-4">Invite Members</h3>
        
        <div className="max-h-60 overflow-y-auto space-y-2 mb-6">
          {availableMembers.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">All workspace members are already in this channel.</p>
          ) : (
            availableMembers.map(memberId => (
              <MemberSelectItem 
                key={memberId} 
                memberId={memberId} 
                isSelected={selectedMembers.includes(memberId)}
                onToggle={() => toggleMember(memberId)}
              />
            ))
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 glass-button text-slate-300 rounded-xl text-sm font-medium">
            Cancel
          </button>
          <button 
            onClick={handleInvite}
            disabled={selectedMembers.length === 0}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium"
          >
            Invite ({selectedMembers.length})
          </button>
        </div>
      </div>
    </div>
  );
}

function MemberSelectItem({ memberId, isSelected, onToggle }: { memberId: Id<'users'>, isSelected: boolean, onToggle: () => void }) {
  const user = useQuery(api.users.getUser, { id: memberId });
  if (!user) return null;

  return (
    <div 
      onClick={onToggle}
      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
        isSelected 
          ? 'bg-indigo-600/10 border-indigo-500/50' 
          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-medium text-slate-400">
          {user.avatarUrl ? <NextImage src={user.avatarUrl} alt={user.displayName || "User"} width={32} height={32} className="w-full h-full rounded-full object-cover" /> : (user.firstName?.[0] || 'U')}
        </div>
        <span className="text-sm text-slate-200">{user.displayName || user.firstName || user.username}</span>
      </div>
      {isSelected && <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
    </div>
  );
}

function ChannelSettingsModal({ channelId, onClose }: { channelId: Id<'conversations'>, onClose: () => void }) {
  const channel = useQuery(api.conversations.getConversation, { conversationId: channelId });
  const updateChannel = useMutation(api.conversations.updateChannel);
  const [name, setName] = useState(channel?.name || '');
  const [visibility, setVisibility] = useState<'public' | 'private'>(channel?.visibility as 'public' | 'private' || 'public');
  const [isClosed, setIsClosed] = useState(channel?.isClosed || false);

  // Update local state when channel data loads
  if (channel && name === '' && channel.name) setName(channel.name);

  const handleSave = async () => {
    try {
      await updateChannel({
        conversationId: channelId,
        name,
        visibility,
        isClosed
      });
      toast.success('Channel updated');
      onClose();
    } catch (error) {
      logError(error, { component: 'ChannelMenu', action: 'updateChannel' });
      toast.error('Failed to update channel');
    }
  };

  if (!channel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Channel Settings</h3>
          <button onClick={onClose} aria-label="Close settings" className="text-slate-400 hover:text-white">
            <Check className="w-5 h-5 rotate-45" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Channel Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <div className="text-sm font-medium text-slate-200">Private Channel</div>
              <div className="text-xs text-slate-500">Only invited members can view and join</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={visibility === 'private'} 
                onChange={(e) => setVisibility(e.target.checked ? 'private' : 'public')}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <div className="text-sm font-medium text-slate-200">Close Channel</div>
              <div className="text-xs text-slate-500">Archive this channel (read-only)</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isClosed} 
                onChange={(e) => setIsClosed(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 glass-button text-slate-300 rounded-xl text-sm font-medium">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
