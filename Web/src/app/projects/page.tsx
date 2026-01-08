'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { Search, TrendingUp, Plus, X, Sparkles, ArrowRight, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Doc } from '@convex/_generated/dataModel';
import Image from 'next/image';
import { useBottomNav } from '@/context/BottomNavContext';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PageHeader } from '@/components/ui/PageHeader';

const INDUSTRIES = [
  'All Industries',
  'FinTech',
  'AI/ML',
  'SaaS',
  'Healthcare',
  'E-commerce',
  'EdTech',
  'Climate',
  'Consumer',
  'Enterprise',
  'Other'
];

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string | undefined>(undefined);
  const { setActions } = useBottomNav();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const projectsData = useQuery(api.projects.list, { 
    search: debouncedSearch || undefined,
    industry: selectedIndustry,
    limit: 50 
  });
  const projects = projectsData?.projects || [];

  // Set bottom nav actions - context aligned with browsing/discovery
  useEffect(() => {
    setActions(
      <div className="flex items-center gap-2 flex-1">
        <PremiumButton
          onClick={() => {
            // Scroll to search area and focus the input
            document.getElementById('project-search')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              (document.getElementById('project-search') as HTMLInputElement)?.focus();
            }, 300);
          }}
          variant="glass"
          className="rounded-full"
          leftIcon={<SlidersHorizontal className="w-4 h-4" />}
        >
          Search & Filter
        </PremiumButton>
        <Link href="/projects/create" className="flex-1">
          <PremiumButton variant="primary" className="w-full rounded-full" leftIcon={<Plus className="w-4 h-4" />}>
            New Project
          </PremiumButton>
        </Link>
      </div>
    );
    return () => setActions(null);
  }, [setActions]);

  return (
    <div className="min-h-screen text-foreground pb-24">
      <div className="relative pt-12 px-6 max-w-7xl mx-auto">
        <PageHeader 
          title="Discover Projects" 
          description="Find the next big thing. Browse startups looking for investment."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Projects" }
          ]}
        />

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            id="project-search"
            type="text" 
            placeholder="Search by title, tagline, or industry..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Industry Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {INDUSTRIES.map((industry) => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry === 'All Industries' ? undefined : industry)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                (industry === 'All Industries' && !selectedIndustry) || selectedIndustry === industry
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {projectsData?.total !== undefined ? (
                <>{projectsData.total} project{projectsData.total !== 1 ? 's' : ''} found</>
              ) : (
                'Loading...'
              )}
            </span>
          </div>
          {(debouncedSearch || selectedIndustry) && (
            <button 
              onClick={() => { setSearchTerm(''); setSelectedIndustry(undefined); }}
              className="text-sm text-primary hover:text-indigo-300 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>

        {/* Project List */}
        {projects.length === 0 ? (
          <div className="p-16 border border-dashed border-white/10 rounded-3xl text-center bg-white/5 backdrop-blur-sm">
            {debouncedSearch || selectedIndustry ? (
              <>
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-6">
                  No projects match your current filters. Try adjusting your search or browse all projects.
                </p>
                <PremiumButton onClick={() => { setSearchTerm(''); setSelectedIndustry(undefined); }}>
                  Clear Filters
                </PremiumButton>
              </>
            ) : (
              <>
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6">Be the first to launch a project!</p>
                <Link href="/projects/create">
                  <PremiumButton rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Create Project
                  </PremiumButton>
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: Doc<'projects'>) => (
              <Link key={project._id} href={`/projects/${project._id}`}>
                <PremiumCard glow className="h-full hover:border-primary/50 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center text-2xl font-bold text-primary border border-primary/20 overflow-hidden relative">
                      {project.logoUrl ? (
                        <Image src={project.logoUrl} alt={project.title} fill sizes="56px" className="object-cover" />
                      ) : (
                        project.title[0]
                      )}
                    </div>
                    <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {project.industry}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {project.tagline}
                  </p>
                  
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
