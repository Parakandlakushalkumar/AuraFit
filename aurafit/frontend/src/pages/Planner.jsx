import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import api, { handleApiError } from "@/api/client";
import { toast } from "@/hooks/use-toast";
import { CalendarDays, Check, Loader2, PlusCircle, Trash2, Sparkles, Calendar, Clock, Activity } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Tracker from "@/components/Tracker";

const Planner = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "planner";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(false);
  const [plans, setPlans] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [suggestedPlans, setSuggestedPlans] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [viewPeriod, setViewPeriod] = useState("weekly");
  const [formState, setFormState] = useState({
    workoutId: "",
    date: "",
    notes: "",
    durationMin: "",
  });

  const sortedPlans = useMemo(
    () =>
      [...plans].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [plans],
  );

  const fetchWorkouts = async () => {
    setIsLoadingWorkouts(true);
    try {
      const { data } = await api.get("/workouts");
      setWorkouts(Array.isArray(data) ? data : []);
    } catch (err) {
      toast({ title: "Unable to load workouts", description: handleApiError(err), variant: "destructive" });
    } finally {
      setIsLoadingWorkouts(false);
    }
  };

  const fetchPlans = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    setIsLoadingPlans(true);
    try {
      const { data } = await api.get(`/planner/${userId}`);
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      toast({ title: "Unable to load plans", description: handleApiError(err), variant: "destructive" });
    } finally {
      setIsLoadingPlans(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (userId) {
      fetchPlans();
      fetchSuggestedPlans();
    } else {
      setPlans([]);
      setSuggestedPlans([]);
    }
  }, [user?._id, user?.id, viewPeriod]);

  const fetchSuggestedPlans = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    setIsLoadingSuggestions(true);
    try {
      const { data } = await api.get(`/planner/suggest/${userId}?period=${viewPeriod}`);
      if (data.success) {
        setSuggestedPlans(data.suggestedPlans || []);
      }
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const addSuggestedPlan = async (suggestedPlan) => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    setIsSubmitting(true);
    try {
      await api.post("/planner", {
        userId: userId,
        workoutId: suggestedPlan.workoutId,
        date: new Date(suggestedPlan.date).toISOString().split("T")[0],
        notes: suggestedPlan.notes,
        durationMin: suggestedPlan.suggestedDuration,
      });
      toast({
        title: "Plan added!",
        description: `${suggestedPlan.workout.title} scheduled successfully.`,
      });
      fetchPlans();
    } catch (err) {
      toast({
        title: "Unable to add plan",
        description: handleApiError(err),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Support both _id and id fields
    const userId = user?._id || user?.id;
    if (!userId) {
      toast({ title: "Login required", description: "Please log in to schedule workouts.", variant: "destructive" });
      return;
    }

    if (!formState.workoutId || !formState.date) {
      toast({ title: "Missing fields", description: "Choose a workout and a date.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/planner", {
        userId: userId,
        workoutId: formState.workoutId,
        date: formState.date,
        notes: formState.notes,
        durationMin: formState.durationMin ? Number(formState.durationMin) : undefined,
      });
      toast({ title: "Workout scheduled", description: "Your plan has been saved." });
      setFormState({ workoutId: "", date: "", notes: "", durationMin: "" });
      fetchPlans();
    } catch (err) {
      toast({ title: "Unable to schedule", description: handleApiError(err), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const markCompleted = async (planId) => {
    try {
      await api.patch(`/planner/${planId}/complete`, { status: "completed" });
      toast({ title: "Workout complete", description: "Marked as completed." });
      fetchPlans();
    } catch (err) {
      toast({ title: "Unable to update", description: handleApiError(err), variant: "destructive" });
    }
  };

  const deletePlan = async (planId) => {
    try {
      await api.delete(`/planner/${planId}`);
      toast({ title: "Plan removed", description: "The workout has been deleted." });
      fetchPlans();
    } catch (err) {
      toast({ title: "Unable to delete", description: handleApiError(err), variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 pt-28 pb-16 space-y-12">
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* AI Image Placeholder - You can replace this with an actual image */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border-2 border-primary/30">
              <Sparkles className="w-12 h-12 text-primary" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-transparent animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient">Planner & Tracker</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
                Plan, track, and celebrate your sessions. Syncs directly with the AuraFit backend.
              </p>
            </div>
          </div>
        </div>


        {user ? (
          <Tabs defaultValue={defaultTab} className="w-full" onValueChange={(value) => {
            setSearchParams({ tab: value });
          }}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="planner" className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Planner
              </TabsTrigger>
              <TabsTrigger value="tracker" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Tracker
              </TabsTrigger>
            </TabsList>

            <TabsContent value="planner" className="space-y-8">
              {/* Suggested Plans Section */}
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Sparkles className="w-6 h-6 text-primary" />
                      Suggested Plans for {user.fitnessGoal || "Your Goal"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      AI-generated workout plans based on your fitness goal, height ({user.height || "N/A"} cm), and weight ({user.weight || "N/A"} kg)
                    </p>
                  </div>
                  <Select value={viewPeriod} onValueChange={setViewPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingSuggestions ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : suggestedPlans.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No suggestions available. Please update your fitness goal in profile.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestedPlans.map((suggested, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-border bg-card/60 p-4 hover:border-primary/50 transition-all"
                      >
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-lg">{suggested.workout.title}</h4>
                            <p className="text-xs text-muted-foreground capitalize">{suggested.workout.type}</p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(suggested.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {suggested.suggestedDuration} min
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{suggested.notes}</p>
                          <Button
                            onClick={() => addSuggestedPlan(suggested)}
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add to Planner
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <Card className="border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <PlusCircle className="w-6 h-6 text-primary" />
                    Schedule a workout
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Pick a workout from the library and lock in a date.
                  </p>
                </div>
                {isLoadingWorkouts && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workoutId">Workout</Label>
                      <div className="relative">
                        <select
                          id="workoutId"
                          name="workoutId"
                          value={formState.workoutId}
                          onChange={handleChange}
                          className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled={isLoadingWorkouts || workouts.length === 0}
                        >
                          <option value="">Select from library</option>
                          {workouts.map((workout) => (
                            <option key={workout._id} value={workout._id}>
                              {workout.title} — {workout.durationMin || 30} min
                            </option>
                          ))}
                        </select>
                        <CalendarDays className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formState.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="durationMin">Duration (minutes)</Label>
                        <Input
                          id="durationMin"
                          name="durationMin"
                          type="number"
                          min={10}
                          step={5}
                          value={formState.durationMin}
                          onChange={handleChange}
                          placeholder="45"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formState.notes}
                          onChange={handleChange}
                          placeholder="Focus on tempo, accessory work, etc."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" variant="neon" className="w-full" disabled={isSubmitting || isLoadingWorkouts}>
                    {isSubmitting ? "Scheduling..." : "Schedule workout"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Upcoming sessions</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Track planned, completed, or missed workouts.
                  </p>
                </div>
                {isLoadingPlans && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
              </CardHeader>
              <CardContent className="space-y-4">
                {!isLoadingPlans && sortedPlans.length === 0 && (
                  <div className="rounded-xl border border-border bg-card/60 p-6 text-center text-muted-foreground">
                    No workouts scheduled yet. Add your first plan on the left.
                  </div>
                )}

                {sortedPlans.map((plan) => {
                  const workoutTitle = plan.workoutId?.title || workouts.find((w) => w._id === plan.workoutId)?.title;
                  const status = plan.status || "planned";

                  return (
                    <div
                      key={plan._id}
                      className="rounded-2xl border border-border bg-card/60 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">{status}</p>
                        <h3 className="text-lg font-semibold text-foreground">{workoutTitle || "Workout"}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(plan.date).toLocaleString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {plan.notes && <p className="text-sm text-muted-foreground mt-2">{plan.notes}</p>}
                        {plan.durationMin && (
                          <p className="text-xs text-muted-foreground mt-1">Duration: {plan.durationMin} min</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markCompleted(plan._id)}
                          disabled={status === "completed"}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deletePlan(plan._id)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
            </TabsContent>

            <TabsContent value="tracker" className="space-y-8">
              <Tracker />
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="max-w-xl mx-auto">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <p>Please log in to access Planner & Tracker</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Planner;

