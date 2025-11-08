import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, Save, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import api, { handleApiError } from "@/api/client";
import { useNavigate } from "react-router-dom";

const AIGenerator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [goal, setGoal] = useState("Muscle Gain");
  const [level, setLevel] = useState("Beginner");
  const [equipment, setEquipment] = useState("Dumbbells");
  const [isGenerating, setIsGenerating] = useState(false);
  const [plans, setPlans] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    if (!user?._id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to generate workouts.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setPlans([]);
    try {
      const { data } = await api.post("/ai/workout/generate", {
        userId: user._id,
        goal,
        level,
        equipment,
      });

      if (data.success && data.plans) {
        setPlans(data.plans);
        toast({
          title: "Workouts generated!",
          description: `Created ${data.plans.length} personalized workout plans.`,
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
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async (plan) => {
    if (!user?._id) return;

    setIsSaving(true);
    try {
      // Find a matching workout or create a plan entry
      const { data: workouts } = await api.get("/workouts");
      const matchingWorkout = workouts?.find(w => 
        w.name === plan.title || 
        w.type?.toLowerCase().includes(goal.toLowerCase())
      );

      if (matchingWorkout) {
        await api.post("/planner", {
          userId: user._id,
          workoutId: matchingWorkout._id,
          date: new Date().toISOString(),
          status: "planned",
          notes: `AI Generated: ${plan.description}`,
        });

        toast({
          title: "Plan saved!",
          description: "Workout added to your planner.",
        });
        navigate("/planner");
      } else {
        toast({
          title: "Plan saved",
          description: "Workout plan generated and ready.",
        });
      }
    } catch (err) {
      const message = handleApiError(err);
      toast({
        title: "Save failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI Workout Generator
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Get personalized workout plans powered by AI
          </p>
        </div>

        {/* Form */}
        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Customize Your Workout</CardTitle>
            <CardDescription>
              Select your fitness goal, experience level, and available equipment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fitness Goal</label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                    <SelectItem value="General Fitness">General Fitness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Experience Level</label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Equipment</label>
                <Select value={equipment} onValueChange={setEquipment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dumbbells">Dumbbells</SelectItem>
                    <SelectItem value="Resistance Bands">Resistance Bands</SelectItem>
                    <SelectItem value="None">None (Bodyweight)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Workout Plans
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Plans */}
        {plans.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Your Generated Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className="border-2 border-primary/30 bg-gradient-to-br from-card to-card/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      {plan.title}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{plan.durationMin} min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Intensity:</span>
                        <span className="font-medium capitalize">{plan.intensity}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Exercises:</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {plan.exercises?.slice(0, 5).map((exercise, i) => (
                          <li key={i}>{exercise}</li>
                        ))}
                        {plan.exercises?.length > 5 && (
                          <li className="text-primary">+{plan.exercises.length - 5} more</li>
                        )}
                      </ul>
                    </div>

                    <Button
                      onClick={() => handleSavePlan(plan)}
                      disabled={isSaving}
                      variant="outline"
                      className="w-full"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save to Planner
                    </Button>
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

export default AIGenerator;

