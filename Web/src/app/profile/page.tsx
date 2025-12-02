'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { Briefcase, Shield, User } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const convexUser = useQuery(api.users.getCurrentUser) as any;
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reputation' | 'certifications'>('about');

  if (!isLoaded || !convexUser) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-indigo-900 to-slate-900">
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-2xl bg-slate-800 border-4 border-slate-950 flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
            {convexUser.avatarUrl ? (
              <img src={convexUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
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
          <Link href="/settings" className="px-4 py-2 bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
            Edit Profile
          </Link>
        </div>
        <p className="text-slate-400 mb-6 capitalize">{convexUser.role}</p>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-800 mb-8">
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

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative ${
        active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
      )}
    </button>
  );
}

function AboutTab({ user }: any) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Bio</h3>
        <p className="text-slate-400 leading-relaxed">
          {user.professionalBio || "No bio provided yet."}
        </p>
      </div>
      
      {user.linkedinUrl && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Links</h3>
          <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
            LinkedIn Profile
          </a>
        </div>
      )}
    </div>
  );
}

function PortfolioTab() {
  const projects = useQuery(api.projects.getMyProjects) || [];

  if (projects.length === 0) {
    return <div className="text-slate-400 text-center py-12">No projects yet.</div>;
  }

  return (
    <div className="grid gap-4">
      {projects.map((project: any) => (
        <Link key={project._id} href={`/projects/${project._id}`}>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition-colors">
            <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
            <p className="text-slate-400 text-sm">{project.tagline}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ReputationTab({ userId }: { userId: any }) {
  const vouches = useQuery(api.vouches.list, { targetId: userId }) || [];

  if (vouches.length === 0) {
    return <div className="text-slate-400 text-center py-12">No vouches yet.</div>;
  }

  return (
    <div className="space-y-4">
      {vouches.map((vouch: any) => (
        <div key={vouch._id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-indigo-900 rounded-full flex items-center justify-center text-xs font-bold">
              {vouch.voucherName[0]}
            </div>
            <div>
              <div className="font-medium text-sm">{vouch.voucherName}</div>
              <div className="text-xs text-slate-500">{vouch.relationship}</div>
            </div>
          </div>
          <p className="text-slate-300 text-sm italic">"{vouch.text}"</p>
        </div>
      ))}
    </div>
  );
}

function CertificationsTab({ userId }: { userId: any }) {
  const certifications = useQuery((api as any).certifications.list, { targetId: userId }) || [];

  if (certifications.length === 0) {
    return <div className="text-slate-400 text-center py-12">No certifications yet.</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {certifications.map((cert: any) => (
        <div key={cert._id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
           {/* In a real app, we'd fetch the image URL properly if it's a storage ID */}
          <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-medium text-white">{cert.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${
              cert.status === 'verified' 
                ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' 
                : 'bg-amber-900/30 text-amber-400 border-amber-800'
            }`}>
              {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
