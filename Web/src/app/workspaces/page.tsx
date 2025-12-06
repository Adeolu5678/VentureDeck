'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Briefcase, ArrowRight, Loader2, LayoutGrid } from 'lucide-react';
import { Id } from '@convex/_generated/dataModel';

interface Workspace {
  _id: Id<"workspaces">;
  name: string;
  projectId: Id<"projects">;
  members: Id<"users">[];
  createdAt: number;
}

export default function WorkspacesPage() {
  const { isLoaded, user } = useUser();
  const workspaces = useQuery(api.workspaces.list) as Workspace[] | undefined;

  if (!isLoaded || !user) return null;

  if (workspaces === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              My <span className="text-gradient">Workspaces</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Collaborate with your team and manage your projects.
            </p>
          </div>
          {/* 
            Ideally, creating a workspace happens via creating a project or a specific flow.
            For now, we just link to project creation if that's the main entry point, 
            or we could have a 'New Workspace' button if the logic supports it.
            Assuming workspaces are tied to projects for now.
          */}
        </header>

        {workspaces.length === 0 ? (
          <div className="p-16 border border-dashed border-border rounded-3xl text-center bg-muted/20 backdrop-blur-sm animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <LayoutGrid className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No workspaces found</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven&apos;t joined any workspaces yet. Create a project to start a new workspace or wait to be invited to one.
            </p>
            <Link 
              href="/projects/create" 
              className="px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold inline-flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              Create Project <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            {workspaces.map((workspace) => (
              <Link key={workspace._id} href={`/workspaces/${workspace._id}`} className="block group">
                <div className="glass-panel rounded-2xl p-6 hover:border-primary/50 transition-all h-full group-hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-primary -translate-x-2 group-hover:translate-x-0 transition-transform" />
                  </div>
                  
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {workspace.name}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <LayoutGrid className="w-4 h-4" />
                      <span>Workspace</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       {/* We could show member count here if we wanted */}
                       <span>{workspace.members.length} Member{workspace.members.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
