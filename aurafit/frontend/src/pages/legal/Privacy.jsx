import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
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
          <span className="text-gradient">Privacy Policy</span>
        </h1>
        
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-display font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to AUrafit. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data and tell you about 
              your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-4">2. Data We Collect</h2>
            <p className="text-muted-foreground mb-4">We may collect, use, store and transfer different kinds of personal data about you:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Identity Data (name, username)</li>
              <li>Contact Data (email address, phone number)</li>
              <li>Profile Data (fitness goals, preferences, dietary restrictions)</li>
              <li>Usage Data (how you use our platform)</li>
              <li>Technical Data (IP address, browser type, device information)</li>
              <li>Fitness Data (workouts, nutrition logs, body metrics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-4">3. How We Use Your Data</h2>
            <p className="text-muted-foreground mb-4">We use your personal data to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Provide personalized AI workout and nutrition plans</li>
              <li>Track your fitness progress and goals</li>
              <li>Improve our AI models and services</li>
              <li>Send you important updates about your account</li>
              <li>Process payments and subscriptions</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-4">4. Data Security</h2>
            <p className="text-muted-foreground">
              We have implemented appropriate security measures to prevent your personal data from being 
              accidentally lost, used, accessed, altered, or disclosed. All data is encrypted in transit 
              and at rest using industry-standard protocols.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground mb-4">Under data protection laws, you have rights including:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Right to access your personal data</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to erase your data</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this privacy policy or our privacy practices, please contact us at:{" "}
              <a href="mailto:privacy@aurafit.com" className="text-primary hover:underline">
                privacy@aurafit.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
