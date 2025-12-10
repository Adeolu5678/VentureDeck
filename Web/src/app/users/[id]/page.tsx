'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useState } from 'react';
import { Id } from '@convex/_generated/dataModel';
import { Briefcase, Shield, User, ThumbsUp, UserPlus, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { toast } from 'sonner';

interface UserData {
  _id: Id<"users">;
  username: string;
  avatarUrl?: string;
  role?: string;
  professionalBio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

interface Project {
  _id: string;
  title: string;
  tagline: string;
}

interface Vouch {
  _id: string;
  voucherName: string;
  relationship: string;
  text: string;
}

interface Certification {
  _id: string;
  title: string;
  status: string;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.id as Id<'users'>;
  
  const currentUser = useQuery(api.users.getCurrentUser);
  const user = useQuery(api.users.getUser, { id: userId }) as UserData | undefined;
  const vouches = useQuery(api.vouches.list, { targetId: userId }) || [];
  const projects = useQuery(api.projects.getUserProjects, { userId }) || [];
  const certifications = useQuery(api.certifications.list, { targetId: userId }) || [];
  
  // Friends Logic
  const myFriends = useQuery(api.friends.getFriendsList) || [];
  const mySentRequests = useQuery(api.friends.getSentRequests) || [];
  const sendFriendRequest = useMutation(api.friends.sendFriendRequest);
  
  const createVouch = useMutation(api.vouches.create);

  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reputation' | 'certifications'>('about');
  const [isVouching, setIsVouching] = useState(false);
  const [relationship, setRelationship] = useState('');
  const [vouchText, setVouchText] = useState('');

  if (user === undefined) return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (user === null) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">User not found.</div>;

  const isMe = currentUser?._id === user._id;
  const isFriend = myFriends.some(f => f._id === user._id);
  const isPending = mySentRequests.some(r => r.friendId === user._id);

  const handleVouch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVouch({
        targetId: userId,
        relationship,
        text: vouchText,
      });
      setIsVouching(false);
      setRelationship('');
      setVouchText('');
      toast.success('Vouch submitted successfully');
    } catch {
      toast.error('Failed to submit vouch');
    }
  };

  const handleConnect = async () => {
    try {
      await sendFriendRequest({ friendId: userId });
      toast.success('Friend request sent');
    } catch {
      toast.error('Failed to send friend request');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Premium Header Background */}
      <div className="relative h-64 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-slate-900 to-accent/20 animate-shimmer bg-[length:200%_100%]" />
        <div className="absolute inset-0 bg-noise" />
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
          <div className="w-40 h-40 rounded-3xl bg-slate-800 border-4 border-background shadow-2xl flex items-center justify-center overflow-hidden relative">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt="Avatar" fill className="object-cover" />
            ) : (
              <span className="text-4xl font-bold text-slate-500">{user.username?.[0].toUpperCase()}</span>
            )}
          </div>
          
          <div className="flex-1 mb-4">
            <h1 className="text-4xl font-bold text-white mb-2">@{user.username}</h1>
            <p className="text-lg text-muted-foreground capitalize flex items-center gap-2">
              {user.role}
              {isFriend && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                  Friend
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            {!isMe && currentUser && (
              <>
                {isFriend ? (
                   <PremiumButton variant="glass" disabled size="sm" leftIcon={<Check className="w-4 h-4" />}>
                     Connected
                   </PremiumButton>
                ) : isPending ? (
                   <PremiumButton variant="glass" disabled size="sm">
                     Request Sent
                   </PremiumButton>
                ) : (
                  <PremiumButton onClick={handleConnect} variant="primary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
                    Connect
                  </PremiumButton>
                )}
                
                <PremiumButton 
                  onClick={() => setIsVouching(true)} 
                  variant="secondary" 
                  size="sm"
                  leftIcon={<ThumbsUp className="w-4 h-4" />}
                >
                  Vouch
                </PremiumButton>
              </>
            )}
            {isMe && (
               <Link href="/settings">
                 <PremiumButton variant="glass" size="sm">Edit Profile</PremiumButton>
               </Link>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-white/5 mb-8 overflow-x-auto">
          <TabButton 
            active={activeTab === 'about'} 
            onClick={() => setActiveTab('about')} 
            icon={User} 
            label="About" 
          />
          <TabButton 
            active={activeTab === 'portfolio'} 
            onClick={() => setActiveTab('portfolio')} 
            icon={Briefcase} 
            label="Portfolio" 
          />
          <TabButton 
            active={activeTab === 'reputation'} 
            onClick={() => setActiveTab('reputation')} 
            icon={Shield} 
            label="Reputation" 
          />
          <TabButton 
            active={activeTab === 'certifications'} 
            onClick={() => setActiveTab('certifications')} 
            icon={Shield} 
            label="Certifications" 
          />
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          {activeTab === 'about' && (
            <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="md:col-span-2 space-y-6">
                <PremiumCard title="Professional Bio">
                  <h3 className="text-lg font-bold text-white mb-4">Bio</h3>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {user.professionalBio || "No bio provided yet."}
                  </p>
                </PremiumCard>
              </div>
              <div>
                <PremiumCard>
                  <h3 className="text-lg font-bold text-white mb-4">Links</h3>
                  <div className="flex flex-col gap-3">
                    {user.linkedinUrl ? (
                      <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
                        <span className="font-medium">LinkedIn</span>
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">No LinkedIn</span>
                    )}
                    {user.githubUrl ? (
                      <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
                        <span className="font-medium">GitHub</span>
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">No GitHub</span>
                    )}
                  </div>
                </PremiumCard>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {projects.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">No projects publicly visible.</div>
              ) : (
                projects.map((project: Project) => (
                  <Link key={project._id} href={`/projects/${project._id}`} className="block">
                    <PremiumCard glow className="h-full">
                      <h3 className="font-bold text-xl text-white mb-2">{project.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-3">{project.tagline}</p>
                    </PremiumCard>
                  </Link>
                ))
              )}
            </div>
          )}

          {activeTab === 'reputation' && (
            <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {vouches.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">No vouches received yet.</div>
              ) : (
                vouches.map((vouch: Vouch) => (
                  <PremiumCard key={vouch._id} className="relative">
                    <div className="absolute -top-3 -right-3">
                       <div className="bg-accent/20 text-accent p-2 rounded-xl">
                         <ThumbsUp className="w-4 h-4" />
                       </div>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                        {vouch.voucherName?.[0] || "?"}
                      </div>
                      <div>
                        <div className="font-bold text-white">{vouch.voucherName}</div>
                        <div className="text-xs text-muted-foreground">{vouch.relationship}</div>
                      </div>
                    </div>
                    <blockquote className="text-slate-300 italic text-sm border-l-2 border-white/10 pl-4">
                      &quot;{vouch.text}&quot;
                    </blockquote>
                  </PremiumCard>
                ))
              )}
            </div>
          )}

          {activeTab === 'certifications' && (
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {certifications.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">No certifications verified.</div>
              ) : (
                certifications.map((cert: Certification) => (
                  <PremiumCard key={cert._id} className="flex items-start gap-4">
                     <div className="p-3 bg-emerald-500/10 rounded-xl">
                       <Shield className="w-6 h-6 text-emerald-400" />
                     </div>
                     <div>
                       <h3 className="font-bold text-white mb-1">{cert.title}</h3>
                       <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                         cert.status === 'verified' 
                           ? 'bg-emerald-500/10 text-emerald-400' 
                           : 'bg-amber-500/10 text-amber-400'
                       }`}>
                         {cert.status}
                       </span>
                     </div>
                  </PremiumCard>
                ))
              )}
             </div>
          )}
        </div>

        {/* Vouch Modal */}
        {isVouching && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <PremiumCard variant="solid" className="w-full max-w-md">
              <h2 className="text-xl font-bold mb-6 text-white">Vouch for @{user.username}</h2>
              <form onSubmit={handleVouch} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Relationship</label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g. Worked together at Google"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Endorsement</label>
                  <textarea
                    value={vouchText}
                    onChange={(e) => setVouchText(e.target.value)}
                    placeholder="What makes them great?"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-primary outline-none h-32 resize-none transition-colors"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <PremiumButton 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsVouching(false)}
                    className="flex-1"
                  >
                    Cancel
                  </PremiumButton>
                  <PremiumButton 
                    type="submit" 
                    variant="primary" 
                    className="flex-1"
                  >
                    Submit Vouch
                  </PremiumButton>
                </div>
              </form>
            </PremiumCard>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${
        active ? 'text-white' : 'text-muted-foreground hover:text-white'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-primary' : ''}`} />
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(0,163,255,0.5)]" />
      )}
    </button>
  );
}
