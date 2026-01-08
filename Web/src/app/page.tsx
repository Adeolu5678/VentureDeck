'use client';

import Link from "next/link";
import { ArrowRight, Rocket, Shield, Users, Zap, Globe, Target, Sparkles, ChevronDown } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { motion, Variants } from "framer-motion";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';

// Staggered animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function LandingPage() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center pt-8 pb-20">
        {/* Animated Background Orbs */}
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] orb-primary opacity-60" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] orb-accent opacity-40" />
        <div className="absolute top-[60%] left-[60%] w-[300px] h-[300px] orb-primary opacity-30" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-panel-warm mb-10"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-sm font-medium text-white/90">VentureDeck 3.0 is Live</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-8 leading-[1.1]"
            >
              Where Ambition{" "}
              <br className="hidden sm:block" />
              <span className="text-gradient">
                Meets Opportunity
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-14 leading-relaxed"
            >
              We envision a world where every groundbreaking idea has a clear path to reality. 
              VentureDeck is the catalyst that transforms raw ambition into investable enterprises.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {isSignedIn ? (
                <Link href="/dashboard">
                  <PremiumButton size="lg" variant="gradient" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Go to Dashboard
                  </PremiumButton>
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <PremiumButton size="lg" variant="gradient" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Start Your Journey
                  </PremiumButton>
                </SignInButton>
              )}
              <Link href="#how-it-works">
                <PremiumButton size="lg" variant="glass">
                  How it Works
                </PremiumButton>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-xs uppercase tracking-widest">Explore</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Strategic Aims / Features */}
      <section className="py-32 relative" id="how-it-works">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">Why VentureDeck</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">Our Strategic Aims</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Built on four pillars to revolutionize the venture capital landscape.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={Globe}
              title="Democratize Access"
              description="Leveling the playing field for entrepreneurs by providing standardized tools to showcase potential."
              delay={0}
            />
            <FeatureCard 
              icon={Target}
              title="Accelerate Discovery"
              description="Empowering investors with high-signal, data-driven deal flow to find the next unicorn efficiently."
              delay={0.1}
            />
            <FeatureCard 
              icon={Shield}
              title="Build Trust"
              description="Establishing a verified ecosystem where certifications, skills, and reputation are transparent."
              delay={0.2}
            />
            <FeatureCard 
              icon={Users}
              title="Foster Connection"
              description="Creating meaningful, direct channels between founders, funders, and builders."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* The Ecosystem */}
      <section className="py-32 relative overflow-hidden">
        {/* Subtle section background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-primary text-sm font-semibold uppercase tracking-widest mb-4 block">The Ecosystem</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-10 text-white">
                Two Worlds,{" "}
                <br/>
                <span className="text-gradient-dual">One Platform</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-105 transition-all duration-300 border border-primary/20">
                    <Rocket className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold mb-2 text-white group-hover:text-primary transition-colors">The Forge</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      For Entrepreneurs. A structured environment to articulate visions, build pitch decks, and showcase traction. Turn your idea into an investable asset.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 group-hover:scale-105 transition-all duration-300 border border-accent/20">
                    <Zap className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold mb-2 text-white group-hover:text-accent transition-colors">Deal Flow</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      For Investors. A high-signal discovery engine to find, vet, and connect with the next generation of unicorns. Data-driven due diligence at your fingertips.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-3xl blur-3xl opacity-50" />
              
              <PremiumCard variant="gradient-border" glow className="relative p-10 min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-6">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-24 h-24 bg-gradient-to-br from-primary via-[hsl(42_95%_55%)] to-accent rounded-3xl mx-auto shadow-2xl shadow-primary/40 flex items-center justify-center"
                  >
                    <Rocket className="text-white w-12 h-12" />
                  </motion.div>
                  <h3 className="text-2xl font-display font-bold text-white">Join the Revolution</h3>
                  <p className="text-muted-foreground">Launch or Fund. It starts here.</p>
                  <SignInButton mode="modal">
                    <PremiumButton variant="gradient" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Get Started
                    </PremiumButton>
                  </SignInButton>
                </div>
              </PremiumCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <DynamicStats />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] orb-primary opacity-30" />
        
        <div className="container mx-auto px-6 relative text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 text-white">
              Ready to <span className="text-gradient">Launch</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join the ecosystem where the future is being built today.
            </p>
            <SignInButton mode="modal">
              <PremiumButton size="lg" variant="gradient" className="text-lg px-12 py-5">
                Get Started Now
              </PremiumButton>
            </SignInButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/[0.06] bg-[#050508]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-display font-bold text-white">VentureDeck</span>
              </Link>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                The ultimate launchpad for new startups. Bridging the gap between ambition and opportunity.
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold mb-5 text-white">Platform</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">The Forge</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Deal Flow</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-bold mb-5 text-white">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                <li><Link href="/acceptable-use" className="hover:text-primary transition-colors">Acceptable Use</Link></li>
                <li><Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.06] text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} VentureDeck. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }: { icon: React.ElementType, title: string, description: string, delay: number }) {
  return (
    <PremiumCard 
      glow 
      className="h-full"
      animated={true}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-display font-bold mb-3 text-white">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </PremiumCard>
  );
}

function StatCard({ value, label, delay }: { value: string, label: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-display font-bold text-gradient mb-2">{value}</div>
      <div className="text-muted-foreground text-sm">{label}</div>
    </motion.div>
  );
}

function DynamicStats() {
  const stats = useQuery(api.public_stats.getPublicStats);
  
  if (!stats) {
    // Loading state with skeleton
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="text-center animate-pulse">
            <div className="h-12 w-24 mx-auto bg-white/5 rounded mb-2" />
            <div className="h-4 w-20 mx-auto bg-white/5 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M+`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K+`;
    return `$${amount.toLocaleString()}`;
  };

  const tractionRate = stats.totalMilestones > 0 
    ? Math.round((stats.completedMilestones / stats.totalMilestones) * 100)
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      <StatCard 
        value={formatCurrency(stats.totalCommitted)} 
        label="Funding Facilitated" 
        delay={0} 
      />
      <StatCard 
        value={`${stats.entrepreneurs}+`} 
        label="Active Founders" 
        delay={0.1} 
      />
      <StatCard 
        value={`${stats.investors}+`} 
        label="Investor Network" 
        delay={0.2} 
      />
      <StatCard 
        value={`${tractionRate}%`} 
        label="Milestone Success Rate" 
        delay={0.3} 
      />
    </div>
  );
}
