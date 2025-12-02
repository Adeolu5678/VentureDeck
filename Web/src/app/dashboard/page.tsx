'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, TrendingUp, Users, ArrowRight, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  // Fetch current user from Convex to get role
  const convexUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) return null;
  if (!user) return null;

  if (convexUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user has no role, we might need to prompt them. 
  // For now, let's assume they are an Entrepreneur if undefined, or show a selection screen.
  // Let's implement a simple selection if role is missing.
  if (convexUser && !convexUser.role) {
    return <RoleSelection />;
  }

  const isEntrepreneur = convexUser?.role === 'entrepreneur';

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="text-gradient">{convexUser?.firstName || convexUser?.username}</span>
          </h1>
          <p className="text-slate-400 text-lg">
            {isEntrepreneur 
              ? "Your venture awaits. What will you build today?" 
              : "Discover the next generation of unicorns."}
          </p>
        </header>

        {isEntrepreneur ? <EntrepreneurDashboard /> : <InvestorDashboard />}
      </main>
    </div>
  );
}

function RoleSelection() {
  const setRole = useMutation(api.users.setRole);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = async (role: 'entrepreneur' | 'investor') => {
    setIsSubmitting(true);
    try {
      await setRole({ role });
      // The query in the parent component will automatically update and switch the view
    } catch (error) {
      console.error("Failed to set role:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full p-10 glass-panel rounded-3xl text-center animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Choose Your Path</h2>
        <p className="text-slate-400 mb-10 text-lg">
          VentureDeck is a dual-sided marketplace. <br/> How will you participate?
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <button 
            onClick={() => handleRoleSelect('entrepreneur')}
            disabled={isSubmitting}
            className="group relative p-6 glass-button rounded-2xl text-left hover:border-indigo-500/50 transition-all"
          >
            <div className="mb-4 w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-bold text-lg mb-1">Entrepreneur</h3>
            <p className="text-sm text-slate-400">I want to raise capital and build a startup.</p>
          </button>
          
          <button 
            onClick={() => handleRoleSelect('investor')}
            disabled={isSubmitting}
            className="group relative p-6 glass-button rounded-2xl text-left hover:border-emerald-500/50 transition-all"
          >
            <div className="mb-4 w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-bold text-lg mb-1">Investor</h3>
            <p className="text-sm text-slate-400">I want to find and fund high-growth startups.</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function EntrepreneurDashboard() {
  const myProjects = useQuery(api.projects.getMyProjects) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-400" />
          My Projects
        </h2>
        <Link 
          href="/projects/create" 
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {myProjects.length === 0 ? (
        <div className="p-16 border border-dashed border-slate-800 rounded-3xl text-center bg-slate-900/20 backdrop-blur-sm">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Your journey begins here. Create your first project to start tracking milestones and attracting investors.
          </p>
          <Link 
            href="/projects/create" 
            className="px-8 py-4 bg-white text-slate-950 hover:bg-slate-200 rounded-full font-bold inline-flex items-center gap-2 transition-all"
          >
            Create Project <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((project) => (
            <Link key={project._id} href={`/projects/${project._id}`} className="block group">
              <div className="glass-panel rounded-2xl p-6 hover:border-indigo-500/50 transition-all h-full group-hover:-translate-y-1">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-2xl font-bold text-indigo-400 border border-indigo-500/20">
                    {project.logoUrl ? (
                      <img src={project.logoUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      project.title[0]
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    project.status === 'published' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{project.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function InvestorDashboard() {
  const projects = useQuery(api.projects.list, {}) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          Discover
        </h2>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="pl-11 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project._id} href={`/projects/${project._id}`} className="block group">
            <div className="glass-panel rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all h-full flex flex-col group-hover:-translate-y-1">
              <div className="h-40 bg-slate-800 relative overflow-hidden">
                {/* Placeholder cover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 w-14 h-14 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                   {project.logoUrl ? (
                      <img src={project.logoUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      project.title[0]
                    )}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                    {project.industry}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">{project.tagline}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="text-sm">
                    <span className="text-slate-500 block text-xs mb-0.5">Goal</span>
                    <span className="text-white font-medium">${project.fundingGoal.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-right">
                    <span className="text-slate-500 block text-xs mb-0.5">Equity</span>
                    <span className="text-white font-medium">{project.equityOffered}%</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
