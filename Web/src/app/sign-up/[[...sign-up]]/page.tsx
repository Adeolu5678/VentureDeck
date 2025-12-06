import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none" />


      <div className="z-10 flex flex-col items-center gap-8 w-full max-w-md px-4 my-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 border border-white/10">
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
              headerSubtitle: "text-slate-400 text-base",
              socialButtonsBlockButton: "bg-slate-800/50 border border-white/10 text-white hover:bg-slate-800 hover:border-white/20 transition-all duration-200 rounded-xl",
              socialButtonsBlockButtonText: "text-white font-medium",
              dividerLine: "bg-white/10",
              dividerText: "text-slate-500",
              formFieldLabel: "text-slate-300 font-medium",
              formFieldInput: "bg-slate-950/50 border border-white/10 text-white focus:border-indigo-500 focus:ring-indigo-500/20 transition-all rounded-xl py-3",
              footerActionLink: "text-indigo-400 hover:text-indigo-300 font-medium",
              formButtonPrimary: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200",
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
