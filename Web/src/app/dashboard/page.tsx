'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, TrendingUp, Users, ArrowRight, Sparkles, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import MatchmakingWidget from '@/components/MatchmakingWidget';
import { useBottomNav } from '@/context/BottomNavContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const convexUser = useQuery(api.users.getCurrentUser);
  const createUser = useMutation(api.users.createOrUpdateUser);

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
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (convexUser === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold mb-2">Setting up your account...</h2>
          <p className="text-muted-foreground mb-4">Please wait while we prepare your workspace.</p>
          
          <button 
            onClick={async () => {
              try {
                await createUser({
                  username: user.username || user.firstName || 'User',
                  email: user.emailAddresses[0]?.emailAddress || '',
                  firstName: user.firstName || undefined,
                  lastName: user.lastName || undefined,
                  avatarUrl: user.imageUrl,
                });
                window.location.reload(); 
              } catch (err) {
                console.error("Manual sync failed", err);
              }
            }}
            className="text-sm text-primary hover:underline"
          >
            Taking too long? Click here to sync manually.
          </button>
        </div>
      </div>
    );
  }

  if (!convexUser.role) {
    return <RoleSelection />;
  }

  const isEntrepreneur = convexUser.role === 'entrepreneur';

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <div className="relative pt-12 px-6 max-w-7xl mx-auto">
        <PageHeader 
          title={`Welcome back, ${convexUser.firstName || convexUser.username}`}
          description={isEntrepreneur 
            ? "Your venture awaits. What will you build today?" 
            : "Discover the next generation of unicorns."
          }
          breadcrumbs={[
             { label: "Dashboard" }
          ]}
        />

        {isEntrepreneur ? <EntrepreneurDashboard /> : <InvestorDashboard />}
      </div>
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
    } catch (error) {
      console.error("Failed to set role:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-xl w-full">
        <PremiumCard className="text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">Choose Your Path</h2>
          <p className="text-muted-foreground mb-10 text-lg">
            VentureDeck is a dual-sided marketplace. <br/> How will you participate?
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <PremiumButton 
               variant="glass" 
               className="h-auto p-6 flex flex-col items-start gap-4 hover:border-primary/50"
               onClick={() => handleRoleSelect('entrepreneur')}
               disabled={isSubmitting}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg text-white mb-1">Entrepreneur</h3>
                <p className="text-xs text-muted-foreground">Raise capital & build startup.</p>
              </div>
            </PremiumButton>
            
            <PremiumButton 
               variant="glass" 
               className="h-auto p-6 flex flex-col items-start gap-4 hover:border-accent/50"
               onClick={() => handleRoleSelect('investor')}
               disabled={isSubmitting}
            >
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg text-white mb-1">Investor</h3>
                <p className="text-xs text-muted-foreground">Find & fund unicorns.</p>
              </div>
            </PremiumButton>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function EntrepreneurDashboard() {
  const myProjects = useQuery(api.projects.getMyProjects) || [];
  const { setActions } = useBottomNav();

  useEffect(() => {
    setActions(
      <Link href="/projects/create" className="flex-1">
        <PremiumButton variant="primary" className="w-full rounded-full" leftIcon={<Plus className="w-4 h-4" />}>
          New Project
        </PremiumButton>
      </Link>
    );
    return () => setActions(null);
  }, [setActions]);

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            My Projects
          </h2>
          <Link href="/projects/create">
            <PremiumButton variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              New Project
            </PremiumButton>
          </Link>
        </div>

        {myProjects.length === 0 ? (
          <div className="p-16 border border-dashed border-white/10 rounded-3xl text-center bg-white/5 backdrop-blur-sm">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Your journey begins here. Create your first project to start tracking milestones and attracting investors.
            </p>
            <Link href="/projects/create">
              <PremiumButton rightIcon={<ArrowRight className="w-5 h-5" />}>
                Create Project
              </PremiumButton>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProjects.map((project, index) => (
              <Link key={project._id} href={`/projects/${project._id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PremiumCard glow className="h-full hover:border-primary/50">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center text-2xl font-bold text-primary border border-primary/20 overflow-hidden relative">
                        {project.logoUrl ? (
                          <Image src={project.logoUrl} alt="" fill className="object-cover" />
                        ) : (
                          project.title[0]
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                        project.status === 'published' 
                          ? 'bg-accent/10 text-accent border-accent/20' 
                          : 'bg-white/5 text-slate-400 border-white/10'
                      }`}>
                        {project.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{project.tagline}</p>
                  </PremiumCard>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <JoinedProjectsSection />
    </div>
  );
}

function JoinedProjectsSection() {
  const joinedProjects = useQuery(api.projects.getProjectsIAmMemberOf) || [];

  if (joinedProjects.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-white">
        <Users className="w-6 h-6 text-accent" />
        Workspaces I&apos;m a Part of
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {joinedProjects.map((project, index) => (
          <Link key={project._id} href={`/workspaces/${project.workspaceId}`}>
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
            >
              <PremiumCard glow className="h-full hover:border-accent/50">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center text-2xl font-bold text-accent border border-accent/20 overflow-hidden relative">
                    {project.logoUrl ? (
                      <Image src={project.logoUrl} alt="" fill className="object-cover" />
                    ) : (
                      project.title[0]
                    )}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-400 border border-white/10">
                    Member
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{project.tagline}</p>
              </PremiumCard>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function InvestorDashboard() {
  const projects = useQuery(api.projects.list, {}) || [];
  const { setActions } = useBottomNav();

  useEffect(() => {
    setActions(
      <button 
        onClick={() => (document.querySelector('input[placeholder="Search projects..."]') as HTMLInputElement)?.focus()}
        className="flex-1"
      >
        <PremiumButton variant="secondary" className="w-full rounded-full" leftIcon={<Search className="w-4 h-4" />}>
           Search
        </PremiumButton>
      </button>
    );
    return () => setActions(null);
  }, [setActions]);

  return (
    <div className="space-y-12">
      {/* AI Matchmaking Widget */}
      <MatchmakingWidget />

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Sparkles className="w-6 h-6 text-accent" />
            Discover
          </h2>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link key={project._id} href={`/projects/${project._id}`}>
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
              >
                <PremiumCard glow className="h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center text-2xl font-bold text-primary border border-primary/20 overflow-hidden relative">
                       {project.logoUrl ? (
                          <Image src={project.logoUrl} alt="" fill className="object-cover" />
                        ) : (
                          project.title[0]
                        )}
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {project.industry}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">{project.tagline}</p>
                  
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
                </PremiumCard>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
