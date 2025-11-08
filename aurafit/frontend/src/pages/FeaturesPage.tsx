import { Features } from "@/components/Features";
// Navbar and Footer are provided by MainLayout
import { motion } from "framer-motion";
import { Brain, Camera, Sparkles, Trophy, Users, LineChart, Shield, Zap } from "lucide-react";

const Section = ({ children }: { children: React.ReactNode }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="relative"
  >
    {children}
  </motion.section>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-muted-foreground">
    {children}
  </span>
);

const FeaturesPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-20 w-[520px] h-[520px] bg-gradient-to-br from-primary/30 via-purple-500/20 to-transparent blur-3xl animate-pulse" style={{ animationDuration: "9s" }} />
        <div className="absolute bottom-0 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-secondary/30 via-cyan-500/20 to-transparent blur-3xl animate-pulse" style={{ animationDuration: "12s", animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 pt-28 pb-16">
        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex justify-center mb-4">
            <Pill>All-In-One AI Fitness Platform</Pill>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            Explore Every <span className="text-gradient">Aura-Fit Feature</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            From AI coaching and pose detection to nutrition insights and community challenges—everything you need to reach your goals, in one place.
          </p>
        </motion.div>

        {/* The existing feature grid/sections */}
        <Section>
          <Features />
        </Section>

        {/* Deep-dive sections */}
        <div className="mt-20 space-y-20">
          {/* AI Coaching */}
          <Section>
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <div className="flex items-center gap-2"><Brain className="w-5 h-5 text-primary" /><Pill>AI Coaching</Pill></div>
                <h2 className="text-3xl md:text-4xl font-display font-bold">Personalized Plans that Learn You</h2>
                <ul className="grid gap-3 text-muted-foreground">
                  <li>• Dynamic programs tailored to goals, schedule, and equipment</li>
                  <li>• Automatic progression with deload weeks and recovery guidance</li>
                  <li>• Smart form cues to keep every rep safe and effective</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-card/70 border border-border">Beginner → Advanced pathways</div>
                  <div className="p-4 rounded-xl bg-card/70 border border-border">Goal-specific templates</div>
                  <div className="p-4 rounded-xl bg-card/70 border border-border">Adaptive difficulty</div>
                  <div className="p-4 rounded-xl bg-card/70 border border-border">Weekly check-ins</div>
                </div>
              </div>
            </div>
          </Section>

          {/* Pose Detection */}
          <Section>
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1 rounded-2xl border border-border bg-gradient-to-br from-secondary/10 to-transparent p-6">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-card/70 border border-border">Posture scoring</div>
                  <div className="p-4 rounded-xl bg-card/70 border border-border">Reps counter</div>
                  <div className="p-4 rounded-xl bg-card/70 border border-border">Real-time tips</div>
                  <div className="p-4 rounded-xl bg-card/70 border border-border">Injury prevention cues</div>
                  <div className="p-4 rounded-xl bg-card/70 border border-border">Camera privacy mode</div>
                  <div className="p-4 rounded-xl bg-card/70 border border-border">Export session log</div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-5">
                <div className="flex items-center gap-2"><Camera className="w-5 h-5 text-secondary" /><Pill>Pose Detection</Pill></div>
                <h2 className="text-3xl md:text-4xl font-display font-bold">Real-Time Form Feedback</h2>
                <p className="text-muted-foreground">Instant visual guidance keeps your technique clean, your joints safe, and your progress consistent.</p>
              </div>
            </div>
          </Section>

          {/* Smart Nutrition */}
          <Section>
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /><Pill>Smart Nutrition</Pill></div>
                <h2 className="text-3xl md:text-4xl font-display font-bold">Macros, Meals, and Momentum</h2>
                <ul className="grid gap-3 text-muted-foreground">
                  <li>• AI-curated meal plans by cuisine and diet preference</li>
                  <li>• Macro targets that adjust with training load</li>
                  <li>• Grocery lists and quick-swap alternatives</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-card/70 border border-border">Smart macro targets</div>
                  <div className="p-4 rounded-xl bg-card/70 border border-border">Recipe generator</div>
                  <div className="p-4 rounded-xl bg-card/70 border border-border">Meal reminders</div>
                  <div className="p-4 rounded-xl bg-card/70 border border-border">Shopping lists</div>
                </div>
              </div>
            </div>
          </Section>

          {/* Community & Gamification */}
          <Section>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-border p-6 bg-card/70">
                <div className="flex items-center gap-3 mb-3 text-primary"><Trophy className="w-5 h-5" /><h3 className="font-semibold">Challenges</h3></div>
                <p className="text-sm text-muted-foreground">Join themed challenges, earn XP, and unlock badges as you level up.</p>
              </div>
              <div className="rounded-2xl border border-border p-6 bg-card/70">
                <div className="flex items-center gap-3 mb-3 text-secondary"><Users className="w-5 h-5" /><h3 className="font-semibold">Community</h3></div>
                <p className="text-sm text-muted-foreground">Share progress, get feedback, and train with global peers.</p>
              </div>
              <div className="rounded-2xl border border-border p-6 bg-card/70">
                <div className="flex items-center gap-3 mb-3 text-accent"><LineChart className="w-5 h-5" /><h3 className="font-semibold">Analytics</h3></div>
                <p className="text-sm text-muted-foreground">Visualize performance trends with beautiful charts and metrics.</p>
              </div>
            </div>
          </Section>

          {/* Trust & Speed */}
          <Section>
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /><Pill>Privacy & Security</Pill></div>
                <h2 className="text-3xl md:text-4xl font-display font-bold">You're in Control</h2>
                <p className="text-muted-foreground">Privacy-first design with transparent controls. Your data stays yours.</p>
              </div>
              <div className="space-y-5">
                <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-secondary" /><Pill>Performance</Pill></div>
                <h2 className="text-3xl md:text-4xl font-display font-bold">Fast. Smooth. Reliable.</h2>
                <p className="text-muted-foreground">Optimized UI, offline-ready tips, and resilient API integration for a seamless experience.</p>
              </div>
            </div>
          </Section>

          {/* FAQs */}
          <Section>
            <div className="rounded-2xl border border-border p-6 bg-card/70">
              <h3 className="text-2xl font-display font-bold mb-4">FAQs</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground mb-1">Do I need equipment?</p>
                  <p>Not required. We support bodyweight, bands, and full gym options.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Can I use it offline?</p>
                  <p>Yes. The chatbot provides smart tips even when the server is down.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">Is my data safe?</p>
                  <p>We follow privacy-first principles and never share your data without consent.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground mb-1">How are plans generated?</p>
                  <p>Plans adapt to your goals, schedule, and progress with built-in progression.</p>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* CTA */}
        <Section>
          <div className="text-center mt-20">
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-3">Ready to elevate your training?</h3>
            <p className="text-muted-foreground mb-6">Start free today and unlock AI-powered fitness coaching.</p>
            <a href="/signup" className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-medium hover:shadow-neon transition">Get Started</a>
          </div>
        </Section>
      </div>

    </div>
  );
};

export default FeaturesPage;
