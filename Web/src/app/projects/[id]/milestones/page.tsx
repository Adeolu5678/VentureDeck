'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Id } from '@convex/_generated/dataModel';
import { CheckCircle, Circle, Plus } from 'lucide-react';
import Link from 'next/link';

export default function MilestonesPage() {
  const params = useParams();
  const projectId = params.id as Id<'projects'>;
  
  const user = useQuery(api.users.getCurrentUser);
  const project = useQuery(api.projects.get, { id: projectId });
  const milestones = useQuery(api.milestones.list, { projectId }) || [];
  const createMilestone = useMutation(api.milestones.create);

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  if (!project || !user) return null;

  const isOwner = user._id === project.ownerId;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMilestone({
      projectId,
      title,
      description,
      date: new Date(date).getTime(),
    });
    setIsCreating(false);
    setTitle('');
    setDescription('');
    setDate('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href={`/projects/${projectId}`} className="text-sm text-muted-foreground hover:text-foreground mb-2 block">
              &larr; Back to Project
            </Link>
            <h1 className="text-2xl font-bold">Milestones</h1>
            <p className="text-muted-foreground">Track the progress of {project.title}</p>
          </div>
          {isOwner && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Milestone
            </button>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {milestones.map((milestone) => (
            <div key={milestone._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-muted group-[.is-active]:bg-primary text-muted-foreground group-[.is-active]:text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                {milestone.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-muted p-4 rounded-xl border border-border shadow-lg">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-foreground">{milestone.title}</div>
                  <time className="font-caveat font-medium text-primary text-sm">
                    {new Date(milestone.date).toLocaleDateString()}
                  </time>
                </div>
                <div className="text-muted-foreground text-sm">{milestone.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Milestone</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg p-3 text-sm focus:border-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg p-3 text-sm focus:border-primary outline-none h-24"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Target Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-input border border-border rounded-lg p-3 text-sm focus:border-primary outline-none"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="flex-1 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
