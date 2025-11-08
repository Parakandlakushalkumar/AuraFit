import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from "recharts";
import api, { handleApiError } from "@/api/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Calendar, Flame } from "lucide-react";

const Tracker = () => {
  const { user } = useAuth();
  const [trackerData, setTrackerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("total");

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchTrackerData();
    }
  }, [user, period]);

  const fetchTrackerData = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    setIsLoading(true);
    try {
      const { data } = await api.get(`/tracker/${userId}?period=${period}`);
      if (data.success) {
        setTrackerData(data);
      }
    } catch (err) {
      console.error("Failed to fetch tracker data:", err);
      toast({
        title: "Unable to load tracker data",
        description: handleApiError(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trackerData) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No tracker data available. Complete some workouts to see your progress!</p>
      </div>
    );
  }

  // Prepare data for charts
  const chartData = trackerData.bodyPartStats.map((stat) => ({
    name: stat.displayName,
    workouts: stat.workouts,
    duration: stat.totalDuration,
    calories: stat.totalCalories,
  }));

  const radialData = trackerData.bodyPartStats.map((stat) => ({
    name: stat.displayName,
    value: stat.progressPercentage,
    fill: `hsl(var(--primary))`,
  }));

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Body Part Analytics</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="total">Total</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-primary/20 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Workouts</p>
                <p className="text-3xl font-bold text-primary">{trackerData.totalWorkouts}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Duration</p>
                <p className="text-3xl font-bold text-primary">{trackerData.summary.totalDuration} min</p>
              </div>
              <Calendar className="w-12 h-12 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Calories</p>
                <p className="text-3xl font-bold text-primary">{trackerData.summary.totalCalories}</p>
              </div>
              <Flame className="w-12 h-12 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="border-2 border-primary/20 bg-card/50">
          <CardHeader>
            <CardTitle>Workouts by Body Part</CardTitle>
            <CardDescription>Number of workouts completed for each body part</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
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

        {/* Radial Chart */}
        <Card className="border-2 border-primary/20 bg-card/50">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>Training distribution across body parts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={radialData}>
                <RadialBar dataKey="value" cornerRadius={10} fill="hsl(var(--primary))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Body Part Cards with Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {trackerData.bodyPartStats.map((stat) => (
          <Card key={stat.name} className="border-2 border-primary/20 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">{stat.displayName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Circular Progress */}
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - stat.progressPercentage / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{stat.progressPercentage}%</span>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Workouts:</span>
                  <span className="font-semibold">{stat.workouts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">{stat.totalDuration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Calories:</span>
                  <span className="font-semibold">{stat.totalCalories}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{stat.progressPercentage}%</span>
                </div>
                <Progress value={stat.progressPercentage} className="h-2" />
              </div>

              {/* Last Workout */}
              {stat.lastWorkout && (
                <p className="text-xs text-muted-foreground text-center">
                  Last: {new Date(stat.lastWorkout).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tracker;

