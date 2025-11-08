import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, Flame, Target, Zap, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import api, { handleApiError } from "@/api/client";

const Progress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (userId) {
      fetchProgress();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchProgress = async () => {
    const userId = user?._id || user?.id;
    if (!userId) {
      toast({
        title: "Please login",
        description: "You need to be logged in to view progress.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Try detailed endpoint first, fallback to basic
      try {
        const { data } = await api.get(`/progress/${userId}/detailed`);
        if (data.success) {
          setProgress(data);
          return;
        }
      } catch {
        // Fallback to basic progress
      }
      
      const { data } = await api.get(`/progress/${userId}`);
      if (data.success) {
        setProgress(data);
      }
    } catch (err) {
      const message = handleApiError(err);
      toast({
        title: "Failed to load progress",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Please login to view your progress</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No progress data available yet</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Progress Analytics
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Track your fitness journey and see your improvements over time
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Workouts Completed</p>
                  <p className="text-3xl font-bold text-primary">{progress.workoutsCompleted || 0}</p>
                </div>
                <Target className="w-12 h-12 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Calories Burned</p>
                  <p className="text-3xl font-bold text-primary">{progress.avgCaloriesBurned || 0}</p>
                </div>
                <Flame className="w-12 h-12 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pose Accuracy</p>
                  <p className="text-3xl font-bold text-primary">{progress.avgPoseAccuracy || 0}%</p>
                </div>
                <Target className="w-12 h-12 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total XP</p>
                  <p className="text-3xl font-bold text-primary">{progress.xp || 0}</p>
                </div>
                <Zap className="w-12 h-12 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calories In vs Out */}
          {progress.weeklyGraph && progress.weeklyGraph.length > 0 ? (
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Calories In vs Out (Last 7 Days)</CardTitle>
                <CardDescription>Track your calorie balance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progress.weeklyGraph}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="caloriesIn" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Calories In" />
                    <Bar dataKey="caloriesOut" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} name="Calories Out" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Workouts (Last 7 Days)</CardTitle>
                <CardDescription>Number of workouts completed per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progress.last7Days || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="workouts" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Calories Chart */}
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Calories Burned (Last 7 Days)</CardTitle>
              <CardDescription>Daily calorie burn tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progress.last7Days || progress.weeklyGraph || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={progress.weeklyGraph ? "caloriesOut" : "calories"}
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats if available */}
        {progress.streakDays !== undefined && (
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Activity Streak</CardTitle>
              <CardDescription>Consecutive days with logged activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-5xl font-bold text-primary mb-2">{progress.streakDays}</p>
                <p className="text-muted-foreground">days in a row! 🔥</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Your overall fitness statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted/40">
                <p className="text-sm text-muted-foreground">Total Workouts</p>
                <p className="text-2xl font-bold">{progress.totalWorkouts || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/40">
                <p className="text-sm text-muted-foreground">Total Calories</p>
                <p className="text-2xl font-bold">{progress.totalCaloriesBurned || 0}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/40">
                <p className="text-sm text-muted-foreground">Average Accuracy</p>
                <p className="text-2xl font-bold">{progress.avgPoseAccuracy || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;

