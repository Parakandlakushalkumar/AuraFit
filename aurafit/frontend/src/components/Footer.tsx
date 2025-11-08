import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export const Footer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (user) {
      // Show popup in dashboard if logged in
      setShowSubscribeDialog(true);
      toast({
        title: "Subscribed!",
        description: "You'll receive updates in your dashboard.",
      });
    } else {
      toast({
        title: "Subscribed!",
        description: "Check your email for updates.",
      });
    }
    setEmail("");
  };
  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "FAQ", href: "#faq" },
        { name: "Roadmap", href: "#roadmap" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Blog", href: "#blog" },
        { name: "Press Kit", href: "#press" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "Guides", href: "#guides" },
        { name: "API", href: "#api" },
        { name: "Support", href: "#support" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/legal/privacy" },
        { name: "Terms of Service", href: "/legal/terms" },
        { name: "Cookie Policy", href: "/legal/cookies" },
        { name: "GDPR", href: "/legal/gdpr" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <img src={logo} alt="AUrafit" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-display font-bold text-gradient">AUrafit</span>
            </div>
            <p className="text-muted-foreground max-w-xs">
              Train Smarter. Glow Stronger. AI-powered fitness platform for the next generation of athletes.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors group"
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="font-display font-bold text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="py-8 border-t border-border">
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <h4 className="font-display font-bold">Stay Updated</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Get the latest fitness tips, product updates, and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button type="submit" className="px-6 py-2 rounded-lg bg-gradient-primary text-foreground font-semibold hover:scale-105 transition-transform">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AUrafit. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with 💜 by the AUrafit Team
          </p>
        </div>
      </div>

      {/* Subscribe Dialog for logged-in users */}
      <Dialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to AuraFit Updates!</DialogTitle>
            <DialogDescription>
              You're now subscribed to receive the latest fitness tips, product updates, and exclusive offers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowSubscribeDialog(false)}>
              Close
            </Button>
            <Button onClick={() => { setShowSubscribeDialog(false); navigate("/dashboard/progress"); }}>
              Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};
