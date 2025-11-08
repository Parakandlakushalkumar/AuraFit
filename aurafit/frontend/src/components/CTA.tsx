import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import img1 from "@/assets/1image.jpeg";
import img2 from "@/assets/2image.jpg";
import img3 from "@/assets/3image.avif";
import img4 from "@/assets/4image.jpg";

export const CTA = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Hero animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/12 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: text and CTAs */}
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
              <Sparkles className="w-5 h-5 text-primary animate-glow" />
              <span className="text-muted-foreground font-semibold">AuraFit — AI Personal Coach</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
              Meet AuraFit
              <br />
              <span className="text-gradient">Your 24/7 AI Fitness Ally</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Smart workouts, meal plans, and real-time form feedback that adapt to your body.
              Tell AuraFit your height, weight and goal — then watch it craft the perfect plan.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <Button size="lg" variant="hero" className="group px-8" onClick={() => navigate("/login")}>
                Start Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="px-6" onClick={() => navigate("/features")}>
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="space-y-1">
                <div className="text-2xl font-display font-bold text-gradient">Tailored</div>
                <p className="text-sm text-muted-foreground">Plans for every goal</p>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-display font-bold text-gradient">Real-Time</div>
                <p className="text-sm text-muted-foreground">Form feedback & coaching</p>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-display font-bold text-gradient">Community</div>
                <p className="text-sm text-muted-foreground">Motivation & challenges</p>
              </div>
            </div>
          </div>

          {/* Right: overlapping images */}
          <div className="relative w-full h-96 rounded-3xl overflow-hidden shadow-card neon-border">
            <img src={img1} alt="AuraFit highlight 1" className="absolute left-6 top-6 w-2/3 h-2/3 object-cover rounded-2xl transform -rotate-3 shadow-xl transition-all hover:scale-105" />
            <img src={img2} alt="AuraFit highlight 2" className="absolute right-6 top-12 w-1/2 h-1/2 object-cover rounded-xl transform rotate-2 shadow-lg transition-all hover:translate-y-[-6px]" />
            <img src={img3} alt="AuraFit highlight 3" className="absolute left-12 bottom-6 w-1/2 h-1/2 object-cover rounded-xl transform rotate-1 shadow-lg transition-all" />
            <img src={img4} alt="AuraFit highlight 4" className="absolute right-10 bottom-10 w-36 h-36 object-cover rounded-lg border border-white/10 shadow-md transition-all" />

            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};
