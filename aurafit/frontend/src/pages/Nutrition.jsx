import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import api, { handleApiError } from "@/api/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const GOALS = [
  {
    key: "muscle-gain",
    title: "Muscle Gain",
    description: "High-protein plans with smart calorie surplus.",
  },
  {
    key: "fat-loss",
    title: "Fat Loss",
    description: "Balanced deficits with nutrient-dense meals.",
  },
  {
    key: "wellness",
    title: "Wellness",
    description: "Clean eating with flexible lifestyle choices.",
  },
];

const Nutrition = () => {
  const { user } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState(GOALS[0].key);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [aiMealPlanEnabled, setAiMealPlanEnabled] = useState(false);
  const [calories, setCalories] = useState(2000);
  const [aiMealPlan, setAiMealPlan] = useState(null);
  const [isGeneratingMealPlan, setIsGeneratingMealPlan] = useState(false);

  const selectedGoalTitle = useMemo(() => GOALS.find((goal) => goal.key === selectedGoal)?.title ?? "" , [selectedGoal]);

  const fetchNutrition = useCallback(
    async (goal) => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const { data } = await api.get(`/nutrition/goal/${goal}`);
        if (data.success && data.meals) {
          // New structured nutrition plan
          setNutritionPlan(data);
          setItems(data.items || []);
          toast({
            title: "Nutrition plan loaded",
            description: `${data.goal} meal plan ready!`,
          });
        } else {
          // Old format
          setItems(data?.items ?? []);
          setNutritionPlan(null);
          if (data?.items && data.items.length > 0) {
            toast({
              title: "Nutrition updated",
              description: `Pulled ${data.items.length} plans for ${selectedGoalTitle || goal}.`,
            });
          }
        }
      } catch (err) {
        const message = handleApiError(err);
        const isBlocked = err?.code === "ERR_BLOCKED_BY_CLIENT" || 
                         err?.message?.includes("ERR_BLOCKED_BY_CLIENT");
        setItems([]);
        setNutritionPlan(null);
        setErrorMessage(isBlocked ? "Backend connection blocked. Please check if backend is running." : message);
        if (!isBlocked) {
          toast({
            title: "Unable to load meals",
            description: message,
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [selectedGoalTitle],
  );

  useEffect(() => {
    fetchNutrition(selectedGoal);
    setAiMealPlan(null);
  }, [fetchNutrition, selectedGoal]);

  const generateMealPlan = async () => {
    if (!user?._id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to generate meal plans.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingMealPlan(true);
    try {
      const goalTitle = GOALS.find(g => g.key === selectedGoal)?.title || "General Fitness";
      const { data } = await api.post("/nutrition/recommend", {
        userId: user._id,
        goal: goalTitle,
        calories: parseInt(calories),
      });

      if (data.success) {
        setAiMealPlan(data);
        toast({
          title: "Meal plan generated!",
          description: "Your personalized 7-day meal plan is ready.",
        });
      }
    } catch (err) {
      const message = handleApiError(err);
      toast({
        title: "Generation failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingMealPlan(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-center text-gradient">
            Smart Nutrition
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            AI-guided meal plans, macros tracking, and grocery lists tailored to your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {GOALS.map((goal, i) => (
            <button
              key={goal.key}
              type="button"
              onClick={() => setSelectedGoal(goal.key)}
              className={`text-left group relative overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-xl p-6 transition-all hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2 duration-700 ${
                selectedGoal === goal.key ? "border-primary/60 shadow-neon" : "border-border"
              }`}
              style={{ animationDelay: `${100 * (i + 1)}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-2xl font-semibold mb-2">{goal.title}</h3>
              <p className="text-muted-foreground">{goal.description}</p>
              <div className="mt-6">
                <span className={`inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-transform group-hover:translate-x-1 ${
                  selectedGoal === goal.key 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-primary/10 text-primary border border-primary/20"
                }`}>
                  {selectedGoal === goal.key ? "Selected" : `Explore ${goal.title}`}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* AI Meal Plan Toggle */}
        <Card className="mt-8 border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Meal Plan Generator
            </CardTitle>
            <CardDescription>
              Get a personalized 7-day meal plan with macro distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-toggle">Enable AI Meal Plan</Label>
              <Switch
                id="ai-toggle"
                checked={aiMealPlanEnabled}
                onCheckedChange={setAiMealPlanEnabled}
              />
            </div>
            {aiMealPlanEnabled && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="calories">Daily Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    min={1200}
                    max={4000}
                  />
                </div>
                <Button
                  onClick={generateMealPlan}
                  disabled={isGeneratingMealPlan}
                  className="w-full bg-gradient-to-r from-primary to-purple-600"
                >
                  {isGeneratingMealPlan ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Meal Plan
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Meal Plan Display */}
        {aiMealPlan && (
          <Card className="mt-6 border-2 border-primary/30 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle>Your 7-Day Meal Plan</CardTitle>
              <CardDescription>
                {aiMealPlan.goal} • {aiMealPlan.calories} calories/day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Macros */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-muted/40">
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-2xl font-bold">{aiMealPlan.macros.protein.grams}g</p>
                  <p className="text-xs text-muted-foreground">{aiMealPlan.macros.protein.calories} cal</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/40">
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="text-2xl font-bold">{aiMealPlan.macros.carbs.grams}g</p>
                  <p className="text-xs text-muted-foreground">{aiMealPlan.macros.carbs.calories} cal</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/40">
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="text-2xl font-bold">{aiMealPlan.macros.fat.grams}g</p>
                  <p className="text-xs text-muted-foreground">{aiMealPlan.macros.fat.calories} cal</p>
                </div>
              </div>

              {/* Meal Plan Days */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(aiMealPlan.mealPlan).map(([day, meals]) => (
                  <div key={day} className="p-4 rounded-xl border border-border bg-card/60">
                    <h4 className="font-semibold mb-3 capitalize">{day.replace("day", "Day ")}</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">🌅</span>
                        <span>{meals[0]}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">☀️</span>
                        <span>{meals[1]}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">🌙</span>
                        <span>{meals[2]}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">🍎</span>
                        <span>{meals[3]}</span>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nutrition Plan Display - Shows meal plans based on selected goal */}
        {nutritionPlan && (
          <Card className="mt-8 border-2 border-primary/30 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle>{nutritionPlan.goal} Meal Plan</CardTitle>
              <CardDescription>{nutritionPlan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Macros */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-muted/40">
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="text-2xl font-bold">{nutritionPlan.macros.calories}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/40">
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-2xl font-bold">{nutritionPlan.macros.protein}g</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/40">
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="text-2xl font-bold">{nutritionPlan.macros.carbs}g</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/40">
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="text-2xl font-bold">{nutritionPlan.macros.fat}g</p>
                </div>
              </div>

              {/* Meals */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {nutritionPlan.meals.map((meal, index) => (
                  <div key={index} className="p-4 rounded-xl border border-border bg-card/60">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      {meal.mealType === "Breakfast" && "🌅"}
                      {meal.mealType === "Lunch" && "☀️"}
                      {meal.mealType === "Dinner" && "🌙"}
                      {meal.mealType === "Snack" && "🍎"}
                      {meal.mealType}
                    </h4>
                    <ul className="space-y-2 text-sm mb-3">
                      {meal.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">{meal.calories} calories</p>
                  </div>
                ))}
              </div>

              {/* Tips */}
              {nutritionPlan.tips && nutritionPlan.tips.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Tips for {nutritionPlan.goal}</h4>
                  <ul className="space-y-2">
                    {nutritionPlan.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">💡</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Old Items Display (fallback) */}
        {!nutritionPlan && (
          <div className="mt-14 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-semibold">
                {selectedGoalTitle || "Plan"} Recommendations
              </h2>
              {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
            </div>

            {errorMessage && (
              <div className="p-4 border border-red-500/30 bg-red-500/10 text-sm rounded-xl text-red-200">
                {errorMessage}
              </div>
            )}

            {!isLoading && !errorMessage && items.length === 0 && (
              <div className="p-6 border border-border rounded-2xl bg-card/40 text-center text-muted-foreground">
                No meals found for this goal yet. Try another fitness focus.
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item._id || item.id || item.name}
                  className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 hover:border-primary/40 transition-colors"
                >
                  <h3 className="text-xl font-semibold mb-2">{item.name || item.title || "Meal"}</h3>
                  {item.description && <p className="text-muted-foreground mb-4">{item.description}</p>}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {typeof item.calories === "number" && (
                      <div className="rounded-xl bg-muted/40 p-3">
                        <p className="text-muted-foreground">Calories</p>
                        <p className="text-lg font-semibold">{item.calories}</p>
                      </div>
                    )}
                    {typeof item.protein === "number" && (
                      <div className="rounded-xl bg-muted/40 p-3">
                        <p className="text-muted-foreground">Protein</p>
                        <p className="text-lg font-semibold">{item.protein} g</p>
                      </div>
                    )}
                    {typeof item.carbs === "number" && (
                      <div className="rounded-xl bg-muted/40 p-3">
                        <p className="text-muted-foreground">Carbs</p>
                        <p className="text-lg font-semibold">{item.carbs} g</p>
                      </div>
                    )}
                    {typeof item.fat === "number" && (
                      <div className="rounded-xl bg-muted/40 p-3">
                        <p className="text-muted-foreground">Fat</p>
                        <p className="text-lg font-semibold">{item.fat} g</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;
