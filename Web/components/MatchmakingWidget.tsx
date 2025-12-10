import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { Doc } from "@convex/_generated/dataModel";

export default function MatchmakingWidget() {
  const matches = useQuery(api.matchmaking.getMatches);

  if (!matches || matches.length === 0) {
    return null; // Don't show if no matches or loading
  }

  return (
    <div className="mb-8 w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Star className="h-5 w-5 text-[#E000FF] fill-[#E000FF]" />
          Recommended for You
        </h2>
        <span className="text-xs text-gray-400 uppercase tracking-wider">AI-Powered</span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {matches.map((project: Doc<"projects"> & { matchScore: number }) => (
          <Link
            key={project._id}
            href={`/projects/${project._id}`}
            className="snap-center shrink-0 w-[280px] h-[160px] relative group rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md hover:border-[#00A3FF]/50 transition-all"
          >
            {/* Match Badge */}
            <div className="absolute top-2 right-2 bg-[#E000FF]/20 border border-[#E000FF]/50 text-[#E000FF] text-xs font-bold px-2 py-1 rounded-full backdrop-blur-md z-10">
              {project.matchScore}% Match
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent">
              <h3 className="text-lg font-bold text-white leading-tight mb-1 group-hover:text-[#00A3FF] transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-gray-300 line-clamp-1">{project.tagline}</p>
              
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                <span>{project.industry}</span>
                <span>•</span>
                <span>${(project.fundingGoal / 1000).toFixed(0)}k Goal</span>
              </div>
            </div>
          </Link>
        ))}
        
        {/* "See All" Card */}
        <Link
          href="/projects"
          className="snap-center shrink-0 w-[100px] h-[160px] flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <ArrowRight className="h-5 w-5 text-white" />
          </div>
          <span className="text-xs text-gray-400">See All</span>
        </Link>
      </div>
    </div>
  );
}
