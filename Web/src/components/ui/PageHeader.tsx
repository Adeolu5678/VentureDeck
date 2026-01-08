'use client';

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  breadcrumbs, 
  actions,
  className 
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className={cn(
      "sticky top-0 z-30 -mx-6 px-6 pt-4 pb-6 mb-4",
      "bg-background/95 backdrop-blur-xl border-b border-white/[0.06]",
      "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
      className
    )}>
      {/* Integrated Navigation: Back + Home + Breadcrumbs */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-all duration-200"
          title="Go Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Separator */}
        <div className="w-px h-5 bg-white/10" />

        {/* Breadcrumbs with Home */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-1.5 hover:text-primary transition-colors duration-200"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          
          {breadcrumbs?.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 opacity-40" />
              {item.href ? (
                <Link href={item.href} className="hover:text-primary transition-colors duration-200">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-muted-foreground max-w-2xl leading-relaxed"
            >
              {description}
            </motion.p>
          )}
        </div>

        {actions && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center gap-3 shrink-0"
          >
            {actions}
          </motion.div>
        )}
      </div>
    </div>
  );
}
