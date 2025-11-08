import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Utensils, Loader2, PlusCircle, Trash2, Apple, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import api, { handleApiError } from "@/api/client";
import { Link } from "react-router-dom";

const DietTracker = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [dailyTotals, setDailyTotals] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealType: '',
    notes: '',
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
      const { data } = await api.get(`/meal/log/${userId}`);
      if (data.success) {
        setLogs(data.logs || []);
        setSummary(data.summary);
        setDailyTotals(data.dailyTotals || {});
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
        description: "You need to be logged in to log meals.",
        variant: "destructive",
      });
      return;
    }

    if (!formState.foodName || !formState.calories || !formState.mealType) {
      toast({
        title: "Missing fields",
        description: "Please fill in required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/meal/log", {
        userId,
        foodName: formState.foodName,
        calories: Number(formState.calories),
        protein: Number(formState.protein) || 0,
        carbs: Number(formState.carbs) || 0,
        fat: Number(formState.fat) || 0,
        mealType: formState.mealType,
        notes: formState.notes,
      });

      toast({
        title: "Meal logged!",
        description: "Your meal has been saved successfully.",
      });

      setFormState({
        foodName: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        mealType: '',
        notes: '',
      });
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
      await api.delete(`/meal/log/${logId}`);
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

  const today = new Date().toISOString().split('T')[0];
  const todayTotal = dailyTotals[today] || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Utensils className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Diet Tracker
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Log your meals and track your daily nutrition
          </p>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Today's Calories</p>
                <p className="text-3xl font-bold text-primary">{todayTotal.calories}</p>
                {user?.dailyCalorieTarget && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Target: {user.dailyCalorieTarget}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Protein (g)</p>
                <p className="text-3xl font-bold text-primary">{Math.round(todayTotal.protein)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Carbs (g)</p>
                <p className="text-3xl font-bold text-primary">{Math.round(todayTotal.carbs)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Fat (g)</p>
                <p className="text-3xl font-bold text-primary">{Math.round(todayTotal.fat)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Meal Planner Link */}
        <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Need meal ideas?</h3>
                <p className="text-muted-foreground">
                  Get AI-generated meal plans tailored to your goals
                </p>
              </div>
              <Link to="/dashboard/ai-meal-plan">
                <Button variant="neon" className="gap-2">
                  <Apple className="w-4 h-4" />
                  AI Meal Planner
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          {/* Log Form */}
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-primary" />
                Log Meal
              </CardTitle>
              <CardDescription>Record what you ate</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="foodName">Food Name</Label>
                  <Input
                    id="foodName"
                    value={formState.foodName}
                    onChange={(e) => setFormState(prev => ({ ...prev, foodName: e.target.value }))}
                    placeholder="e.g., Grilled Chicken Breast"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mealType">Meal Type</Label>
                  <Select
                    value={formState.mealType}
                    onValueChange={(value) => setFormState(prev => ({ ...prev, mealType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Dinner">Dinner</SelectItem>
                      <SelectItem value="Snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      min="0"
                      value={formState.calories}
                      onChange={(e) => setFormState(prev => ({ ...prev, calories: e.target.value }))}
                      placeholder="500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      min="0"
                      value={formState.protein}
                      onChange={(e) => setFormState(prev => ({ ...prev, protein: e.target.value }))}
                      placeholder="30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      min="0"
                      value={formState.carbs}
                      onChange={(e) => setFormState(prev => ({ ...prev, carbs: e.target.value }))}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      min="0"
                      value={formState.fat}
                      onChange={(e) => setFormState(prev => ({ ...prev, fat: e.target.value }))}
                      placeholder="20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={formState.notes}
                    onChange={(e) => setFormState(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional notes..."
                    rows={2}
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
                      Log Meal
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Logs List */}
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Recent Meals</CardTitle>
              <CardDescription>Your meal history</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No meals logged yet. Start tracking your nutrition!
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
                            <Utensils className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{log.foodName}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="capitalize">{log.mealType}</span>
                              <span>{log.calories} cal</span>
                              {log.protein > 0 && <span>P: {log.protein}g</span>}
                              {log.carbs > 0 && <span>C: {log.carbs}g</span>}
                              {log.fat > 0 && <span>F: {log.fat}g</span>}
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

export default DietTracker;

