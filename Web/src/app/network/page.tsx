'use client';

import { PageHeader } from "@/components/ui/PageHeader";
import { FriendsList } from "@/components/FriendsList";

export default function NetworkPage() {
  return (
    <div className="min-h-screen pb-20">
      <div className="relative pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <PageHeader 
            title="My Network" 
            description="Manage your professional connections and pending requests."
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Network" }
            ]}
          />
          
          <FriendsList />
        </div>
      </div>
    </div>
  );
}
