import { useEffect, useState } from "react";
import StopwatchTimer from "@/components/StopwatchTimer.jsx";
import { NavLink } from "@/components/NavLink";
import { Heart, Activity, Music2, Target, Moon, Users, Dumbbell, Apple } from "lucide-react";

const ExerciseCard = ({ title, description, icon: Icon, imagePath }) => {
  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-6 shadow-card hover:shadow-2xl transition-all hover:-translate-y-1">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary"><Icon size={20} aria-hidden /></div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="aspect-video w-full rounded-lg border border-border mb-4 overflow-hidden bg-muted/30 flex items-center justify-center">
        <img
          src={imagePath}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      <StopwatchTimer duration={30} />
    </div>
  );
};

const MindBetterSleep = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-indigo-950/5 to-muted/30">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-28 pb-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-gradient">Deep Rest Toolkit: Unlock Better Sleep.</h1>
          <p className="mt-4 text-muted-foreground">
            Evening practices to quiet your mind and guide your body into restful sleep.
          </p>
        </div>
      </section>

      {/* Section 1: Sleep Breathing */}
      <section className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Rhythmic Release: Breathing for Rest</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExerciseCard
            title="4-7-8 Sleep Breath"
            description="Inhale 4, Hold 7, Exhale 8. The classic relaxing breath to sedate the nervous system."
            icon={Heart}
            imagePath="/src/assets/images/mind/sleep_478.png"
          />
          <ExerciseCard
            title="Belly Sleep Focus"
            description="Focus on deep, slow breaths into the abdomen. Keep the chest still for maximum calm."
            icon={Activity}
            imagePath="/src/assets/images/mind/sleep_belly.png"
          />
          <ExerciseCard
            title="Humming Bee (5s)"
            description="Inhale, then exhale slowly for 5 seconds while making a gentle, low humming sound."
            icon={Music2}
            imagePath="/src/assets/images/mind/sleep_humming.png"
          />
        </div>
      </section>

      {/* Section 2: Pre-Sleep Mindfulness */}
      <section className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Quick Winding Down Activities</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExerciseCard
            title="Quick Head-to-Toe Scan"
            description="30-second check: rapidly notice and relax one muscle group after another, starting from your feet."
            icon={Target}
            imagePath="/src/assets/images/mind/sleep_bodyscan.png"
          />
          <ExerciseCard
            title="30-Second Gratitude"
            description="Mentally list three small things from the day you are genuinely grateful for."
            icon={Moon}
            imagePath="/src/assets/images/mind/sleep_gratitude.png"
          />
          <ExerciseCard
            title="Mantra Anchor"
            description="Silently repeat a single calming word (e.g., 'Calm,' 'Rest') with each inhale/exhale."
            icon={Moon}
            imagePath="/src/assets/images/mind/sleep_mantra.png"
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

export default MindBetterSleep;
