'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { Search, UserPlus, User, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { motion } from 'framer-motion';
import { useDebouncedCallback } from 'use-debounce';

interface SearchUser {
  _id: Id<'users'>;
  username: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role?: string;
}

export function UserSearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const currentUser = useQuery(api.users.getCurrentUser);
  const searchResults = useQuery(
    api.users.searchUsers,
    query.length >= 2 ? { 
      query, 
      limit: 10,
      excludeUserId: currentUser?._id as Id<'users'> | undefined
    } : 'skip'
  );
  
  const sendFriendRequest = useMutation(api.friends.sendFriendRequest);
  const existingFriends = useQuery(api.friends.getFriendsList) || [];
  const pendingRequests = useQuery(api.friends.getPendingRequests) || [];
  const sentRequests = useQuery(api.friends.getSentRequests) || [];

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setQuery(value);
    setIsSearching(false);
  }, 300);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  const handleSendRequest = async (userId: Id<'users'>) => {
    try {
      await sendFriendRequest({ friendId: userId });
      toast.success('Friend request sent!');
    } catch {
      toast.error('Failed to send request');
    }
  };

  const isAlreadyFriend = (userId: Id<'users'>) => {
    return existingFriends.some(f => f._id === userId);
  };

  const hasPendingRequest = (userId: Id<'users'>) => {
    return pendingRequests.some(r => r.sender._id === userId);
  };

  const hasSentRequest = (userId: Id<'users'>) => {
    return sentRequests.some(r => r.friendId === userId);
  };

  const getButtonState = (userId: Id<'users'>) => {
    if (isAlreadyFriend(userId)) return 'friend';
    if (hasSentRequest(userId)) return 'sent';
    if (hasPendingRequest(userId)) return 'pending';
    return 'add';
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-primary" />
        Find People
      </h3>
      
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by username..."
          onChange={handleSearch}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
        )}
      </div>

      {/* Search Results */}
      {query.length >= 2 && (
        <div className="space-y-3">
          {searchResults === undefined ? (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="w-6 h-6 mx-auto animate-spin" />
            </div>
          ) : searchResults.results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-white/5 rounded-xl">
              No users found matching &quot;{query}&quot;
            </div>
          ) : (
            searchResults.results.map((user: SearchUser, index: number) => {
              const buttonState = getButtonState(user._id);
              
              return (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PremiumCard className="flex items-center justify-between">
                    <Link href={`/users/${user._id}`} className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-muted overflow-hidden relative border border-white/10 hover:border-primary/50 transition-colors">
                        {user.avatarUrl ? (
                          <Image src={user.avatarUrl} alt="" fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-primary/20 text-primary">
                            <User className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold hover:text-primary transition-colors">
                          {user.displayName || user.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          @{user.username}
                          {user.role && (
                            <span className="ml-2 px-2 py-0.5 bg-white/5 rounded text-[10px] uppercase">
                              {user.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    
                    {buttonState === 'friend' ? (
                      <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-lg">
                        ✓ Friends
                      </span>
                    ) : buttonState === 'sent' ? (
                      <span className="px-3 py-1.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-lg">
                        Request Sent
                      </span>
                    ) : buttonState === 'pending' ? (
                      <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-lg">
                        Pending
                      </span>
                    ) : (
                      <PremiumButton
                        onClick={() => handleSendRequest(user._id)}
                        variant="glass"
                        size="sm"
                        leftIcon={<UserPlus className="w-4 h-4" />}
                      >
                        Add
                      </PremiumButton>
                    )}
                  </PremiumCard>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {query.length > 0 && query.length < 2 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          Type at least 2 characters to search
        </div>
      )}
    </div>
  );
}

export default UserSearch;
