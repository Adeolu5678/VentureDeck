'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Flag, BarChart3, Settings, ExternalLink, Users, Briefcase, DollarSign, Target, Search, UserX, Ban } from 'lucide-react';
import { Id } from '@convex/_generated/dataModel';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { logError } from '@/lib/errorTracking';

interface CertificationWithUser {
  _id: Id<"certifications">;
  userId: Id<"users">;
  title: string;
  imageUrl: string;
  status: "pending" | "verified" | "rejected";
  createdAt: number;
  user: {
    _id: Id<"users">;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    email: string;
  } | null;
}

export default function AdminDashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const convexUser = useQuery(api.users.getCurrentUser);
  const pendingCertifications = useQuery(api.certifications.listPendingWithUsers) as CertificationWithUser[] | undefined;
  const featureFlags = useQuery(api.featureFlags.list);
  const verifyCertification = useMutation(api.certifications.verify);
  const rejectCertification = useMutation(api.certifications.reject);
  const updateFeatureFlag = useMutation(api.featureFlags.update);
  const platformStats = useQuery(api.admin_analytics.getPlatformOverview);
  
  const [activeTab, setActiveTab] = useState<'certifications' | 'flags' | 'analytics' | 'users' | 'projects'>('certifications');
  const [userSearch, setUserSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !convexUser) return null;

  if (!convexUser.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const handleVerify = async (id: Id<"certifications">) => {
    try {
      await verifyCertification({ id });
    } catch (error) {
      logError(error, { component: 'AdminDashboardPage', action: 'verifyCertification' });
    }
  };

  const handleReject = async (id: Id<"certifications">) => {
    try {
      await rejectCertification({ id });
    } catch (error) {
      logError(error, { component: 'AdminDashboardPage', action: 'rejectCertification' });
    }
  };

  const handleToggleFlag = async (id: Id<"featureFlags">, currentEnabled: boolean) => {
    try {
      await updateFeatureFlag({ id, enabled: !currentEnabled });
    } catch (error) {
      logError(error, { component: 'AdminDashboardPage', action: 'toggleFeatureFlag' });
    }
  };

  const tabs = [
    { id: 'certifications', label: 'Certifications', icon: AlertTriangle, count: pendingCertifications?.length || 0 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'flags', label: 'Feature Flags', icon: Flag, count: featureFlags?.length || 0 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen text-foreground p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        <PageHeader 
          title="Admin Dashboard" 
          description="Manage certifications, feature flags, and platform health."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Admin" }
          ]}
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-primary/20 text-primary'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Pending Certifications
            </h2>

            {!pendingCertifications || pendingCertifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No pending certifications to review.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingCertifications.map((cert) => (
                  <div key={cert._id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="w-16 h-16 bg-slate-800 rounded-lg relative overflow-hidden shrink-0">
                      {cert.imageUrl ? (
                        <Image
                          src={cert.imageUrl}
                          alt={cert.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                          IMG
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{cert.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Submitted by:</span>
                        {cert.user ? (
                          <Link 
                            href={`/users/${cert.user._id}`}
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            {cert.user.avatarUrl && (
                              <Image
                                src={cert.user.avatarUrl}
                                alt={cert.user.username}
                                width={20}
                                height={20}
                                className="rounded-full"
                              />
                            )}
                            <span className="font-medium">{cert.user.displayName || cert.user.username}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span>Unknown User</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Submitted on: {new Date(cert.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                      <button
                        onClick={() => handleVerify(cert._id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Verify
                      </button>
                      <button
                        onClick={() => handleReject(cert._id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Feature Flags Tab */}
        {activeTab === 'flags' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Flag className="w-5 h-5 text-primary" />
              Feature Flags
            </h2>

            {!featureFlags || featureFlags.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No feature flags configured.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {featureFlags.map((flag) => (
                  <div key={flag._id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div>
                      <h3 className="font-medium text-white">{flag.name}</h3>
                      {flag.description && (
                        <p className="text-sm text-slate-400">{flag.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleFlag(flag._id, flag.enabled)}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        flag.enabled ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                        flag.enabled ? 'translate-x-8' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Platform Analytics
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                <Users className="w-6 h-6 text-primary mb-2" />
                <div className="text-3xl font-bold text-primary mb-1">{platformStats?.users.total ?? '--'}</div>
                <div className="text-sm text-slate-400">Total Users</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {platformStats?.users.entrepreneurs ?? 0} entrepreneurs • {platformStats?.users.investors ?? 0} investors
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl">
                <Briefcase className="w-6 h-6 text-emerald-400 mb-2" />
                <div className="text-3xl font-bold text-emerald-400 mb-1">{platformStats?.projects.total ?? '--'}</div>
                <div className="text-sm text-slate-400">Projects</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {platformStats?.projects.published ?? 0} published
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-amber-400 mb-2" />
                <div className="text-3xl font-bold text-amber-400 mb-1">
                  ${(platformStats?.commitments.amount ?? 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-400">Total Commitments</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {platformStats?.commitments.total ?? 0} soft circles
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl">
                <Target className="w-6 h-6 text-blue-400 mb-2" />
                <div className="text-3xl font-bold text-blue-400 mb-1">{platformStats?.bounties.total ?? '--'}</div>
                <div className="text-sm text-slate-400">Bounties</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {platformStats?.bounties.completed ?? 0} completed
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                <div className="text-2xl font-bold text-pink-400">{platformStats?.followers ?? '--'}</div>
                <div className="text-xs text-slate-400">Project Follows</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                <div className="text-2xl font-bold text-purple-400">{platformStats?.milestones.total ?? '--'}</div>
                <div className="text-xs text-slate-400">Milestones ({platformStats?.milestones.completed ?? 0} complete)</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
                <div className="text-2xl font-bold text-orange-400">{platformStats?.vouches ?? '--'}</div>
                <div className="text-xs text-slate-400">Vouches Given</div>
              </div>
            </div>
            
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <p className="text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Analytics are now live! Data refreshes in real-time.
              </p>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              User Management
            </h2>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users by username or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
              />
            </div>

            {/* Coming Soon Notice */}
            <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
              <UserX className="w-12 h-12 mx-auto mb-4 text-amber-400 opacity-50" />
              <h3 className="font-bold text-amber-400 mb-2">User Management Coming Soon</h3>
              <p className="text-sm text-slate-400">
                Full user management with suspension, role changes, and activity tracking will be available soon.
              </p>
            </div>
          </motion.div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              Project Moderation
            </h2>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
              />
            </div>

            {/* Coming Soon Notice */}
            <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
              <Ban className="w-12 h-12 mx-auto mb-4 text-amber-400 opacity-50" />
              <h3 className="font-bold text-amber-400 mb-2">Project Moderation Coming Soon</h3>
              <p className="text-sm text-slate-400">
                Review flagged projects, change status, and manage content moderation from here.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
