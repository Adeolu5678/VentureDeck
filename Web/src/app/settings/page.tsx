'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { UserButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Toggle } from '@/components/ui/Toggle';
import { User, Bell, Shield, Briefcase, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';

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
  _id: string;
}

export default function SettingsPage() {
  const user = useQuery(api.users.getCurrentUser) as SettingsUser | undefined;
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'privacy'>('profile');
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
          clerkId: user.clerkId,
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      await createOrUpdateUser({
        clerkId: user.clerkId,
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
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ] as const;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Settings
          </h1>
          <p className="text-slate-400 mt-2">Manage your profile and preferences</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="w-full md:w-64 flex-shrink-0 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
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
                    <Briefcase size={20} className="text-indigo-400" />
                    Professional Info
                  </h2>
                  
                  <div className="flex items-start gap-6 mb-8">
                    <div className="relative group">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-800 ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/50 transition-all">
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
                        <p className="font-medium text-slate-200">Email Notifications</p>
                        <p className="text-sm text-slate-500">Receive updates via email</p>
                      </div>
                      <Toggle
                        checked={notifications.email}
                        onCheckedChange={(c) => setNotifications(prev => ({ ...prev, email: c }))}
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
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Public
                      </button>
                      <button
                        onClick={() => setPrivacy({ profileVisibility: 'private' })}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                          privacy.profileVisibility === 'private'
                            ? 'bg-indigo-600 text-white shadow-sm'
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
          </div>
        </div>
      </div>
    </div>
  );
}
