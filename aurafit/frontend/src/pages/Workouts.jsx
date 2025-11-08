import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dumbbell, Zap, Activity, Flame, Heart, Wind, Loader2, AlertCircle } from "lucide-react";
import api, { handleApiError } from "@/api/client";
import { toast } from "@/hooks/use-toast";

const typeStyles = {
  strength: {
      icon: Dumbbell,
      gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
      borderColor: "group-hover:border-blue-400/50",
    iconColor: "text-blue-500",
    label: "Strength",
    description: "Build muscle and power with progressive overload routines.",
    },
  hiit: {
      icon: Zap,
      gradient: "from-yellow-500/20 via-yellow-400/10 to-transparent",
      borderColor: "group-hover:border-yellow-400/50",
    iconColor: "text-yellow-500",
    label: "HIIT",
    description: "Maximize fat burn and endurance with intervals.",
  },
  mobility: {
    icon: Activity,
    gradient: "from-green-500/20 via-green-400/10 to-transparent",
    borderColor: "group-hover:border-green-400/50",
    iconColor: "text-green-500",
    label: "Mobility",
    description: "Improve movement quality and reduce soreness.",
  },
  cardio: {
      icon: Heart,
      gradient: "from-red-500/20 via-red-400/10 to-transparent",
      borderColor: "group-hover:border-red-400/50",
    iconColor: "text-red-500",
    label: "Cardio",
    description: "Boost heart health and stamina.",
    },
  yoga: {
      icon: Wind,
      gradient: "from-purple-500/20 via-purple-400/10 to-transparent",
      borderColor: "group-hover:border-purple-400/50",
    iconColor: "text-purple-500",
    label: "Yoga",
    description: "Mindful movement for balance and inner calm.",
  },
  warmup: {
      icon: Flame,
      gradient: "from-orange-500/20 via-orange-400/10 to-transparent",
      borderColor: "group-hover:border-orange-400/50",
    iconColor: "text-orange-500",
    label: "Warmup",
    description: "Prime your body for peak performance.",
  },
};

const Workouts = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await api.get("/workouts");
        setWorkouts(Array.isArray(data) ? data : []);
        if (data && Array.isArray(data) && data.length > 0) {
          toast({ title: "Workouts synced", description: "Fetched the latest training library." });
        }
      } catch (err) {
        const message = handleApiError(err);
        const isBlocked = err?.code === "ERR_BLOCKED_BY_CLIENT" || 
                         err?.message?.includes("ERR_BLOCKED_BY_CLIENT");
        setError(isBlocked ? "Backend connection blocked. Please check if backend is running and disable ad blockers." : message);
        setWorkouts([]);
        // Only show toast if it's not a blocked request
        if (!isBlocked) {
          toast({ title: "Unable to load workouts", description: message, variant: "destructive" });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-center text-gradient">
            Smart Workouts
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Personalized workout plans with progress tracking, form cues, and adaptive intensity.
          </p>
        </div>

        <div className="flex items-center justify-between mt-12">
          <h2 className="text-2xl font-display font-semibold">Explore the catalog</h2>
          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
        </div>

        {error && (
          <div className="mt-6 p-6 border border-red-500/30 bg-red-500/10 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-200 mb-1">Unable to Load Workouts</h3>
                <p className="text-sm text-red-300/90 mb-3">{error}</p>
                {error.includes("blocked") && (
                  <div className="text-xs text-red-300/70 space-y-1">
                    <p>• Disable ad blockers for localhost</p>
                    <p>• Make sure backend is running: <code className="bg-red-500/20 px-1 rounded">cd backend && npm start</code></p>
                    <p>• Check backend is on port 5001</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && workouts.length === 0 && (
          <div className="mt-6 p-6 border border-border rounded-2xl bg-card/40 text-center">
            <p className="text-muted-foreground mb-2">No workouts available yet.</p>
            <p className="text-sm text-muted-foreground/70">Make sure backend is running and has workout data seeded.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {workouts.map((workout, i) => {
            const normalizedType = (workout.type || "strength").toLowerCase();
            const style = typeStyles[normalizedType] || typeStyles.strength;
            const Icon = style.icon;

            return (
              <div
                key={workout._id || workout.id || `${workout.title}-${i}`}
                className={`group relative overflow-hidden rounded-2xl border-2 border-border ${style.borderColor} bg-card/60 backdrop-blur-xl p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-2`}
                style={{ animationDelay: `${100 * (i + 1)}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className={`w-14 h-14 ${style.iconColor} transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}> 
                    <Icon size={48} strokeWidth={1.5} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{style.label}</p>
                    <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors duration-300">
                    {workout.title}
                  </h3>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {workout.description || style.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {workout.durationMin && (
                      <div className="rounded-xl bg-muted/30 border border-border/60 p-3">
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-semibold">{workout.durationMin} min</p>
                      </div>
                    )}
                    {workout.difficulty && (
                      <div className="rounded-xl bg-muted/30 border border-border/60 p-3 capitalize">
                        <p className="text-muted-foreground">Difficulty</p>
                        <p className="font-semibold">{workout.difficulty}</p>
                      </div>
                    )}
                  </div>

                  {Array.isArray(workout.exercises) && workout.exercises.length > 0 && (
                    <div className="rounded-2xl bg-muted/20 border border-border/60 p-4">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Exercises</p>
                      <ul className="space-y-2 text-sm">
                        {workout.exercises.slice(0, 4).map((exercise, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{exercise.name}</span>
                            <span className="text-muted-foreground">
                              {exercise.sets ? `${exercise.sets}x` : ""}
                              {exercise.reps ? `${exercise.reps}` : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                    <Button 
                      variant="neon" 
                      className="w-full transition-all duration-300 group-hover:translate-x-1 group-hover:shadow-lg"
                    onClick={() => {
                      if (normalizedType === "strength") {
                        navigate("/strength");
                      }
                    }}
                    >
                    {normalizedType === "strength" ? "Start Strength Training" : "Start session"}
                      <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Button>
                </div>

                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-2xl`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Workouts;
