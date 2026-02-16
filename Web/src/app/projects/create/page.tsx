'use client';

import { useState, useEffect, useCallback } from 'react';
import { useMutation, useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useRouter } from 'next/navigation';
import { Upload, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { useBottomNav } from '@/context/BottomNavContext';
import { logError } from '@/lib/errorTracking';

export default function CreateProjectPage() {
  const router = useRouter();
  const createProject = useMutation(api.projects.create);
  const generateUploadUrl = useAction(api.fileStorage.generateUploadUrl);
  const { setActions } = useBottomNav();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    industry: '',
    description: '',
    fundingGoal: '',
    equityOffered: '',
    logoUrl: '',
    pitchDeckUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'pitchDeckUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { uploadUrl } = await generateUploadUrl({ 
        filename: file.name, 
        mimeType: file.type, 
        sizeBytes: file.size 
      });
      
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      const { storageId } = await result.json();
      
      // 3. Save storageId
      setFormData((prev) => ({ ...prev, [field]: storageId }));
} catch (error) {
      logError(error, { component: 'CreateProjectPage', action: 'fileUpload', metadata: { field } });
      toast.error("Upload failed. Please try again.");
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const projectId = await createProject({
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        industry: formData.industry,
        fundingGoal: Number(formData.fundingGoal),
        equityOffered: Number(formData.equityOffered),
        logoUrl: formData.logoUrl,
        pitchDeckUrl: formData.pitchDeckUrl,
      });
      
      router.push(`/projects/${projectId}`);
} catch (error) {
      logError(error, { component: 'CreateProjectPage', action: 'createProject' });
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [createProject, formData, router]);



  useEffect(() => {
    let action = null;
    if (step < 4) {
      action = (
        <PremiumButton
          onClick={() => setStep(s => s + 1)}
          variant="primary"
          className="flex-1 rounded-full"
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          Next
        </PremiumButton>
      );
    } else {
      action = (
        <PremiumButton
          onClick={handleSubmit}
          disabled={isSubmitting}
          variant="primary"
          className="flex-1 rounded-full"
          rightIcon={<Check className="w-4 h-4" />}
        >
          {isSubmitting ? 'Publishing...' : 'Publish'}
        </PremiumButton>
      );
    }
    setActions(action);
    return () => setActions(null);
  }, [step, isSubmitting, setActions, handleSubmit]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Forge Your Project
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Step {step} of 4
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>

        <div className="bg-muted shadow-xl border border-border">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-white">Essentials</h3>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Project Name</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-muted border border-border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-muted border border-border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="The Uber for X"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Industry</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-muted border border-border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
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
                        <span>Upload a file</span>
                        <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={(e) => handleFileUpload(e, 'logoUrl')} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    {formData.logoUrl && <p className="text-emerald-500 text-xs mt-2">Logo uploaded!</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-white">The Pitch</h3>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Description (Problem & Solution)</label>
                <textarea
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-muted border border-border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Describe the problem you are solving and your unique solution..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Pitch Deck (PDF)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="flex text-sm text-muted-foreground">
                      <label htmlFor="deck-upload" className="relative cursor-pointer bg-muted text-primary hover:text-primary/80 focus-within:outline-none">
                        <span>Upload a PDF</span>
                        <input id="deck-upload" name="deck-upload" type="file" accept=".pdf" className="sr-only" onChange={(e) => handleFileUpload(e, 'pitchDeckUrl')} />
                      </label>
                    </div>
                    {formData.pitchDeckUrl && <p className="text-emerald-500 text-xs mt-2">Deck uploaded!</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-white">The Ask</h3>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Funding Goal ($)</label>
                <input
                  type="number"
                  name="fundingGoal"
                  value={formData.fundingGoal}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-muted border border-border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="1000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Equity Offered (%)</label>
                <input
                  type="number"
                  name="equityOffered"
                  value={formData.equityOffered}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-muted border border-border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="10"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-white">Review & Publish</h3>
              
              <div className="bg-muted rounded-md p-4 space-y-2">
                <p><span className="text-muted-foreground">Project:</span> {formData.title}</p>
                <p><span className="text-muted-foreground">Tagline:</span> {formData.tagline}</p>
                <p><span className="text-muted-foreground">Industry:</span> {formData.industry}</p>
                <p><span className="text-muted-foreground">Goal:</span> ${formData.fundingGoal} for {formData.equityOffered}%</p>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-md p-4">
                <p className="text-sm text-primary">
                  Publishing this project will automatically create a <strong>Workspace</strong> where you can invite your team and chat with investors.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center px-4 py-2 border border-slate-600 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Project'} <Check className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
