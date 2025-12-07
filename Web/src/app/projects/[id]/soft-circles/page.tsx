'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Id, Doc } from '@convex/_generated/dataModel';
import { DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function SoftCirclesPage() {
  const params = useParams();
  const projectId = params.id as Id<'projects'>;
  
  const user = useQuery(api.users.getCurrentUser);
  const project = useQuery(api.projects.get, { id: projectId });
  const commitments = useQuery(api.soft_circles.get, { projectId }) || [];
  const commit = useMutation(api.soft_circles.commit);

  const myCommitment = commitments?.find((c: Doc<'soft_circles'>) => c.investorId === user?._id);

  const [amount, setAmount] = useState(myCommitment ? myCommitment.amount.toString() : '');
  const [committed, setCommitted] = useState(false);

  // Update local state if myCommitment loads later
  if (myCommitment && amount === '' && !committed) {
      setAmount(myCommitment.amount.toString());
  }

  if (!project || !user) return null;

  const isOwner = user._id === project.ownerId;
  const isInvestor = user.role === 'investor';

  const totalCommitted = commitments.reduce((sum: number, c: Doc<'soft_circles'>) => sum + c.amount, 0);
  const percentFunded = Math.min(100, Math.round((totalCommitted / project.fundingGoal) * 100));

  const handleCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    await commit({
      projectId,
      amount: Number(amount),
    });
    setCommitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href={`/projects/${projectId}`} className="text-sm text-muted-foreground hover:text-foreground mb-2 block">
            &larr; Back to Project
          </Link>
          <h1 className="text-2xl font-bold">Soft Circles</h1>
          <p className="text-muted-foreground">Gauge investor interest before the round opens.</p>
        </div>

        {/* Progress Card */}
        <div className="bg-muted border border-border rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Soft Circled</div>
              <div className="text-3xl font-bold text-foreground">${totalCommitted.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Funding Goal</div>
              <div className="text-xl font-semibold text-muted-foreground">${project.fundingGoal.toLocaleString()}</div>
            </div>
          </div>

          <div className="h-4 bg-muted rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-1000"
              style={{ width: `${percentFunded}%` }}
            />
          </div>
          <div className="text-right text-sm text-primary font-medium">{percentFunded}% Committed</div>
        </div>

        {/* Investor Action */}
        {isInvestor && (
          <div className="bg-muted border border-border rounded-xl p-8 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {myCommitment ? 'Edit Your Commitment' : 'Express Interest'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {myCommitment 
                ? 'You have already expressed interest. You can update your committed amount below.' 
                : 'Indicate your interest in this round. This is non-binding but helps the founder gauge demand.'}
            </p>
            <form onSubmit={handleCommit} className="flex gap-4">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount (USD)"
                  className="w-full bg-background border border-input text-foreground focus:border-primary"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-colors"
              >
                {myCommitment ? 'Update' : 'Commit'}
              </button>
            </form>
          </div>
        )}

        {committed && (
          <div className="bg-primary/20 border border-primary/50 rounded-xl p-6 mb-8 text-center">
            <h3 className="text-lg font-bold text-primary mb-2">Interest Recorded!</h3>
            <p className="text-primary/80">The founder has been notified of your soft commitment.</p>
          </div>
        )}

        {/* Owner View */}
        {isOwner && (
          <div>
            <h3 className="text-lg font-bold mb-4">Interested Investors</h3>
            {commitments.length === 0 ? (
              <div className="text-muted-foreground italic">No commitments yet.</div>
            ) : (
              <div className="space-y-4">
                {commitments.map((c: Doc<'soft_circles'>) => (
                  <div key={c._id} className="bg-muted/50 border border-border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold">
                        INV
                      </div>
                      <div>
                        <div className="font-medium">Investor</div>
                        <div className="text-xs text-muted-foreground">Committed {new Date(c.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="font-bold text-primary">${c.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
