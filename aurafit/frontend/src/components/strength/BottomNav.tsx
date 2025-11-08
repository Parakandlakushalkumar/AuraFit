import { Home, Dumbbell, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/strength" },
  { icon: Dumbbell, label: "Workouts", path: "/strength" },
  { icon: TrendingUp, label: "Progress", path: "/strength" },
  { icon: User, label: "Profile", path: "/strength/profile" },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-[0_-2px_8px_hsl(var(--shadow-card))]">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around h-20">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path === "/strength" && location.pathname.startsWith("/strength") && !location.pathname.includes("/profile") && !location.pathname.includes("/workout"));
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-200",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "transition-transform duration-200",
                  isActive && "scale-110"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

