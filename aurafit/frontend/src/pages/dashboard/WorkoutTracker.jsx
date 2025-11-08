import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Flame, Clock, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import api, { handleApiError } from "@/api/client";

const WORKOUT_TYPES = [
  'walking', 'running', 'cycling', 'swimming', 'strength', 'hiit', 
  'yoga', 'pilates', 'cardio', 'crossfit', 'dance', 'boxing'
];

const WorkoutTracker = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    workoutType: '',
    durationMin: '',
    notes: '',
    intensity: 'medium',
  });

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    setIsLoading(true);
    try {
      const { data } = await api.get(`/workout/log/${userId}`);
      if (data.success) {
        setLogs(data.logs || []);
        setSummary(data.summary);
      }
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = user?._id || user?.id;
    if (!userId) {
      toast({
        title: "Please login",
        description: "You need to be logged in to log workouts.",
        variant: "destructive",
      });
      return;
    }

    if (!formState.workoutType || !formState.durationMin) {
      toast({
        title: "Missing fields",
        description: "Please select workout type and duration.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/workout/log", {
        userId,
        workoutType: formState.workoutType,
        durationMin: Number(formState.durationMin),
        notes: formState.notes,
        intensity: formState.intensity,
        userWeight: user.weight || 70,
      });

      toast({
        title: "Workout logged!",
        description: "Your workout has been saved successfully.",
      });

      setFormState({ workoutType: '', durationMin: '', notes: '', intensity: 'medium' });
      fetchLogs();
    } catch (err) {
      toast({
        title: "Logging failed",
        description: handleApiError(err),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteLog = async (logId) => {
    try {
      await api.delete(`/workout/log/${logId}`);
      toast({ title: "Log deleted" });
      fetchLogs();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: handleApiError(err),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Workout Tracker
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Log your workouts and track calories burned
          </p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Workouts</p>
                    <p className="text-3xl font-bold text-primary">{summary.totalWorkouts}</p>
                  </div>
                  <Activity className="w-12 h-12 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Calories</p>
                    <p className="text-3xl font-bold text-primary">{summary.totalCaloriesBurned}</p>
                  </div>
                  <Flame className="w-12 h-12 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Duration</p>
                    <p className="text-3xl font-bold text-primary">{summary.totalDuration} min</p>
                  </div>
                  <Clock className="w-12 h-12 text-primary opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          {/* Log Form */}
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-primary" />
                Log Workout
              </CardTitle>
              <CardDescription>Record your workout session</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workoutType">Workout Type</Label>
                  <Select
                    value={formState.workoutType}
                    onValueChange={(value) => setFormState(prev => ({ ...prev, workoutType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select workout type" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORKOUT_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="durationMin">Duration (min)</Label>
                    <Input
                      id="durationMin"
                      type="number"
                      min="1"
                      value={formState.durationMin}
                      onChange={(e) => setFormState(prev => ({ ...prev, durationMin: e.target.value }))}
                      placeholder="30"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intensity">Intensity</Label>
                    <Select
                      value={formState.intensity}
                      onValueChange={(value) => setFormState(prev => ({ ...prev, intensity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={formState.notes}
                    onChange={(e) => setFormState(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="How did it feel? Any observations?"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  variant="neon"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Log Workout
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Logs List */}
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Recent Workouts</CardTitle>
              <CardDescription>Your workout history</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No workouts logged yet. Start tracking your progress!
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log._id}
                      className="rounded-xl border border-border bg-card/60 p-4 flex items-center justify-between hover:border-primary/50 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Activity className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold capitalize">{log.workoutType}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {log.durationMin} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Flame className="w-3 h-3" />
                                {log.caloriesBurned} cal
                              </span>
                              <span className="capitalize">{log.intensity}</span>
                            </div>
                            {log.notes && (
                              <p className="text-xs text-muted-foreground mt-1">{log.notes}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(log.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLog(log._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTracker;

