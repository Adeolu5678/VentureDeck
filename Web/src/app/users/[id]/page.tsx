'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';

import { useState } from 'react';
import { Id } from '@convex/_generated/dataModel';
import { Briefcase, Shield, User, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { shortenUrl } from '@/lib/utils';

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

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

import { useParams } from 'next/navigation';

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.id as Id<'users'>;
  
  const currentUser = useQuery(api.users.getCurrentUser);
  const user = useQuery(api.users.getUser, { id: userId }) as UserData | undefined;
  const vouches = useQuery(api.vouches.list, { targetId: userId }) || [];
  const projects = useQuery(api.projects.getUserProjects, { userId }) || [];
  const createVouch = useMutation(api.vouches.create);

  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reputation'>('about');
  const [isVouching, setIsVouching] = useState(false);
  const [relationship, setRelationship] = useState('');
  const [vouchText, setVouchText] = useState('');

  if (user === undefined) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Loading...</div>;
  if (user === null) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">User not found.</div>;

  const isMe = currentUser?._id === user._id;

  const handleVouch = async (e: React.FormEvent) => {
    e.preventDefault();
    await createVouch({
      targetId: userId,
      relationship,
      text: vouchText,
    });
    setIsVouching(false);
    setRelationship('');
    setVouchText('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-primary/20 to-background">
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-2xl bg-muted border-4 border-background flex items-center justify-center text-3xl font-bold text-foreground overflow-hidden">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt="Avatar" fill className="object-cover" />
            ) : (
              user.username?.[0].toUpperCase()
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 px-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">
            @{user.username}
          </h1>
          {!isMe && currentUser && (
            <button 
              onClick={() => setIsVouching(true)}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <ThumbsUp className="w-4 h-4" />
              Vouch
            </button>
          )}
        </div>
        <p className="text-muted-foreground mb-6 capitalize">{user.role}</p>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-border mb-8">
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
        </div>

        {/* Content */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Bio</h3>
              <p className="text-muted-foreground leading-relaxed">
                {user.professionalBio || "No bio provided yet."}
              </p>
            </div>
            {user.linkedinUrl && (
              <div className="glass-panel rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Links</h3>
                <div className="flex flex-col gap-3">
                  <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                    <span className="font-medium">LinkedIn:</span> {shortenUrl(user.linkedinUrl)}
                  </a>
                  {user.githubUrl && (
                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                      <span className="font-medium">GitHub:</span> {shortenUrl(user.githubUrl)}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="grid gap-4">
            {projects.length === 0 ? (
              <div className="text-muted-foreground text-center py-12">No projects yet.</div>
            ) : (
              projects.map((project: Project) => (
                <Link key={project._id} href={`/projects/${project._id}`}>
                  <div className="glass-panel rounded-xl p-6 hover:border-primary/50 transition-colors">
                    <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                    <p className="text-muted-foreground text-sm">{project.tagline}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'reputation' && (
          <div className="space-y-4">
            {vouches.length === 0 ? (
              <div className="text-muted-foreground text-center py-12">No vouches yet.</div>
            ) : (
              vouches.map((vouch: Vouch) => (
                <div key={vouch._id} className="glass-panel rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                      {vouch.voucherName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{vouch.voucherName}</div>
                      <div className="text-xs text-muted-foreground">{vouch.relationship}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm italic">&quot;{vouch.text}&quot;</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Vouch Modal */}
        {isVouching && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold mb-4 text-foreground">Vouch for @{user.username}</h2>
              <form onSubmit={handleVouch} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Relationship</label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g. Worked together at Google"
                    className="w-full bg-input border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Endorsement</label>
                  <textarea
                    value={vouchText}
                    onChange={(e) => setVouchText(e.target.value)}
                    placeholder="What makes them great?"
                    className="w-full bg-input border border-border rounded-lg p-3 text-sm text-foreground focus:border-primary outline-none h-24"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsVouching(false)}
                    className="flex-1 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium text-primary-foreground transition-colors"
                  >
                    Submit Vouch
                  </button>
                </div>
              </form>
            </div>
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
      className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative ${
        active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
      )}
    </button>
  );
}
