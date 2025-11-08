import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Users, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroDuo from "@/assets/hero-duo.png";

export const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Hero background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: `url(${heroDuo})` }}
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,92,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(124,92,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">AI-Powered Fitness Revolution</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
              Train Smarter.
              <br />
              <span className="text-gradient">Glow Stronger.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl">
              AI workouts, real-time pose coaching, and community challenges — all in one pro dashboard. 
              Transform your training with futuristic tech.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-secondary" />
                  <span className="text-2xl font-display font-bold">10K+</span>
                </div>
                <p className="text-sm text-muted-foreground">Active Athletes</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-2xl font-display font-bold">95%</span>
                </div>
                <p className="text-sm text-muted-foreground">Goal Achievement</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-display font-bold">1M+</span>
                </div>
                <p className="text-sm text-muted-foreground">Workouts Generated</p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="hero" className="group" onClick={() => navigate("/login")}>
                Start Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              No credit card required • Free forever plan • Upgrade anytime
            </p>
          </div>
        </div>
      </div>

      

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};
