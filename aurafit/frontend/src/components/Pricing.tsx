import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";

export const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Basic workout plans",
        "Exercise library access",
        "Progress tracking",
        "Community access",
        "3 AI-generated workouts/month",
      ],
      cta: "Start Free",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "₹499",
      period: "per month",
      description: "For serious athletes",
      features: [
        "Unlimited AI workouts",
        "Real-time pose detection",
        "Advanced nutrition tracking",
        "Unlimited AI meal plans",
        "Priority support",
        "Custom challenges",
        "Progress analytics",
        "Ad-free experience",
      ],
      cta: "Start Pro Trial",
      variant: "hero" as const,
      popular: true,
    },
    {
      name: "Coach",
      price: "₹1,999",
      period: "per month",
      description: "For fitness professionals",
      features: [
        "Everything in Pro",
        "Client management dashboard",
        "Custom plan templates",
        "Group coaching tools",
        "White-label branding",
        "Revenue sharing",
        "Analytics & reporting",
        "Dedicated support",
      ],
      cta: "Start Coach Trial",
      variant: "neon" as const,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Simple, Transparent Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you're ready. All plans include 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl bg-gradient-card border transition-all hover:scale-105 ${
                plan.popular 
                  ? 'border-primary shadow-neon' 
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-primary text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-display font-bold text-gradient">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>

                <Button 
                  variant={plan.variant} 
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3 pt-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground mt-12">
          All plans include 14-day free trial • No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
};
