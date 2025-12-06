'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Id } from '@convex/_generated/dataModel';

interface Certification {
  _id: Id<"certifications">;
  userId: Id<"users">;
  title: string;
  imageUrl: string;
  status: "pending" | "verified" | "rejected";
  createdAt: number;
}

export default function AdminDashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const convexUser = useQuery(api.users.getCurrentUser);
  const pendingCertifications = useQuery(api.certifications.listPending) as Certification[] | undefined;
  const verifyCertification = useMutation(api.certifications.verify);
  const rejectCertification = useMutation(api.certifications.reject);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !convexUser) return null;

  if (!convexUser.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const handleVerify = async (id: Id<"certifications">) => {
    try {
      await verifyCertification({ id });
    } catch (error) {
      console.error("Failed to verify:", error);
    }
  };

  const handleReject = async (id: Id<"certifications">) => {
    try {
      await rejectCertification({ id });
    } catch (error) {
      console.error("Failed to reject:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Manage certifications and platform verification.</p>
          </div>
        </header>

        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Pending Certifications
          </h2>

          {!pendingCertifications || pendingCertifications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No pending certifications to review.
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingCertifications.map((cert) => (
                <div key={cert._id} className="bg-slate-900/50 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg relative overflow-hidden shrink-0">
                    {/* In a real app, this would be the certification image */}
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground bg-slate-800">
                      IMG
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{cert.title}</h3>
                    <div className="text-sm text-muted-foreground">
                      Submitted by: <span className="text-foreground font-medium">User ID: {cert.userId}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Submitted on: {new Date(cert.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <button
                      onClick={() => handleVerify(cert._id)}
                      className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Verify
                    </button>
                    <button
                      onClick={() => handleReject(cert._id)}
                      className="flex-1 md:flex-none px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
