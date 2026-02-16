'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import { useState, useRef } from 'react';
import { Id } from '@convex/_generated/dataModel';
import { FileText, Upload, CheckCircle, Clock, Download, Shield, Plus, Loader2, Sparkles, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { logError } from '@/lib/errorTracking';

interface LegalDoc {
  _id: Id<"legalDocs">;
  projectId: Id<"projects">;
  type: "SAFE" | "NDA";
  status: "draft" | "signed";
  storageId: string;
  createdAt: number;
  signedAt?: number;
  signerId?: Id<"users">;
  url?: string | null;
}

export default function LegalDocumentsPage() {
  const params = useParams();
  const projectId = params.id as Id<'projects'>;
  
  const user = useQuery(api.users.getCurrentUser);
  const project = useQuery(api.projects.get, { id: projectId });
  const docs = useQuery(api.legal.getDocs, { projectId }) as LegalDoc[] | undefined;
  
  const generateUploadUrl = useMutation(api.legal.generateUploadUrl);
  const createDoc = useMutation(api.legal.createDoc);
  const signDoc = useMutation(api.legal.signDoc);
  const deleteDoc = useMutation(api.legal.deleteDoc);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'SAFE' | 'NDA'>('SAFE');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateType, setTemplateType] = useState<'SAFE' | 'NDA'>('SAFE');
  
  // Template form fields
  const [investorName, setInvestorName] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('20');
  const [valuationCap, setValuationCap] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate template preview
  const generatedTemplate = useQuery(
    api.legal.generateTemplate,
    showTemplateModal ? {
      projectId,
      type: templateType,
      investorName: investorName || undefined,
      investmentAmount: investmentAmount || undefined,
      discountPercentage: discountPercentage ? Number(discountPercentage) : undefined,
      valuationCap: valuationCap || undefined,
    } : 'skip'
  );

  if (!project || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isOwner = user._id === project.ownerId;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      
      const { storageId } = await result.json();
      
      await createDoc({
        projectId,
        type: uploadType,
        storageId,
      });
      
      toast.success(`${uploadType} document uploaded successfully`);
      setShowUploadModal(false);
    } catch (error) {
      logError(error, { component: 'LegalDocumentsPage', action: 'uploadDocument' });
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSign = async (docId: Id<"legalDocs">) => {
    try {
      await signDoc({ docId });
      toast.success('Document signed successfully');
    } catch (error) {
      logError(error, { component: 'LegalDocumentsPage', action: 'signDocument' });
      toast.error('Failed to sign document');
    }
  };

  const handleDelete = async (docId: Id<"legalDocs">) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await deleteDoc({ docId });
      toast.success('Document deleted');
    } catch (error) {
      logError(error, { component: 'LegalDocumentsPage', action: 'deleteDocument' });
      toast.error('Failed to delete document');
    }
  };

  const handleGenerateDocument = async () => {
    if (!generatedTemplate) {
      toast.error('Template not ready');
      return;
    }
    
    // Create a blob from the generated text content
    const blob = new Blob([generatedTemplate.content], { type: 'text/plain' });
    
    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: blob,
      });
      
      const { storageId } = await result.json();
      
      await createDoc({
        projectId,
        type: templateType,
        storageId,
      });
      
      toast.success(`${templateType} document generated successfully`);
      setShowTemplateModal(false);
      resetTemplateForm();
    } catch (error) {
      logError(error, { component: 'LegalDocumentsPage', action: 'generateDocument' });
      toast.error('Failed to generate document');
    } finally {
      setIsUploading(false);
    }
  };

  const resetTemplateForm = () => {
    setInvestorName('');
    setInvestmentAmount('');
    setDiscountPercentage('20');
    setValuationCap('');
  };

  const docsByType = {
    SAFE: docs?.filter(d => d.type === 'SAFE') || [],
    NDA: docs?.filter(d => d.type === 'NDA') || [],
  };

  return (
    <div className="min-h-screen text-white p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href={`/projects/${projectId}`} className="text-sm text-slate-400 hover:text-white mb-2 block">
              &larr; Back to Project
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Shield className="w-7 h-7 text-primary" />
              Legal Documents
            </h1>
            <p className="text-slate-400 mt-1">Manage SAFE agreements and NDAs for {project.title}</p>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <PremiumButton
                onClick={() => setShowTemplateModal(true)}
                variant="secondary"
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                Generate from Template
              </PremiumButton>
              <PremiumButton
                onClick={() => setShowUploadModal(true)}
                variant="primary"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Upload Document
              </PremiumButton>
            </div>
          )}
        </div>

        {/* Document Sections */}
        <div className="space-y-8">
          {/* SAFE Agreements */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              SAFE Agreements
            </h2>
            {docsByType.SAFE.length === 0 ? (
              <div className="glass-panel rounded-xl p-8 text-center text-slate-400">
                No SAFE agreements uploaded yet.
                {isOwner && (
                  <div className="mt-4">
                    <PremiumButton
                      onClick={() => { setTemplateType('SAFE'); setShowTemplateModal(true); }}
                      variant="glass"
                      size="sm"
                      leftIcon={<Sparkles className="w-4 h-4" />}
                    >
                      Generate SAFE Template
                    </PremiumButton>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {docsByType.SAFE.map((doc, index) => (
                  <DocumentCard 
                    key={doc._id} 
                    doc={doc} 
                    index={index}
                    canSign={!isOwner && doc.status === 'draft'}
                    canDelete={isOwner}
                    onSign={() => handleSign(doc._id)}
                    onDelete={() => handleDelete(doc._id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* NDAs */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Non-Disclosure Agreements
            </h2>
            {docsByType.NDA.length === 0 ? (
              <div className="glass-panel rounded-xl p-8 text-center text-slate-400">
                No NDAs uploaded yet.
                {isOwner && (
                  <div className="mt-4">
                    <PremiumButton
                      onClick={() => { setTemplateType('NDA'); setShowTemplateModal(true); }}
                      variant="glass"
                      size="sm"
                      leftIcon={<Sparkles className="w-4 h-4" />}
                    >
                      Generate NDA Template
                    </PremiumButton>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {docsByType.NDA.map((doc, index) => (
                  <DocumentCard 
                    key={doc._id} 
                    doc={doc}
                    index={index}
                    canSign={!isOwner && doc.status === 'draft'}
                    canDelete={isOwner}
                    onSign={() => handleSign(doc._id)}
                    onDelete={() => handleDelete(doc._id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Upload Legal Document
                  </h2>
                  <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Document Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setUploadType('SAFE')}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          uploadType === 'SAFE'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        SAFE Agreement
                      </button>
                      <button
                        onClick={() => setUploadType('NDA')}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          uploadType === 'NDA'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        NDA
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Upload PDF</label>
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full p-8 border-2 border-dashed border-slate-700 rounded-xl hover:border-primary/50 transition-colors flex flex-col items-center gap-3 text-slate-400 hover:text-white"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8" />
                            <span>Click to select PDF file</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Template Generation Modal */}
        <AnimatePresence>
          {showTemplateModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Generate from Template
                  </h2>
                  <button onClick={() => { setShowTemplateModal(false); resetTemplateForm(); }} className="p-2 hover:bg-slate-800 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">Document Type</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTemplateType('SAFE')}
                          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                            templateType === 'SAFE'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          SAFE
                        </button>
                        <button
                          onClick={() => setTemplateType('NDA')}
                          className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                            templateType === 'NDA'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          NDA
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-400 mb-2">
                        {templateType === 'SAFE' ? 'Investor Name' : 'Recipient Name'}
                      </label>
                      <input
                        type="text"
                        value={investorName}
                        onChange={(e) => setInvestorName(e.target.value)}
                        placeholder="Enter name..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:border-primary outline-none"
                      />
                    </div>

                    {templateType === 'SAFE' && (
                      <>
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">Investment Amount (USD)</label>
                          <input
                            type="text"
                            value={investmentAmount}
                            onChange={(e) => setInvestmentAmount(e.target.value)}
                            placeholder="e.g., 50,000"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:border-primary outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">Discount Percentage</label>
                          <input
                            type="number"
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(e.target.value)}
                            placeholder="20"
                            min="0"
                            max="100"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:border-primary outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-slate-400 mb-2">Valuation Cap (USD)</label>
                          <input
                            type="text"
                            value={valuationCap}
                            onChange={(e) => setValuationCap(e.target.value)}
                            placeholder="e.g., 5,000,000"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:border-primary outline-none"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Preview</label>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-[300px] overflow-y-auto">
                      {generatedTemplate ? (
                        <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">
                          {generatedTemplate.content.slice(0, 1500)}
                          {generatedTemplate.content.length > 1500 && '...'}
                        </pre>
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => { setShowTemplateModal(false); resetTemplateForm(); }}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <PremiumButton
                    onClick={handleGenerateDocument}
                    variant="primary"
                    className="flex-1"
                    disabled={isUploading || !generatedTemplate}
                    leftIcon={isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  >
                    {isUploading ? 'Generating...' : 'Generate Document'}
                  </PremiumButton>
                </div>

                {/* Disclaimer */}
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-xs text-amber-400">
                    ⚠️ These templates are for informational purposes only. Please consult with a legal professional before using any legal documents.
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DocumentCard({ 
  doc, 
  index,
  canSign,
  canDelete,
  onSign,
  onDelete,
}: { 
  doc: LegalDoc;
  index: number;
  canSign: boolean;
  canDelete: boolean;
  onSign: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel rounded-xl p-4 flex items-center gap-4"
    >
      <div className={`p-3 rounded-xl ${
        doc.type === 'SAFE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
      }`}>
        <FileText className="w-6 h-6" />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{doc.type} Document</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            doc.status === 'signed' 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-amber-500/20 text-amber-400'
          }`}>
            {doc.status === 'signed' ? (
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Signed
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Pending
              </span>
            )}
          </span>
        </div>
        <div className="text-sm text-slate-400">
          Created {new Date(doc.createdAt).toLocaleDateString()}
          {doc.signedAt && ` • Signed ${new Date(doc.signedAt).toLocaleDateString()}`}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {doc.url && (
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </a>
        )}
        {canSign && (
          <div className="relative group">
            <PremiumButton
              onClick={onSign}
              variant="primary"
              className="rounded-lg"
            >
              Sign Document
            </PremiumButton>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded border border-amber-500/30">
                ✍️ DocuSign integration coming soon
              </span>
            </div>
          </div>
        )}
        {canDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
