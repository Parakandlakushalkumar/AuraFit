import { Button } from "@/components/ui/button";
import { Brain, Moon, Focus, Frown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext.jsx";

const Mind = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const mentalHealthSessions = [
    { 
      title: "Stress & Anxiety", 
      desc: "Calm your mind with guided breathing, meditation, and relaxation techniques.", 
      icon: Brain,
      gradient: "from-indigo-500/20 via-indigo-400/10 to-transparent",
      borderColor: "group-hover:border-indigo-400/50",
      iconColor: "text-indigo-500",
      glowColor: "group-hover:shadow-indigo-500/20"
    },
    { 
      title: "Better Sleep", 
      desc: "Fall asleep faster with calming routines and restorative sleep practices.", 
      icon: Moon,
      gradient: "from-violet-500/20 via-violet-400/10 to-transparent",
      borderColor: "group-hover:border-violet-400/50",
      iconColor: "text-violet-500",
      glowColor: "group-hover:shadow-violet-500/20"
    },
    { 
      title: "Focus & Clarity", 
      desc: "Sharpen attention with quick mindfulness and grounding techniques.", 
      icon: Focus,
      gradient: "from-cyan-500/20 via-cyan-400/10 to-transparent",
      borderColor: "group-hover:border-cyan-400/50",
      iconColor: "text-cyan-500",
      glowColor: "group-hover:shadow-cyan-500/20"
    },
    { 
      title: "Motivation", 
      desc: "Boost momentum with short mood-lifting practices.", 
      icon: Frown,
      gradient: "from-pink-500/20 via-pink-400/10 to-transparent",
      borderColor: "group-hover:border-pink-400/50",
      iconColor: "text-pink-500",
      glowColor: "group-hover:shadow-pink-500/20"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-indigo-950/5 to-muted/30 relative overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto px-4 pt-28 pb-16 relative z-10">
        {/* Header Section */}
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700 mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-center text-gradient">
              Mind Wellness
            </h1>
            <Sparkles className="w-8 h-8 text-violet-500 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto text-lg">
            Nurture your mental health with guided sessions designed to bring peace, clarity, and emotional balance to your life.
          </p>
        </div>

        {/* Mental Health Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
          {mentalHealthSessions.map((session, i) => {
            const Icon = session.icon;
            return (
              <div
                key={session.title}
                className={`group relative overflow-hidden rounded-3xl border-2 border-border ${session.borderColor} bg-card/70 backdrop-blur-xl p-10 transition-all duration-500 hover:shadow-2xl ${session.glowColor} hover:-translate-y-2 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4`}
                style={{ animationDelay: `${150 * (i + 1)}ms` }}
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${session.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Radial glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial ${session.gradient} blur-2xl`} />
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                </div>

                {/* Floating orbs */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10">
                  {/* Icon with breathing animation */}
                  <div className={`mb-6 ${session.iconColor} transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <div className="relative inline-block">
                      <Icon size={56} strokeWidth={1.5} className="relative z-10" />
                      {/* Icon glow */}
                      <div className={`absolute inset-0 ${session.iconColor} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`}>
                        <Icon size={56} strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>

                  {/* Title with gradient on hover */}
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4 group-hover:text-gradient transition-all duration-300">
                    {session.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-8 leading-relaxed text-base">
                    {session.desc}
                  </p>

                  {/* Button with enhanced hover */}
                  <div className="mt-auto">
                    <Button 
                      variant="neon" 
                      className="w-full transition-all duration-300 group-hover:translate-x-1 group-hover:shadow-lg group-hover:shadow-primary/50 relative overflow-hidden"
                      onClick={() => {
                        if (session.title === "Stress & Anxiety") {
                          navigate("/mind/stress-anxiety");
                        } else if (session.title === "Better Sleep") {
                          navigate("/mind/better-sleep");
                        } else {
                          navigate("/mind/coming-soon");
                        }
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Begin Session
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                      {/* Button shine effect */}
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </Button>
                  </div>
                </div>

                {/* Corner accent with pulse */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${session.gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-3xl animate-pulse`} />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '800ms' }}>
          <div className="bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-pink-500/10 rounded-2xl border border-border/50 p-8 md:p-12 backdrop-blur-xl max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gradient">
              Your Mental Health Matters
            </h3>
            <p className="text-muted-foreground mb-6 text-base md:text-lg">
              Take a few minutes each day to care for your mind. Small steps lead to lasting peace.
            </p>
            <Button 
              variant="neon" 
              size="lg" 
              className="shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => {
                const isLoggedIn = !!user;
                if (!isLoggedIn) {
                  navigate("/login");
                } else {
                  window.location.reload();
                }
              }}
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mind;

