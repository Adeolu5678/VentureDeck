'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { UserButton } from '@clerk/nextjs';
import { useState, useEffect, useCallback } from 'react';
import { Toggle } from '@/components/ui/Toggle';
import { User, Bell, Shield, Briefcase, Sparkles, Save, Loader2, TrendingUp } from 'lucide-react';
import { useBottomNav } from '@/context/BottomNavContext';
import { PremiumButton } from '@/components/ui/PremiumButton';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';

interface SettingsUser {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  professionalBio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  skills?: string[];
  interests?: string[];
  notificationPreferences?: { email: boolean; push: boolean };
  privacySettings?: { profileVisibility: "public" | "private" };
  avatarStorageId?: string;
  avatarUrl?: string;
  isAdmin?: boolean;
  role?: 'entrepreneur' | 'investor';
  _id: string;
}

export default function SettingsPage() {
  const user = useQuery(api.users.getCurrentUser) as SettingsUser | undefined;
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const updateInvestorThesis = useMutation(api.users.updateInvestorThesis);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'privacy' | 'investment'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    displayName: '',
    firstName: '',
    lastName: '',
    email: '',
    professionalBio: '',
    linkedinUrl: '',
    githubUrl: '',
    skills: '',
    interests: '',
  });

  const [notifications, setNotifications] = useState({ email: true, push: true });
  const [privacy, setPrivacy] = useState<{ profileVisibility: 'public' | 'private' }>({ profileVisibility: 'public' });
  
  // Investor thesis state
  const [investmentRange, setInvestmentRange] = useState({ min: 10000, max: 500000 });
  const [investorThesis, setInvestorThesis] = useState({
    preferredIndustries: [] as string[],
    preferredStages: [] as string[],
    thesisDescription: '',
    geographicPreference: '',
    minTractionScore: 0,
  });
  
  const { setActions } = useBottomNav();

  // Define handleSave before the useEffect that uses it
  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      await createOrUpdateUser({
        username: user.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: formData.displayName,
        professionalBio: formData.professionalBio,
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
        notificationPreferences: notifications,
        privacySettings: privacy,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  }, [user, formData, notifications, privacy, createOrUpdateUser]);

  // Set bottom nav action
  useEffect(() => {
    if (activeTab === 'profile') {
      setActions(
        <PremiumButton
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            handleSave(e as unknown as React.FormEvent);
          }}
          disabled={isSaving}
          variant="primary"
          className="flex-1 rounded-full"
          leftIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        >
          Save Changes
        </PremiumButton>
      );
    } else {
      setActions(null);
    }
    return () => setActions(null);
  }, [activeTab, isSaving, setActions, handleSave]);

  // Load initial data
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        professionalBio: user.professionalBio || '',
        linkedinUrl: user.linkedinUrl || '',
        githubUrl: user.githubUrl || '',
        skills: user.skills?.join(', ') || '',
        interests: user.interests?.join(', ') || '',
      });
      setNotifications(user.notificationPreferences || { email: true, push: true });
      setPrivacy(user.privacySettings || { profileVisibility: 'public' });
      if (user.avatarUrl) {
        setPreviewUrl(user.avatarUrl);
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      await createOrUpdateUser({
          username: user.username,
          email: user.email,
          avatarStorageId: storageId,
      });
      toast.success('Profile picture updated');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image');
    }
  };



  const baseTabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'account' as const, label: 'Account', icon: Bell },
    { id: 'privacy' as const, label: 'Privacy', icon: Shield },
  ];
  
  const investorTab = { id: 'investment' as const, label: 'Investment', icon: TrendingUp };
  
  const tabs = user?.role === 'investor' 
    ? [baseTabs[0], investorTab, ...baseTabs.slice(1)]
    : baseTabs;

  if (!user) return null;

  return (
    <div className="min-h-screen text-white p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <PageHeader 
          title="Settings" 
          description="Manage your profile and preferences"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Settings" }
          ]}
        />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="w-full md:w-64 flex-shrink-0 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Basic Info */}
                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Briefcase size={20} className="text-primary" />
                    Professional Info
                  </h2>
                  
                  <div className="flex items-start gap-6 mb-8">
                    <div className="relative group">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
                        {previewUrl ? (
                          <Image src={previewUrl} alt="Profile" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <User size={32} />
                          </div>
                        )}
                      </div>
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                        <span className="text-xs font-medium text-white">Change</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{user.firstName} {user.lastName}</h3>
                      <p className="text-sm text-slate-400 mb-2">@{user.username}</p>
                      <p className="text-xs text-slate-500">Max file size: 5MB. Supported formats: JPG, PNG.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        placeholder="How you want to appear"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={user.username}
                        disabled
                        className="bg-slate-900/50 text-slate-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="professionalBio">Professional Bio</Label>
                      <Textarea
                        id="professionalBio"
                        name="professionalBio"
                        value={formData.professionalBio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                      <Input
                        id="linkedinUrl"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="githubUrl">GitHub URL</Label>
                      <Input
                        id="githubUrl"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleChange}
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                </section>

                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-amber-400" />
                    Skills & Interests
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                     <div className="space-y-2">
                      <Label htmlFor="skills">Skills (comma separated)</Label>
                      <Input
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="React, Node.js, Design..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interests">Interests (comma separated)</Label>
                      <Input
                        id="interests"
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        placeholder="AI, Blockchain, SaaS..."
                      />
                    </div>
                  </div>
                </section>

                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold mb-4">Notifications</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-200">Email Notifications</p>
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-full border border-amber-500/20">
                            COMING SOON
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">Receive updates via email (coming soon)</p>
                      </div>
                      <Toggle
                        checked={notifications.email}
                        onCheckedChange={(c) => setNotifications(prev => ({ ...prev, email: c }))}
                        disabled
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-200">Push Notifications</p>
                        <p className="text-sm text-slate-500">Receive updates in-browser</p>
                      </div>
                      <Toggle
                        checked={notifications.push}
                        onCheckedChange={(c) => setNotifications(prev => ({ ...prev, push: c }))}
                      />
                    </div>
                  </div>
                </section>
                
                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold mb-4">Account Management</h2>
                  <div className="space-y-6">
                    <div>
                      <p className="font-medium text-slate-200">Clerk Profile</p>
                      <p className="text-sm text-slate-500 mb-4">Manage email, password, and security settings via Clerk.</p>
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-200">Profile Visibility</p>
                      <p className="text-sm text-slate-500">
                        {privacy.profileVisibility === 'public' 
                          ? 'Your profile is visible to everyone' 
                          : 'Your profile is only visible to connections'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-950 p-1 rounded-lg border border-slate-800">
                      <button
                        onClick={() => setPrivacy({ profileVisibility: 'public' })}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                          privacy.profileVisibility === 'public'
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Public
                      </button>
                      <button
                        onClick={() => setPrivacy({ profileVisibility: 'private' })}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                          privacy.profileVisibility === 'private'
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Private
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'investment' && user?.role === 'investor' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary" />
                    Investment Thesis
                  </h2>
                  <p className="text-sm text-slate-400 mb-6">
                    Configure your investment preferences to receive better-matched deal flow recommendations.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Investment Range */}
                    <div className="space-y-2">
                      <Label>Minimum Investment ($)</Label>
                      <Input
                        type="number"
                        value={investmentRange.min}
                        onChange={(e) => setInvestmentRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        placeholder="10,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Maximum Investment ($)</Label>
                      <Input
                        type="number"
                        value={investmentRange.max}
                        onChange={(e) => setInvestmentRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        placeholder="500,000"
                      />
                    </div>

                    {/* Preferred Industries */}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Preferred Industries (comma separated)</Label>
                      <Input
                        value={investorThesis.preferredIndustries.join(', ')}
                        onChange={(e) => setInvestorThesis(prev => ({ 
                          ...prev, 
                          preferredIndustries: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }))}
                        placeholder="FinTech, AI/ML, SaaS, Healthcare..."
                      />
                    </div>

                    {/* Preferred Stages */}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Preferred Stages (comma separated)</Label>
                      <Input
                        value={investorThesis.preferredStages.join(', ')}
                        onChange={(e) => setInvestorThesis(prev => ({ 
                          ...prev, 
                          preferredStages: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        }))}
                        placeholder="Pre-Seed, Seed, Series A..."
                      />
                    </div>

                    {/* Geographic Preference */}
                    <div className="space-y-2">
                      <Label>Geographic Preference</Label>
                      <Input
                        value={investorThesis.geographicPreference}
                        onChange={(e) => setInvestorThesis(prev => ({ ...prev, geographicPreference: e.target.value }))}
                        placeholder="US, Europe, Global..."
                      />
                    </div>

                    {/* Min Traction Score */}
                    <div className="space-y-2">
                      <Label>Minimum Traction Score (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={investorThesis.minTractionScore}
                        onChange={(e) => setInvestorThesis(prev => ({ ...prev, minTractionScore: Number(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>

                    {/* Thesis Description */}
                    <div className="space-y-2 md:col-span-2">
                      <Label>Investment Thesis Description</Label>
                      <Textarea
                        value={investorThesis.thesisDescription}
                        onChange={(e) => setInvestorThesis(prev => ({ ...prev, thesisDescription: e.target.value }))}
                        rows={4}
                        placeholder="Describe what you look for in investments, your focus areas, and what makes a great opportunity for you..."
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6">
                    <PremiumButton
                      onClick={async () => {
                        setIsSaving(true);
                        try {
                          await updateInvestorThesis({
                            investmentRange,
                            investorThesis,
                          });
                          toast.success('Investment thesis updated!');
                        } catch {
                          toast.error('Failed to update thesis');
                        } finally {
                          setIsSaving(false);
                        }
                      }}
                      disabled={isSaving}
                      variant="primary"
                      leftIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    >
                      {isSaving ? 'Saving...' : 'Save Investment Preferences'}
                    </PremiumButton>
                  </div>
                </section>

                {/* Info Box */}
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
                  <p className="text-sm text-slate-300">
                    <strong className="text-primary">💡 Pro Tip:</strong> The more details you provide, the better our AI can match you with relevant deals. Projects that match your thesis will appear higher in your Deal Flow feed.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
