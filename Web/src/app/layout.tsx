import type { Metadata } from "next";
import { Sora, Outfit } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/lib/convex";
import { BottomNavProvider } from "@/context/BottomNavContext";
import { KeyboardShortcutsProvider } from "@/context/KeyboardShortcutsContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { TopNav } from "@/components/layout/TopNav";
import { Toaster } from "sonner";
import { GlobalNotifications } from "@/components/GlobalNotifications";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const sora = Sora({ 
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"]
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL
      ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
  ),
  title: "VentureDeck | The Future of Venture Capital",
  description: "Where Ambition Meets Opportunity. Connect visionary entrepreneurs with elite investors. Track milestones, manage deal flow, and build the future together.",
  keywords: ["venture capital", "startup funding", "investor network", "entrepreneur platform", "deal flow", "pitch deck", "soft circles", "milestones", "bounties"],
  authors: [{ name: "VentureDeck Team" }],
  creator: "VentureDeck",
  publisher: "VentureDeck",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://venturedeck.io",
    siteName: "VentureDeck",
    title: "VentureDeck | The Future of Venture Capital",
    description: "Where Ambition Meets Opportunity. Connect with visionary entrepreneurs and elite investors.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VentureDeck - The Future of Venture Capital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VentureDeck | The Future of Venture Capital",
    description: "Where Ambition Meets Opportunity. Connect with visionary entrepreneurs and elite investors.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${outfit.variable}`}>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <ConvexClientProvider>
            <BottomNavProvider>
              <KeyboardShortcutsProvider>
                <div className="relative min-h-screen bg-background text-foreground pb-20 selection:bg-primary/30 selection:text-primary-foreground overflow-x-hidden">
                  {/* Noise Texture Overlay */}
                  <div className="bg-noise" />
                  
                  {/* Floating Orbs for Ambient Depth */}
                  <div className="orb-primary w-[600px] h-[600px] -top-[300px] -left-[200px] opacity-50" />
                  <div className="orb-accent w-[400px] h-[400px] top-[40%] -right-[150px] opacity-40" />
                  <div className="orb-primary w-[300px] h-[300px] bottom-[10%] left-[10%] opacity-30" />

                  <TopNav />
                  {children}
                  <BottomNav />
                  <Toaster 
                    position="top-right" 
                    theme="dark" 
                    toastOptions={{
                      style: {
                        background: 'hsl(240 8% 8% / 0.9)',
                        border: '1px solid hsl(240 5% 18%)',
                        backdropFilter: 'blur(16px)',
                        color: 'white',
                      }
                    }}
                  />
                  <GlobalNotifications />
                </div>
              </KeyboardShortcutsProvider>
            </BottomNavProvider>
          </ConvexClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
