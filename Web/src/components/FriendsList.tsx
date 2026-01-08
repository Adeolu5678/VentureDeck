'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { Check, UserMinus, X, User, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

export function FriendsList() {
  const friends = useQuery(api.friends.getFriendsList) || [];
  const pendingRequests = useQuery(api.friends.getPendingRequests) || [];
  
  const acceptRequest = useMutation(api.friends.acceptFriendRequest);
  const rejectRequest = useMutation(api.friends.rejectFriendRequest);
  const removeFriend = useMutation(api.friends.removeFriend);

  const handleAccept = async (requestId: Id<'friends'>) => {
    try {
      await acceptRequest({ requestId });
      toast.success('Friend request accepted');
    } catch {
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async (requestId: Id<'friends'>) => {
    try {
      await rejectRequest({ requestId });
      toast.success('Friend request rejected');
    } catch {
      toast.error('Failed to reject request');
    }
  };

  const handleRemove = async (friendshipId: Id<'friends'>) => {
    try {
      if (!confirm('Are you sure you want to remove this friend?')) return;
      await removeFriend({ friendshipId });
      toast.success('Friend removed');
    } catch {
      toast.error('Failed to remove friend');
    }
  };

  return (
    <div className="space-y-8">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-accent" />
            Pending Requests
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {pendingRequests.map((request) => (
              <PremiumCard key={request._id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden relative border border-white/10">
                    {request.sender.avatarUrl ? (
                      <Image src={request.sender.avatarUrl} alt="" fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-primary/20 text-primary">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold">{request.sender.username}</div>
                    <div className="text-xs text-muted-foreground">wants to be friends</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAccept(request._id)}
                    className="p-2 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleReject(request._id)}
                    className="p-2 rounded-full bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </PremiumCard>
            ))}
          </div>
        </section>
      )}

      {/* Friends List */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Friends ({friends.length})
        </h3>
        
        {friends.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-white/5 rounded-3xl border border-white/5">
            You haven&apos;t added any friends yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {friends.map((friend) => (
              <PremiumCard key={friend._id} className="flex items-center justify-between group">
                <Link href={`/users/${friend._id}`} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted overflow-hidden relative border border-white/10 group-hover:border-primary/50 transition-colors">
                    {friend.avatarUrl ? (
                      <Image src={friend.avatarUrl} alt="" fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-primary/20 text-primary">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-bold group-hover:text-primary transition-colors">{friend.username}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {friend.firstName} {friend.lastName}
                    </div>
                  </div>
                </Link>
                
                <button 
                  onClick={() => handleRemove(friend.friendshipId as Id<'friends'>)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove friend"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              </PremiumCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
