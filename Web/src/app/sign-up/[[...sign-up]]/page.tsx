import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background selection:bg-primary/30">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />


      <div className="z-10 flex flex-col items-center gap-8 w-full max-w-md px-4 my-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-violet-600 shadow-primary/20 border-border/10">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            VentureDeck
          </span>
        </Link>

        <div className="w-full glass-panel p-1 rounded-3xl">
          <SignUp appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none w-full p-6",
              headerTitle: "text-white text-2xl font-bold tracking-tight",
              headerSubtitle: "text-muted-foreground text-base",
              socialButtonsBlockButton: "bg-muted/50 border border-border/10 text-foreground hover:bg-muted hover:border-border/20 transition-all duration-200 rounded-xl",
              socialButtonsBlockButtonText: "text-foreground font-medium",
              dividerLine: "bg-border/10",
              dividerText: "text-muted-foreground",
              formFieldLabel: "text-muted-foreground font-medium",
              formFieldInput: "bg-background/50 border border-border/10 text-foreground focus:border-primary focus:ring-primary/20 transition-all rounded-xl py-3",
              footerActionLink: "text-primary hover:text-primary/80 font-medium",
              formButtonPrimary: "bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-500 text-primary-foreground font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 transition-all duration-200",
              footer: "hidden",
            },
            layout: {
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "blockButton",
            }
          }} />
        </div>
      </div>
    </div>
  );
}
