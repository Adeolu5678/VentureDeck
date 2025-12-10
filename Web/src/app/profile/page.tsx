'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { Briefcase, Shield, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { shortenUrl } from '@/lib/utils';
import { useBottomNav } from '@/context/BottomNavContext';
import { useEffect } from 'react';
import { Settings } from 'lucide-react';

interface UserData {
  _id: Id<"users">;
  username?: string;
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

export default function ProfilePage() {
  const { isLoaded } = useUser();
  const convexUser = useQuery(api.users.getCurrentUser) as UserData | undefined;
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reputation' | 'certifications'>('about');
  const { setActions } = useBottomNav();

  useEffect(() => {
    setActions(
      <Link 
        href="/settings" 
        className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-bold transition-all flex items-center justify-center text-sm"
      >
        <Settings className="w-4 h-4 mr-2" />
        Edit Profile
      </Link>
    );
    return () => setActions(null);
  }, [setActions]);

  if (!isLoaded || !convexUser) return null;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-primary/20 to-background">
        <div className="absolute -bottom-12 left-6">
          <div className="relative w-24 h-24 rounded-2xl bg-muted border-4 border-background flex items-center justify-center text-3xl font-bold text-foreground overflow-hidden">
            {convexUser.avatarUrl ? (
              <Image src={convexUser.avatarUrl} alt="Avatar" fill className="object-cover" />
            ) : (
              convexUser.username?.[0].toUpperCase()
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 px-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">
            @{convexUser.username}
          </h1>
          <Link href="/settings" className="px-4 py-2 bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
            Edit Profile
          </Link>
        </div>
        <p className="text-muted-foreground mb-6 capitalize">{convexUser.role}</p>

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
          <TabButton 
            active={activeTab === 'certifications'} 
            onClick={() => setActiveTab('certifications')} 
            icon={Shield} 
            label="Certifications" 
          />
        </div>

        {/* Content */}
        {activeTab === 'about' && <AboutTab user={convexUser} />}
        {activeTab === 'portfolio' && <PortfolioTab />}
        {activeTab === 'reputation' && <ReputationTab userId={convexUser._id} />}
        {activeTab === 'certifications' && <CertificationsTab userId={convexUser._id} />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
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

function AboutTab({ user }: { user: UserData }) {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Bio</h3>
        <p className="text-muted-foreground leading-relaxed">
          {user.professionalBio || "No bio provided yet."}
        </p>
      </div>
      
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Links</h3>
        <div className="flex flex-col gap-3">
          {user.linkedinUrl && (
            <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
              <span className="font-medium">LinkedIn:</span> {shortenUrl(user.linkedinUrl)}
            </a>
          )}
          {user.githubUrl && (
            <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
              <span className="font-medium">GitHub:</span> {shortenUrl(user.githubUrl)}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function PortfolioTab() {
  const projects = useQuery(api.projects.getMyProjects) || [];

  if (projects.length === 0) {
    return <div className="text-muted-foreground text-center py-12">No projects yet.</div>;
  }

  return (
    <div className="grid gap-4">
      {projects.map((project: Project) => (
        <Link key={project._id} href={`/projects/${project._id}`}>
          <div className="glass-panel rounded-xl p-6 hover:border-primary/50 transition-colors">
            <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
            <p className="text-muted-foreground text-sm">{project.tagline}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ReputationTab({ userId }: { userId: Id<"users"> }) {
  const vouches = useQuery(api.vouches.list, { targetId: userId }) || [];

  if (vouches.length === 0) {
    return <div className="text-muted-foreground text-center py-12">No vouches yet.</div>;
  }

  return (
    <div className="space-y-4">
      {vouches.map((vouch: Vouch) => (
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
      ))}
    </div>
  );
}

function CertificationsTab({ userId }: { userId: Id<"users"> }) {
  const certifications = useQuery(api.certifications.list, { targetId: userId }) || [];

  if (certifications.length === 0) {
    return <div className="text-muted-foreground text-center py-12">No certifications yet.</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {certifications.map((cert: Certification) => (
        <div key={cert._id} className="glass-panel rounded-xl p-4 flex items-center gap-4">
           {/* In a real app, we'd fetch the image URL properly if it's a storage ID */}
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{cert.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${
              cert.status === 'verified' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
