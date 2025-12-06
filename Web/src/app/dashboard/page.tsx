'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, TrendingUp, Users, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import MatchmakingWidget from '../../../components/MatchmakingWidget';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  // Fetch current user from Convex to get role
  const convexUser = useQuery(api.users.getCurrentUser);

  const createUser = useMutation(api.users.createOrUpdateUser);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    if (isLoaded && user && convexUser === null) {
      const syncUser = async () => {
        try {
          await createUser({
            clerkId: user.id,
            username: user.username || user.firstName || 'User',
            email: user.emailAddresses[0]?.emailAddress || '',
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            avatarUrl: user.imageUrl,
          });
        } catch (error) {
          console.error("Failed to sync user:", error);
        }
      };
      syncUser();
    }
  }, [isLoaded, user, convexUser, createUser]);

  if (!isLoaded) return null;
  if (!user) return null;

  if (convexUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user has no role, we might need to prompt them. 
  // For now, let's assume they are an Entrepreneur if undefined, or show a selection screen.
  // Handle case where user is logged in to Clerk but not yet in Convex (webhook delay)
  if (convexUser === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold mb-2">Setting up your account...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your workspace.</p>
        </div>
      </div>
    );
  }

  // If user has no role, prompt selection
  if (!convexUser.role) {
    return <RoleSelection />;
  }

  const isEntrepreneur = convexUser.role === 'entrepreneur';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="text-gradient">{convexUser.firstName || convexUser.username}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-xl w-full p-10 glass-panel rounded-3xl text-center animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Choose Your Path</h2>
        <p className="text-muted-foreground mb-10 text-lg">
          VentureDeck is a dual-sided marketplace. <br/> How will you participate?
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <button 
            onClick={() => handleRoleSelect('entrepreneur')}
            disabled={isSubmitting}
            className="group relative p-6 glass-button rounded-2xl text-left hover:border-primary/50 transition-all"
          >
            <div className="mb-4 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-1">Entrepreneur</h3>
            <p className="text-sm text-muted-foreground">I want to raise capital and build a startup.</p>
          </button>
          
          <button 
            onClick={() => handleRoleSelect('investor')}
            disabled={isSubmitting}
            className="group relative p-6 glass-button rounded-2xl text-left hover:border-accent/50 transition-all"
          >
            <div className="mb-4 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-bold text-lg mb-1">Investor</h3>
            <p className="text-sm text-muted-foreground">I want to find and fund high-growth startups.</p>
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
          <TrendingUp className="w-6 h-6 text-primary" />
          My Projects
        </h2>
        <Link 
          href="/projects/create" 
          className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {myProjects.length === 0 ? (
        <div className="p-16 border border-dashed border-border rounded-3xl text-center bg-muted/20 backdrop-blur-sm">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plus className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Your journey begins here. Create your first project to start tracking milestones and attracting investors.
          </p>
          <Link 
            href="/projects/create" 
            className="px-8 py-4 bg-foreground text-background hover:bg-muted-foreground/90 rounded-full font-bold inline-flex items-center gap-2 transition-all"
          >
            Create Project <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((project) => (
            <Link key={project._id} href={`/projects/${project._id}`} className="block group">
              <div className="glass-panel rounded-2xl p-6 hover:border-primary/50 transition-all h-full group-hover:-translate-y-1">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center text-2xl font-bold text-primary border border-primary/20">
                    {project.logoUrl ? (
                      <Image src={project.logoUrl} alt="" width={56} height={56} className="object-cover rounded-xl" />
                    ) : (
                      project.title[0]
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    project.status === 'published' 
                      ? 'bg-accent/10 text-accent border-accent/20' 
                      : 'bg-muted text-muted-foreground border-border'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{project.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <JoinedProjectsSection />
    </div>
  );
}

function JoinedProjectsSection() {
  const joinedProjects = useQuery(api.projects.getProjectsIAmMemberOf) || [];

  if (joinedProjects.length === 0) return null;

  return (
    <div className="space-y-6 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Users className="w-6 h-6 text-accent" />
        Workspaces I&apos;m a Part of
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {joinedProjects.map((project) => (
          <Link key={project._id} href={`/workspaces/${project.workspaceId}`} className="block group">
            <div className="glass-panel rounded-2xl p-6 hover:border-accent/50 transition-all h-full group-hover:-translate-y-1">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center text-2xl font-bold text-accent border border-accent/20">
                  {project.logoUrl ? (
                    <Image src={project.logoUrl} alt="" width={56} height={56} className="object-cover rounded-xl" />
                  ) : (
                    project.title[0]
                  )}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                  Member
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{project.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function InvestorDashboard() {
  const projects = useQuery(api.projects.list, {}) || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
      {/* AI Matchmaking Widget */}
      <MatchmakingWidget />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-accent" />
          Discover
        </h2>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="pl-11 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project._id} href={`/projects/${project._id}`} className="block group">
            <div className="glass-panel rounded-2xl p-6 hover:border-primary/50 transition-all h-full group-hover:-translate-y-1">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center text-2xl font-bold text-primary border border-primary/20">
                   {project.logoUrl ? (
                      <Image src={project.logoUrl} alt="" width={56} height={56} className="object-cover rounded-xl" />
                    ) : (
                      project.title[0]
                    )}
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                  {project.industry}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-6 leading-relaxed">{project.tagline}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm">
                  <span className="text-muted-foreground block text-xs mb-0.5">Goal</span>
                  <span className="text-foreground font-medium">${project.fundingGoal.toLocaleString()}</span>
                </div>
                <div className="text-sm text-right">
                  <span className="text-muted-foreground block text-xs mb-0.5">Equity</span>
                  <span className="text-foreground font-medium">{project.equityOffered}%</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
