import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/lib/convex";
import { BottomNav } from "@/components/layout/BottomNav";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TopNav } from "@/components/layout/TopNav";
import { Toaster } from "sonner";
import { GlobalNotifications } from "@/components/GlobalNotifications";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VentureDeck | The Future of Venture Capital",
  description: "Where Ambition Meets Opportunity. Connect with visionary entrepreneurs and elite investors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ConvexClientProvider>
          <div className="relative min-h-screen bg-background text-foreground pb-20 selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">
            {/* Global Background Effects */}
            <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />

            
            <TopNav />
            <Breadcrumbs />
            {children}
            <BottomNav />
            <Toaster position="top-right" theme="dark" />
            <GlobalNotifications />
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
