'use client';

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { useBottomNav } from "@/context/BottomNavContext";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { Search, Users, Briefcase, TrendingUp, X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const ROLE_FILTERS = [
  { label: 'Everyone', value: undefined },
  { label: 'Entrepreneurs', value: 'entrepreneur' as const },
  { label: 'Investors', value: 'investor' as const },
];

export default function NetworkPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<'entrepreneur' | 'investor' | undefined>(undefined);
  const { setActions } = useBottomNav();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const usersData = useQuery(api.users.listAll, {
    search: debouncedSearch || undefined,
    role: selectedRole,
    limit: 50,
  });
  const users = usersData?.users || [];

  // Set bottom nav actions
  useEffect(() => {
    setActions(
      <div className="flex items-center gap-2 flex-1">
        <PremiumButton
          onClick={() => {
            document.getElementById('network-search')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              (document.getElementById('network-search') as HTMLInputElement)?.focus();
            }, 300);
          }}
          variant="glass"
          className="flex-1 rounded-full"
          leftIcon={<Search className="w-4 h-4" />}
        >
          Find People
        </PremiumButton>
      </div>
    );
    return () => setActions(null);
  }, [setActions]);

  return (
    <div className="min-h-screen text-foreground pb-24">
      <div className="relative pt-12 px-6 max-w-7xl mx-auto">
        <PageHeader 
          title="Network" 
          description="Discover entrepreneurs and investors. Build your professional network."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Network" }
          ]}
        />

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            id="network-search"
            type="text" 
            placeholder="Search by name or username..." 
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

        {/* Role Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {ROLE_FILTERS.map((filter) => (
            <button
              key={filter.label}
              onClick={() => setSelectedRole(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                selectedRole === filter.value
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {filter.value === 'entrepreneur' && <Briefcase className="w-4 h-4" />}
              {filter.value === 'investor' && <TrendingUp className="w-4 h-4" />}
              {!filter.value && <Users className="w-4 h-4" />}
              {filter.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {usersData?.total !== undefined ? (
                <>{usersData.total} {selectedRole || 'people'} found</>
              ) : (
                'Loading...'
              )}
            </span>
          </div>
          {(debouncedSearch || selectedRole) && (
            <button 
              onClick={() => { setSearchTerm(''); setSelectedRole(undefined); }}
              className="text-sm text-primary hover:text-indigo-300 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>

        {/* Users Grid */}
        {users.length === 0 ? (
          <div className="p-16 border border-dashed border-white/10 rounded-3xl text-center bg-white/5 backdrop-blur-sm">
            {debouncedSearch || selectedRole ? (
              <>
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No people found</h3>
                <p className="text-muted-foreground mb-6">
                  No users match your current filters. Try adjusting your search.
                </p>
                <PremiumButton onClick={() => { setSearchTerm(''); setSelectedRole(undefined); }}>
                  Clear Filters
                </PremiumButton>
              </>
            ) : (
              <>
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No users yet</h3>
                <p className="text-muted-foreground">Be the first to join the network!</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user, index) => (
              <Link key={user._id} href={`/users/${user._id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PremiumCard glow className="h-full hover:border-primary/50 group cursor-pointer">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl font-bold text-primary border border-primary/20 overflow-hidden relative shrink-0">
                        {user.avatarUrl ? (
                          <Image src={user.avatarUrl} alt={user.displayName} fill className="object-cover" />
                        ) : (
                          user.displayName?.[0]?.toUpperCase() || user.username[0].toUpperCase()
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-lg font-bold text-white truncate group-hover:text-primary transition-colors">
                            {user.displayName}
                          </h3>
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize shrink-0 ${
                            user.role === 'investor' 
                              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                              : 'text-primary bg-primary/10 border border-primary/20'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">@{user.username}</p>
                        
                        {user.professionalBio && (
                          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                            {user.professionalBio}
                          </p>
                        )}

                        {user.skills && user.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {user.skills.slice(0, 3).map((skill, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-slate-400">
                                {skill}
                              </span>
                            ))}
                            {user.skills.length > 3 && (
                              <span className="text-xs px-2 py-0.5 text-slate-500">
                                +{user.skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Profile Link */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-end">
                      <span className="text-sm text-primary group-hover:text-indigo-300 flex items-center gap-1 transition-colors">
                        View Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </PremiumCard>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
