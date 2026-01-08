'use client';

import { useState, useEffect } from 'react';
import { useMutation, useAction, useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useRouter, useParams } from 'next/navigation';
import { Upload, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Id } from '@convex/_generated/dataModel';
import Link from 'next/link';
import { toast } from 'sonner';
import { useBottomNav } from '@/context/BottomNavContext';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as Id<'projects'>;

  const project = useQuery(api.projects.get, { id: projectId });
  const updateProject = useMutation(api.projects.update);

  const generateUploadUrl = useAction(api.fileStorage.generateUploadUrl);
  const { setActions } = useBottomNav();

  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    industry: '',
    description: '',
    fundingGoal: '',
    equityOffered: '',
    logoUrl: '',
    pitchDeckUrl: '',
    status: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        tagline: project.tagline,
        industry: project.industry,
        description: project.description,
        fundingGoal: project.fundingGoal.toString(),
        equityOffered: project.equityOffered.toString(),
        logoUrl: project.logoUrl || '',
        pitchDeckUrl: project.pitchDeckUrl || '',
        status: project.status,
      });
      setIsLoading(false);
    }

  }, [project]);

  useEffect(() => {
    setActions(
      <PremiumButton
        type="submit"
        form="edit-project-form"
        disabled={isSubmitting}
        variant="primary"
        className="flex-1 rounded-full"
        leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      >
        Save Changes
      </PremiumButton>
    );
    return () => setActions(null);
  }, [isSubmitting, setActions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'pitchDeckUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Get upload URL
      const postUrl = await generateUploadUrl();
      
      // 2. Upload file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      const { storageId } = await result.json();
      
      // 3. Save storageId
      setFormData((prev) => ({ ...prev, [field]: storageId }));
      toast.success(`${field === 'logoUrl' ? 'Logo' : 'Pitch Deck'} uploaded successfully`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProject({
        id: projectId,
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        industry: formData.industry,
        fundingGoal: Number(formData.fundingGoal),
        equityOffered: Number(formData.equityOffered),
        logoUrl: formData.logoUrl,
        pitchDeckUrl: formData.pitchDeckUrl,
        status: formData.status as "draft" | "published" | "funded" | "closed",
      });
      
      toast.success('Project updated successfully');
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error("Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/projects/${projectId}`} className="text-sm text-muted-foreground hover:text-foreground mb-2 block flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Project
            </Link>
            <h2 className="text-3xl font-extrabold text-foreground">
              Edit Project
            </h2>
          </div>
        </div>

        <form id="edit-project-form" onSubmit={handleSubmit} className="bg-muted shadow-xl border border-border space-y-8">
          
          {/* Essentials Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-foreground border-border pb-2">Essentials</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Project Name</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-background border border-input text-foreground focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-background border border-input text-foreground focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Industry</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-background border border-input text-foreground focus:ring-primary focus:border-primary sm:text-sm"
                  required
                >
                  <option value="">Select an industry</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Health">Health</option>
                  <option value="AI">AI</option>
                  <option value="Consumer">Consumer</option>
                  <option value="B2B">B2B</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Logo</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="flex text-sm text-muted-foreground">
                      <label htmlFor="logo-upload" className="relative cursor-pointer bg-muted text-primary hover:text-primary/80 focus-within:outline-none">
                        <span>Upload a new file</span>
                        <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={(e) => handleFileUpload(e, 'logoUrl')} />
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    {formData.logoUrl && <p className="text-green-500 text-xs mt-2">Current logo set</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pitch Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-foreground border-border pb-2">The Pitch</h3>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Description (Problem & Solution)</label>
              <textarea
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full bg-background border border-input text-foreground focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">Pitch Deck (PDF)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="flex text-sm text-muted-foreground">
                    <label htmlFor="deck-upload" className="relative cursor-pointer bg-muted text-primary hover:text-primary/80 focus-within:outline-none">
                      <span>Upload a new PDF</span>
                      <input id="deck-upload" name="deck-upload" type="file" accept=".pdf" className="sr-only" onChange={(e) => handleFileUpload(e, 'pitchDeckUrl')} />
                    </label>
                  </div>
                  {formData.pitchDeckUrl && <p className="text-green-500 text-xs mt-2">Current deck set</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Ask Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-foreground border-border pb-2">The Ask</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Funding Goal ($)</label>
                <input
                  type="number"
                  name="fundingGoal"
                  value={formData.fundingGoal}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-background border border-input text-foreground focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Equity Offered (%)</label>
                <input
                  type="number"
                  name="equityOffered"
                  value={formData.equityOffered}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-background border border-input text-foreground focus:ring-primary focus:border-primary sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-6 pt-6 border-t border-destructive/30">
            <h3 className="text-xl font-medium text-destructive">Danger Zone</h3>
            
            <div className="bg-red-950/20 border border-destructive/30 rounded-lg p-4">
              <label className="block text-sm font-medium text-destructive/80 mb-2">Project Status</label>
              <p className="text-xs text-destructive/70 mb-4">
                Changing the status to &quot;Closed&quot; will hide the project from the discovery feed.
                &quot;Funded&quot; indicates you have reached your goal.
              </p>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full bg-background border border-destructive/50 text-foreground focus:ring-destructive focus:border-destructive sm:text-sm"
              >
                <option value="published">Published (Active)</option>
                <option value="funded">Funded</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-4">
            <Link
              href={`/projects/${projectId}`}
              className="px-4 py-2 border border-slate-600 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-foreground hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
