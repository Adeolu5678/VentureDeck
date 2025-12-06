'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Id } from '@convex/_generated/dataModel';
import { FileText, Plus, Download } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LegalPage() {
  const params = useParams();
  const workspaceId = params.id as Id<'workspaces'>;
  
  const workspace = useQuery(api.workspaces.get, { id: workspaceId });
  const project = useQuery(api.projects.get, workspace?.projectId ? { id: workspace.projectId } : "skip");
  const docs = useQuery(api.legal.getDocs, workspace?.projectId ? { projectId: workspace.projectId } : "skip");
  const createDoc = useMutation(api.legal.createDoc);
  const generateUploadUrl = useMutation(api.legal.generateUploadUrl);

  const [isDrafting, setIsDrafting] = useState(false);
  const [draftType, setDraftType] = useState<'SAFE' | 'NDA'>('SAFE');
  const [investorName, setInvestorName] = useState('');
  const [amount, setAmount] = useState('');
  const [equity, setEquity] = useState('');

  if (!workspace || !project) return <div className="p-8 text-white">Loading...</div>;

  const handleDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, this would generate a PDF via an API.
      // For now, we'll simulate creating a record.
      // We need a storageId, but since we are "drafting", maybe we don't have a file yet?
      // Or we upload a placeholder.
      // Let's just create a record with a placeholder storageId or handle it in backend.
      // The current schema requires storageId. 
      // I'll assume we upload a generated file. For MVP, I'll mock the upload.
      
      // Mocking a generated file upload
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: `Draft ${draftType} for ${investorName}\nAmount: $${amount}\nEquity: ${equity}%`,
      });
      const { storageId } = await result.json();

      await createDoc({
        projectId: project._id,
        type: draftType,
        storageId,
      });

      setIsDrafting(false);
      setInvestorName('');
      setAmount('');
      setEquity('');
      toast.success('Legal document drafted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to draft document');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href={`/workspaces/${workspaceId}`} className="text-sm text-slate-400 hover:text-white mb-2 block">
              &larr; Back to Workspace
            </Link>
            <h1 className="text-2xl font-bold">Legal Documents</h1>
            <p className="text-slate-400">Manage SAFEs, NDAs, and other agreements.</p>
          </div>
          <button 
            onClick={() => setIsDrafting(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Draft New Document
          </button>
        </div>

        {isDrafting && (
          <div className="glass-panel rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-lg font-bold mb-4">Draft Legal Document</h2>
            <form onSubmit={handleDraft} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Document Type</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setDraftType('SAFE')}
                    className={`flex-1 py-2 px-4 rounded-lg border ${draftType === 'SAFE' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                  >
                    SAFE
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftType('NDA')}
                    className={`flex-1 py-2 px-4 rounded-lg border ${draftType === 'NDA' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                  >
                    NDA
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Investor Name</label>
                <input 
                  type="text" 
                  value={investorName}
                  onChange={(e) => setInvestorName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              {draftType === 'SAFE' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Investment Amount ($)</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Equity / Cap (%)</label>
                    <input 
                      type="number" 
                      value={equity}
                      onChange={(e) => setEquity(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsDrafting(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium"
                >
                  Generate Draft
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {docs?.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 border border-slate-800 rounded-2xl">
              <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white">No documents yet</h3>
              <p className="text-slate-500">Draft a new document or upload one to get started.</p>
            </div>
          ) : (
            docs?.map((doc) => (
              <div key={doc._id} className="glass-panel p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <FileText className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{doc.type} Agreement</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Created {new Date(doc.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className={`capitalize ${
                        doc.status === 'signed' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>{doc.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.url && (
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
