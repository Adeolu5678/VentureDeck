'use client';

import Link from "next/link";
import { ArrowRight, Rocket, Shield, Users, Zap, Globe, Target } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumCard } from "@/components/ui/PremiumCard";

export default function LandingPage() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen text-foreground overflow-hidden">
      {/* Background Noise & Gradient */}
      <div className="bg-noise" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/20 mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-white">VentureDeck 3.0 is Live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
          >
            Where Ambition <br />
            <span className="text-gradient">
              Meets Opportunity
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            We envision a world where every groundbreaking idea has a clear path to reality. 
            VentureDeck is the catalyst that transforms raw ambition into investable enterprises.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
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
        </div>

        {/* Floating Abstract Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/10 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </section>

      {/* Strategic Aims / Features */}
      <section className="py-32 relative" id="how-it-works">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Our Strategic Aims</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Built on four pillars to revolutionize the venture capital landscape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      <section className="py-32 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">Two Worlds, <br/>One Platform</h2>
              <div className="space-y-8">
                <div className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Rocket className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">The Forge</h3>
                    <p className="text-slate-400 leading-relaxed">
                      For Entrepreneurs. A structured environment to articulate visions, build pitch decks, and showcase traction. Turn your idea into an investable asset.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Zap className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">Deal Flow</h3>
                    <p className="text-slate-400 leading-relaxed">
                      For Investors. A high-signal discovery engine to find, vet, and connect with the next generation of unicorns. Data-driven due diligence at your fingertips.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-3xl opacity-20" />
              <PremiumCard className="relative p-8 h-[400px] flex items-center justify-center border-white/10">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto shadow-2xl shadow-primary/30 flex items-center justify-center">
                   <Rocket className="text-white w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Join the Revolution</h3>
                  <p className="text-slate-400">Launch or Fund. It starts here.</p>
                </div>
              </PremiumCard>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative text-center z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">Ready to Launch?</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Join the ecosystem where the future is being built today.
          </p>
          <SignInButton mode="modal">
            <PremiumButton size="lg" variant="gradient" className="text-lg px-12 py-6">
              Get Started Now
            </PremiumButton>
          </SignInButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <Link href="/" className="text-2xl font-bold text-white mb-4 block">VentureDeck</Link>
              <p className="text-slate-500 max-w-sm">
                The ultimate launchpad for new startups. Bridging the gap between ambition and opportunity.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Platform</h4>
              <ul className="space-y-2 text-slate-500">
                <li><Link href="#" className="hover:text-primary transition-colors">The Forge</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Deal Flow</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-slate-500">
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-slate-600 text-sm">
            © {new Date().getFullYear()} VentureDeck. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }: { icon: React.ElementType, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <PremiumCard glow className="h-full">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed">
          {description}
        </p>
      </PremiumCard>
    </motion.div>
  );
}
