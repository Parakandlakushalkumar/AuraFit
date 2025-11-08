import { useEffect, useState } from "react";
import StopwatchTimer from "@/components/StopwatchTimer.jsx";
import { NavLink } from "@/components/NavLink";
import { Heart, Zap, Users, Dumbbell, Apple, Leaf, Square, Target, Eye, User as UserIcon, Activity } from "lucide-react";

const ExerciseCard = ({ title, description, icon: Icon, imagePath }) => {
  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 shadow-card hover:shadow-2xl transition-all hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary"><Icon size={20} aria-hidden /></div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="aspect-video w-full rounded-lg border border-border mb-4 overflow-hidden bg-muted/30 flex items-center justify-center">
        {/* graceful image area */}
        <img
          src={imagePath}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute opacity-40" aria-hidden>
          <Square />
        </div>
      </div>
      <StopwatchTimer duration={30} />
    </div>
  );
};

const MindStressAnxiety = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-indigo-950/5 to-muted/30">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-28 pb-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-gradient">Stress & Anxiety Toolkit: Find Your Calm.</h1>
          <p className="mt-4 text-muted-foreground">
            Quick, guided exercises designed for immediate relief. Every moment matters.
          </p>
        </div>
      </section>

      {/* Section 1: Breathing */}
      <section className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Deep Breaths: Reset Your Nervous System</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExerciseCard
            title="Box Breathing (4s)"
            description="Inhale, hold, exhale, hold—all for four seconds. A powerful anchor."
            icon={Square}
            imagePath="/src/assets/images/mind/box_breathing.png"
          />
          <ExerciseCard
            title="4-7-8 Relaxation"
            description="Inhale 4, Hold 7, Exhale 8. The ultimate natural tranquilizer."
            icon={Heart}
            imagePath="/src/assets/images/mind/four_seven_eight.png"
          />
          <ExerciseCard
            title="Deep Belly Focus"
            description="Breathe into your stomach, not your chest. Slow and steady wins."
            icon={Activity}
            imagePath="/src/assets/images/mind/diaphragmatic.png"
          />
        </div>
      </section>

      {/* Section 2: Grounding */}
      <section className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Grounding Time Outs: Shift Your Focus</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExerciseCard
            title="5-4-3-2-1 Grounding"
            description="Identify 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste."
            icon={Eye}
            imagePath="/src/assets/images/mind/five_senses.png"
          />
          <ExerciseCard
            title="Single Point Focus"
            description="Find a non-moving object and focus only on it for 30 seconds."
            icon={Target}
            imagePath="/src/assets/images/mind/focused_gaze.png"
          />
          <ExerciseCard
            title="30-Second Body Check"
            description="Starting from your toes, quickly notice and relax any tension you find."
            icon={UserIcon}
            imagePath="/src/assets/images/mind/body_scan.png"
          />
        </div>
      </section>

      {/* Further Resources */}
      <section className="container mx-auto px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Beyond the 30 Seconds: Continued Wellness</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-border bg-primary/10 p-6">
            <div className="flex items-center gap-3 mb-3 text-primary"><Users size={20} aria-hidden />
              <h3 className="font-semibold">Connect with Others.</h3>
            </div>
            <NavLink to="/community" className="inline-flex items-center gap-2 text-sm font-medium">
              Go to Community <span aria-hidden>→</span>
            </NavLink>
          </div>
          <div className="rounded-xl border border-border bg-secondary/10 p-6">
            <div className="flex items-center gap-3 mb-3 text-secondary"><Dumbbell size={20} aria-hidden />
              <h3 className="font-semibold">Physical Release.</h3>
            </div>
            <NavLink to="/workouts" className="inline-flex items-center gap-2 text-sm font-medium">
              Explore Workouts <span aria-hidden>→</span>
            </NavLink>
          </div>
          <div className="rounded-xl border border-border bg-accent/10 p-6">
            <div className="flex items-center gap-3 mb-3 text-accent"><Apple size={20} aria-hidden />
              <h3 className="font-semibold">Fuel Your Mind.</h3>
            </div>
            <NavLink to="/nutrition" className="inline-flex items-center gap-2 text-sm font-medium">
              View Nutrition <span aria-hidden>→</span>
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MindStressAnxiety;
