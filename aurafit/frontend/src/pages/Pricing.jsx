import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import api, { handleApiError } from "@/api/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

const Pricing = () => {
  const [tiers, setTiers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPricing = async () => {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await api.get("/pricing");
        setTiers(Array.isArray(data) ? data : []);
        if (data && Array.isArray(data) && data.length > 0) {
          toast({ title: "Pricing loaded", description: "Updated plans fetched from backend." });
        }
      } catch (err) {
        const message = handleApiError(err);
        const isBlocked = err?.code === "ERR_BLOCKED_BY_CLIENT" || 
                         err?.message?.includes("ERR_BLOCKED_BY_CLIENT");
        setError(isBlocked ? "Backend connection blocked. Please check if backend is running." : message);
        setTiers([]);
        if (!isBlocked) {
          toast({ title: "Unable to load pricing", description: message, variant: "destructive" });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricing();
  }, []);

  const decoratedTiers = useMemo(
    () =>
      tiers.map((tier, index) => ({
        ...tier,
        featured: index === 1 || tier.featured,
      })),
    [tiers],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-center text-gradient">
            Pricing
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Choose a plan that fits your journey. Switch or cancel anytime.
          </p>
        </div>

        <div className="flex items-center justify-between mt-12">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-display font-semibold">Memberships</h2>
          </div>
          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
        </div>

        {error && (
          <div className="mt-6 p-4 border border-red-500/30 bg-red-500/10 text-sm rounded-xl text-red-200">
            {error}
          </div>
        )}

        {!isLoading && !error && decoratedTiers.length === 0 && (
          <div className="mt-6 p-6 border border-border rounded-2xl bg-card/40 text-center text-muted-foreground">
            Pricing data is not available yet. Seed the backend to preview plans.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {decoratedTiers.map((tier, i) => (
            <div
              key={tier.name || `tier-${i}`}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 transition-all hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2 duration-700 ${
                tier.featured ? "ring-2 ring-primary" : ""
              }`}
              style={{ animationDelay: `${100 * (i + 1)}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold">{tier.name}</h3>
                  {tier.featured && (
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-xs uppercase tracking-widest text-primary">
                      Popular
                    </span>
                  )}
                </div>
                <div className="text-4xl font-bold">
                  {typeof tier.price === "number" ? `$${tier.price}/mo` : tier.price}
                </div>
                {tier.desc && <p className="text-muted-foreground">{tier.desc}</p>}
                {Array.isArray(tier.features) && tier.features.length > 0 && (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Button variant="neon" className="w-full transition-transform group-hover:translate-x-1">
                  {tier.cta || `Choose ${tier.name}`}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
