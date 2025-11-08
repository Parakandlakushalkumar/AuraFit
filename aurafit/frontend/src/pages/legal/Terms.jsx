import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
          <span className="text-gradient">Terms & Conditions</span>
        </h1>
        
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-display font-bold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using AUrafit, you agree to be bound by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-4">2. User Accounts</h2>
            <p className="text-muted-foreground">
              You are responsible for maintaining the confidentiality of your account information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-4">3. Subscriptions</h2>
            <p className="text-muted-foreground">
              Some features require a paid subscription. Billing terms will be presented during checkout.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-4">4. Disclaimer</h2>
            <p className="text-muted-foreground">
              AUrafit is not a substitute for professional medical advice. Consult a physician before starting any program.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
