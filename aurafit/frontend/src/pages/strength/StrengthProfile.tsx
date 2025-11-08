import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Award, TrendingUp, Target, Settings } from "lucide-react";
import { BottomNav } from "@/components/strength/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StrengthProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-to-b from-primary/10 to-background p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <Button variant="ghost" size="icon" onClick={() => navigate("/profile/edit")}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="h-12 w-12" />
              )}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold text-foreground">{user?.name || "Fitness Enthusiast"}</h2>
          <p className="text-muted-foreground">{user?.email || "Member since 2024"}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-card">
            <div className="text-2xl font-bold text-primary mb-1">24</div>
            <div className="text-xs text-muted-foreground">Workouts</div>
          </Card>
          <Card className="p-4 text-center bg-card">
            <div className="text-2xl font-bold text-primary mb-1">12</div>
            <div className="text-xs text-muted-foreground">Days Streak</div>
          </Card>
          <Card className="p-4 text-center bg-card">
            <div className="text-2xl font-bold text-primary mb-1">3.2</div>
            <div className="text-xs text-muted-foreground">Hours</div>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Achievements</h3>
          <div className="space-y-3">
            <Card className="p-4 flex items-center gap-4 bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">First Workout</h4>
                <p className="text-sm text-muted-foreground">Completed your first workout</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4 bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">7 Day Streak</h4>
                <p className="text-sm text-muted-foreground">Worked out for 7 days straight</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4 bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Goal Crusher</h4>
                <p className="text-sm text-muted-foreground">Reached your monthly goal</p>
              </div>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Settings</h3>
          <Card className="divide-y divide-border bg-card">
            <button 
              onClick={() => navigate("/profile/edit")}
              className="w-full p-4 text-left text-foreground hover:bg-accent transition-colors"
            >
              Edit Profile
            </button>
            <button className="w-full p-4 text-left text-foreground hover:bg-accent transition-colors">
              Notifications
            </button>
            <button className="w-full p-4 text-left text-foreground hover:bg-accent transition-colors">
              Privacy
            </button>
            <button 
              onClick={() => navigate("/strength")}
              className="w-full p-4 text-left text-foreground hover:bg-accent transition-colors"
            >
              Back to Workouts
            </button>
          </Card>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}

