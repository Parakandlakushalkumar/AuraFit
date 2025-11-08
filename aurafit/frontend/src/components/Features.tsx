import { Brain, Camera, Trophy, Users, LineChart, Sparkles, Dumbbell, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Features = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "AI Workout Generation",
      description: "Personalized training plans adapted to your goals, equipment, and experience level.",
      color: "text-primary",
      route: "/ai-generator",
      requiresAuth: true,
    },
    {
      icon: Camera,
      title: "Real-Time Pose Detection",
      description: "Get instant feedback on your form with advanced pose tracking technology.",
      color: "text-secondary",
      route: "/pose-detection",
      requiresAuth: true,
    },
    {
      icon: Sparkles,
      title: "Smart Nutrition",
      description: "AI-powered meal plans and macro tracking tailored to your dietary preferences.",
      color: "text-success",
      route: "/nutrition",
      requiresAuth: false,
    },
    {
      icon: Trophy,
      title: "Challenges & Gamification",
      description: "Join community challenges, earn XP, unlock badges, and climb leaderboards.",
      color: "text-accent",
      route: "/challenges",
      requiresAuth: true,
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with athletes worldwide, share progress, and motivate each other.",
      color: "text-primary",
      route: "/community",
      requiresAuth: false,
    },
    {
      icon: LineChart,
      title: "Progress Analytics",
      description: "Track your journey with detailed metrics, charts, and performance insights.",
      color: "text-secondary",
      route: "/planner",
      requiresAuth: true,
      tab: "tracker",
    },
  ];

  const handleFeatureClick = (feature) => {
    if (feature.requiresAuth && !user) {
      navigate("/login");
      return;
    }
    if (feature.tab) {
      navigate(`${feature.route}?tab=${feature.tab}`);
    } else {
      navigate(feature.route);
    }
  };

  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
   {/* Dynamic background effects */}
   <div className="absolute inset-0 w-full h-full">
     <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/30 via-purple-500/20 to-transparent blur-3xl animate-pulse" 
       style={{ animationDuration: '8s' }} />
     <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/30 via-blue-500/20 to-transparent blur-3xl animate-pulse" 
       style={{ animationDuration: '10s', animationDelay: '1s' }} />
     <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-float" />
     <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-float" 
       style={{ animationDelay: '2s' }} />
   </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Cutting-Edge Technology</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Everything You Need to
            <br />
            <span className="text-gradient">Dominate Your Goals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Combine AI intelligence, real-time coaching, and community support for the ultimate fitness experience.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => handleFeatureClick(feature)}
              className="group p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/30 transition-all hover:shadow-neon cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Feature showcases */}
        <div className="space-y-20">
          {/* Workout showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-display font-bold">
                AI-Powered
                <br />
                <span className="text-gradient">Workout Intelligence</span>
              </h3>
              <p className="text-lg text-muted-foreground">
                Our advanced AI analyzes your profile, goals, and available equipment to generate perfectly optimized workout plans. 
                Progressive overload, periodization, and recovery — all handled automatically.
              </p>
              <ul className="space-y-3">
                {["Adaptive difficulty progression", "Equipment-based customization", "Real-time form feedback", "Performance tracking"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl animate-pulse" />
              <div className="relative z-10 rounded-2xl shadow-card border border-border bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 p-8 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-2xl animate-pulse" />
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />
                </div>
                
                {/* Content */}
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white">AI-Powered Training</h4>
                      <p className="text-purple-200">Personalized just for you</p>
                    </div>
                  </div>
                  
                  {/* Stats cards */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-primary/50 transition-all hover:scale-105">
                      <div className="text-3xl font-bold text-gradient">95%</div>
                      <div className="text-sm text-purple-200">Strength Gain</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-primary/50 transition-all hover:scale-105">
                      <div className="text-3xl font-bold text-gradient">10k+</div>
                      <div className="text-sm text-purple-200">Workouts</div>
                    </div>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-purple-200">Weekly Progress</span>
                      <span className="text-sm font-bold text-primary">78%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full w-3/4 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 blur-3xl rounded-3xl animate-pulse" />
              <div className="relative z-10 rounded-2xl shadow-card border border-border bg-gradient-to-br from-slate-900 via-emerald-900/50 to-slate-900 p-8 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-10 right-10 w-32 h-32 bg-green-500 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute bottom-10 left-10 w-40 h-40 bg-emerald-500 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.5s'}} />
                </div>
                
                {/* Content */}
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white">Smart Nutrition</h4>
                      <p className="text-emerald-200">Track every macro</p>
                    </div>
                  </div>
                  
                  {/* Macro cards */}
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-green-500/50 transition-all hover:scale-105">
                      <div className="text-2xl font-bold text-green-400">2.1k</div>
                      <div className="text-xs text-emerald-200">Calories</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-green-500/50 transition-all hover:scale-105">
                      <div className="text-2xl font-bold text-emerald-400">180g</div>
                      <div className="text-xs text-emerald-200">Protein</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:border-green-500/50 transition-all hover:scale-105">
                      <div className="text-2xl font-bold text-teal-400">65g</div>
                      <div className="text-xs text-emerald-200">Fats</div>
                    </div>
                  </div>
                  
                  {/* Meal plan indicator */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-emerald-200">Today's Nutrition</span>
                      <span className="text-sm font-bold text-green-400">On Track ✓</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-5/6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h3 className="text-3xl md:text-4xl font-display font-bold">
                Nutrition That
                <br />
                <span className="text-gradient">Fuels Performance</span>
              </h3>
              <p className="text-lg text-muted-foreground">
                Track macros with precision, generate meal plans that match your preferences, and visualize your nutrition journey. 
                Whether bulking, cutting, or maintaining — we've got you covered.
              </p>
              <ul className="space-y-3">
                {["AI meal plan generation", "Macro & calorie tracking", "Dietary preference support", "Recipe database"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
