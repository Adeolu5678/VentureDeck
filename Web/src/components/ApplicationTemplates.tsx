'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../Convex/convex/_generated/api';
import { 
  FileText, 
  Plus, 
  Star, 
  Trash2, 
  Edit2,
  Check,
  X,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';

interface ApplicationTemplatesProps {
  onSelectTemplate?: (role: string, message: string) => void;
  className?: string;
}

export function ApplicationTemplates({ onSelectTemplate, className = '' }: ApplicationTemplatesProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');

  const templates = useQuery(api.applicationTemplates.list) || [];
  const createTemplate = useMutation(api.applicationTemplates.create);
  const updateTemplate = useMutation(api.applicationTemplates.update);
  const deleteTemplate = useMutation(api.applicationTemplates.remove);
  const incrementUsage = useMutation(api.applicationTemplates.incrementUsage);

  const handleCreate = async () => {
    if (!name.trim() || !role.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createTemplate({
        name: name.trim(),
        role: role.trim(),
        message: message.trim(),
        isDefault: templates.length === 0,
      });
      toast.success('Template created!');
      resetForm();
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to create template');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!name.trim() || !role.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await updateTemplate({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: id as any,
        name: name.trim(),
        role: role.trim(),
        message: message.trim(),
      });
      toast.success('Template updated!');
      resetForm();
    } catch {
      toast.error('Failed to update template');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await deleteTemplate({ id: id as any });
      toast.success('Template deleted');
    } catch {
      toast.error('Failed to delete template');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateTemplate({ id: id as any, isDefault: true });
      toast.success('Set as default');
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleUseTemplate = async (template: typeof templates[0]) => {
    if (onSelectTemplate) {
      onSelectTemplate(template.role, template.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await incrementUsage({ id: template._id as any });
      toast.success('Template applied!');
    }
  };

  const startEdit = (template: typeof templates[0]) => {
    setEditingId(template._id);
    setName(template.name);
    setRole(template.role);
    setMessage(template.message);
    setIsCreating(false);
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setName('');
    setRole('');
    setMessage('');
  };

  return (
    <div className={`bg-neutral-800/50 rounded-xl border border-neutral-700/50 ${className}`}>
      <div className="p-4 border-b border-neutral-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-medium text-neutral-100">Application Templates</h3>
          </div>
          {!isCreating && !editingId && templates.length < 5 && (
            <button
              onClick={() => setIsCreating(true)}
              className="text-sm text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          )}
        </div>
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {(isCreating || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-b border-neutral-700/50 space-y-3"
          >
            <input
              type="text"
              placeholder="Template name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            <input
              type="text"
              placeholder="Role (e.g., CTO, Co-founder)..."
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            <textarea
              placeholder="Your application message template..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={editingId ? () => handleUpdate(editingId) : handleCreate}
                className="flex-1 py-2 bg-amber-500/20 text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-500/30 transition-colors"
              >
                <Check className="w-4 h-4 inline mr-1" />
                {editingId ? 'Save Changes' : 'Create Template'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-neutral-700/50 text-neutral-400 rounded-lg text-sm hover:bg-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates List */}
      <div className="divide-y divide-neutral-700/50">
        {templates.length === 0 && !isCreating ? (
          <div className="p-6 text-center">
            <FileText className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm text-neutral-500">No templates yet</p>
            <p className="text-xs text-neutral-600 mt-1">Save time when applying to projects</p>
            <button
              onClick={() => setIsCreating(true)}
              className="mt-3 text-sm text-amber-400 hover:text-amber-300"
            >
              Create your first template
            </button>
          </div>
        ) : (
          templates.map((template) => (
            <div key={template._id} className="p-3 hover:bg-neutral-700/20 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-neutral-200 truncate">
                      {template.name}
                    </span>
                    {template.isDefault && (
                      <span className="px-1.5 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="px-2 py-0.5 bg-neutral-700/50 rounded-full">
                      {template.role}
                    </span>
                    <span>Used {template.usageCount}x</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {onSelectTemplate && (
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      title="Use template"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                  {!template.isDefault && (
                    <button
                      onClick={() => handleSetDefault(template._id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-amber-400 hover:bg-amber-500/20 transition-colors"
                      title="Set as default"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(template)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-700 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-neutral-500 line-clamp-2">
                {template.message}
              </p>
            </div>
          ))
        )}
      </div>

      {templates.length >= 5 && !isCreating && (
        <div className="p-3 text-center text-xs text-neutral-500 border-t border-neutral-700/50">
          Maximum 5 templates reached
        </div>
      )}
    </div>
  );
}
