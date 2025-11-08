import { Sparkles, Zap, Target, Heart, TrendingUp, Users, Award, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AboutAuraFit = () => {
  const navigate = useNavigate();
  const stats = [
    { icon: Users, value: "10K+", label: "Active Athletes", color: "text-secondary" },
    { icon: TrendingUp, value: "95%", label: "Goal Achievement", color: "text-success" },
    { icon: Award, value: "1M+", label: "Workouts Generated", color: "text-primary" },
    { icon: Brain, value: "24/7", label: "AI Support", color: "text-accent" },
  ];

  const values = [
    {
      icon: Target,
      title: "Personalized Training",
      description: "Every workout is tailored to your unique body, goals, and preferences. Our AI learns from your progress and adapts in real-time.",
      gradient: "from-primary to-purple-600",
    },
    {
      icon: Heart,
      title: "Holistic Wellness",
      description: "We don't just focus on workouts. Nutrition, mental health, and community support are all part of your journey.",
      gradient: "from-secondary to-cyan-500",
    },
    {
      icon: Zap,
      title: "Cutting-Edge Technology",
      description: "Real-time pose detection, AI-powered meal plans, and advanced analytics help you train smarter, not harder.",
      gradient: "from-success to-emerald-500",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-background to-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent blur-3xl animate-pulse" 
          style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/20 via-blue-500/10 to-transparent blur-3xl animate-pulse" 
          style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-float" 
          style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,92,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,92,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-sm">
            <Sparkles className="w-5 h-5 text-primary animate-glow" />
            <span className="text-muted-foreground font-semibold">About AuraFit</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-display font-bold leading-tight">
            Your AI-Powered
            <br />
            <span className="text-gradient">Fitness Revolution</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            AuraFit isn't just another fitness app. We're a complete ecosystem that combines artificial intelligence, 
            real-time coaching, and community support to transform how you train, eat, and live.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/40 transition-all hover:shadow-neon hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-display font-bold text-gradient mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Core Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {values.map((value, idx) => (
            <div
              key={idx}
              className="group relative p-8 rounded-2xl bg-gradient-card border border-border hover:border-primary/40 transition-all hover:shadow-neon overflow-hidden animate-slide-up"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="relative rounded-3xl overflow-hidden border border-primary/30 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-12 animate-fade-in">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-40 h-40 bg-primary rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-display font-bold text-gradient">
              Our Mission
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To democratize access to world-class fitness coaching through AI. We believe everyone deserves 
              personalized guidance, regardless of budget or location. AuraFit makes professional-grade training 
              accessible to all, powered by cutting-edge technology and a passion for helping you achieve your best self.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button size="lg" variant="hero" className="group px-8" onClick={() => navigate("/workouts")}>
                Start Your Journey
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="px-6" onClick={() => navigate("/features")}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

