import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, Apple, Utensils, PlusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import api, { handleApiError } from "@/api/client";

const AIMealPlan = () => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [meals, setMeals] = useState(null);
  const [formState, setFormState] = useState({
    goalType: user?.goalType || 'Muscle Gain',
    calories: user?.dailyCalorieTarget || 2000,
    dietPreference: 'Balanced diet',
  });

  const handleGenerate = async () => {
    const userId = user?._id || user?.id;
    if (!userId) {
      toast({
        title: "Please login",
        description: "You need to be logged in to generate meal plans.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data } = await api.post("/nutrition/ai-meal-plan", {
        userId,
        goalType: formState.goalType,
        calories: Number(formState.calories),
        dietPreference: formState.dietPreference,
      });

      if (data.success) {
        setMeals(data);
        toast({
          title: "Meal plan generated!",
          description: "Your personalized AI meal plan is ready.",
        });
      }
    } catch (err) {
      toast({
        title: "Generation failed",
        description: handleApiError(err),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const addMealToLog = async (meal) => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    try {
      // Calculate average macros per item
      const itemsCount = meal.items.length;
      const proteinPerItem = Math.round(meal.protein / itemsCount);
      const carbsPerItem = Math.round(meal.carbs / itemsCount);
      const fatPerItem = Math.round(meal.fat / itemsCount);
      const caloriesPerItem = Math.round(meal.calories / itemsCount);

      // Log each item as a separate meal entry
      for (const item of meal.items) {
        await api.post("/meal/log", {
          userId,
          foodName: item,
          calories: caloriesPerItem,
          protein: proteinPerItem,
          carbs: carbsPerItem,
          fat: fatPerItem,
          mealType: meal.meal,
          notes: `From AI Meal Plan - ${formState.goalType}`,
        });
      }

      toast({
        title: "Meals added!",
        description: `${meal.meal} has been added to your diet tracker.`,
      });
    } catch (err) {
      toast({
        title: "Failed to add meals",
        description: handleApiError(err),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-5xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI Meal Planner
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Get personalized meal plans powered by AI
          </p>
        </div>

        {/* Form */}
        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Generate Your Meal Plan</CardTitle>
            <CardDescription>
              Tell us your goals and preferences, and we'll create a personalized meal plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goalType">Goal Type</Label>
                <Select
                  value={formState.goalType}
                  onValueChange={(value) => setFormState(prev => ({ ...prev, goalType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                    <SelectItem value="Fat Loss">Fat Loss</SelectItem>
                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                    <SelectItem value="Weight Gain">Weight Gain</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="General Fitness">General Fitness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Daily Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  min="1200"
                  max="5000"
                  value={formState.calories}
                  onChange={(e) => setFormState(prev => ({ ...prev, calories: e.target.value }))}
                  placeholder="2000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietPreference">Diet Preference</Label>
                <Select
                  value={formState.dietPreference}
                  onValueChange={(value) => setFormState(prev => ({ ...prev, dietPreference: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Balanced diet">Balanced</SelectItem>
                    <SelectItem value="High protein, low carb">High Protein, Low Carb</SelectItem>
                    <SelectItem value="High protein, moderate carb">High Protein, Moderate Carb</SelectItem>
                    <SelectItem value="Low carb, high fat">Low Carb, High Fat</SelectItem>
                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="Vegan">Vegan</SelectItem>
                    <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietPreferenceText">Additional Preferences (optional)</Label>
              <Textarea
                id="dietPreferenceText"
                value={formState.dietPreference}
                onChange={(e) => setFormState(prev => ({ ...prev, dietPreference: e.target.value }))}
                placeholder="e.g., No dairy, prefer whole foods, etc."
                rows={2}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating AI Meal Plan...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Meal Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Meals */}
        {meals && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your AI Meal Plan</h2>
              <div className="text-sm text-muted-foreground">
                Total: {meals.macros?.totalCalories || 0} cal | 
                P: {meals.macros?.totalProtein || 0}g | 
                C: {meals.macros?.totalCarbs || 0}g | 
                F: {meals.macros?.totalFat || 0}g
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meals.meals?.map((meal, index) => (
                <Card
                  key={index}
                  className="border-2 border-primary/30 bg-gradient-to-br from-card to-card/50 hover:border-primary/50 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Apple className="w-5 h-5 text-primary" />
                        {meal.meal}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addMealToLog(meal)}
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add to Tracker
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">Food Items:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {meal.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Calories</p>
                        <p className="text-lg font-bold text-primary">{meal.calories}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Protein</p>
                        <p className="text-lg font-bold">{meal.protein}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Carbs</p>
                        <p className="text-lg font-bold">{meal.carbs}g</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Fat</p>
                        <p className="text-lg font-bold">{meal.fat}g</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMealPlan;

