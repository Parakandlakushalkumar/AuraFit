import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { BottomNav } from "@/components/strength/BottomNav";

const workoutData = {
  "lower-body": {
    title: "Complex Lower Body",
    duration: 30,
    exercises: [
      { name: "Squats", reps: "3 sets x 15 reps", instructions: "Keep your back straight, lower your hips until thighs are parallel to the floor" },
      { name: "Lunges", reps: "3 sets x 12 reps each leg", instructions: "Step forward with one leg, lower your hips until both knees are bent at 90 degrees" },
      { name: "Deadlifts", reps: "3 sets x 10 reps", instructions: "Keep the bar close to your body, lift by extending your hips and knees" },
    ]
  },
  "jumps": {
    title: "Explosive Power Jumps",
    duration: 20,
    exercises: [
      { name: "Box Jumps", reps: "4 sets x 10 reps", instructions: "Jump onto a sturdy platform, land softly with bent knees" },
      { name: "Burpees", reps: "3 sets x 15 reps", instructions: "Drop to push-up position, jump feet forward, then jump up with arms overhead" },
      { name: "Jump Squats", reps: "3 sets x 12 reps", instructions: "Perform a squat then explode upward into a jump" },
    ]
  },
  "glutes": {
    title: "Amazing Butt",
    duration: 25,
    exercises: [
      { name: "Hip Thrusts", reps: "4 sets x 15 reps", instructions: "Rest upper back on bench, drive through heels to lift hips" },
      { name: "Glute Bridges", reps: "3 sets x 20 reps", instructions: "Lie on back, lift hips by squeezing glutes" },
      { name: "Fire Hydrants", reps: "3 sets x 15 reps each side", instructions: "On all fours, lift one leg out to the side" },
    ]
  },
  "chest-arms": {
    title: "Chest & Arms",
    duration: 35,
    exercises: [
      { name: "Push-ups", reps: "4 sets x 15 reps", instructions: "Keep body straight, lower chest to ground, push back up" },
      { name: "Dumbbell Curls", reps: "3 sets x 12 reps", instructions: "Curl weights up while keeping elbows stationary" },
      { name: "Tricep Dips", reps: "3 sets x 12 reps", instructions: "Lower body by bending elbows, then push back up" },
    ]
  },
  "shoulders": {
    title: "Shoulders & Upper Back",
    duration: 30,
    exercises: [
      { name: "Shoulder Press", reps: "4 sets x 12 reps", instructions: "Press weights overhead, fully extending arms" },
      { name: "Lateral Raises", reps: "3 sets x 15 reps", instructions: "Raise arms out to sides until parallel with floor" },
      { name: "Rows", reps: "3 sets x 12 reps", instructions: "Pull weights toward chest, squeezing shoulder blades" },
    ]
  },
  "abs": {
    title: "Insane Six Pack",
    duration: 20,
    exercises: [
      { name: "Crunches", reps: "4 sets x 20 reps", instructions: "Lift shoulders off ground, engaging core" },
      { name: "Planks", reps: "3 sets x 60 seconds", instructions: "Hold body straight in push-up position on forearms" },
      { name: "Russian Twists", reps: "3 sets x 30 reps", instructions: "Sit with feet off ground, rotate torso side to side" },
    ]
  },
};

export default function StrengthWorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const workout = id ? workoutData[id] : null;

  useEffect(() => {
    if (workout) {
      setTimeLeft(workout.duration * 60);
    }
  }, [workout]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(workout ? workout.duration * 60 : 0);
  };

  if (!workout) {
    return (
      <div className="min-h-screen bg-background p-6 pb-24">
        <Button variant="ghost" onClick={() => navigate("/strength")} className="mb-4">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        <p className="text-muted-foreground">Workout not found</p>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-to-b from-primary/10 to-background p-6">
        <Button variant="ghost" onClick={() => navigate("/strength")} className="mb-4">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">{workout.title}</h1>
        <p className="text-muted-foreground">Duration: {workout.duration} minutes</p>
      </div>

      <div className="px-6 py-8">
        <Card className="p-8 mb-6 text-center bg-card">
          <div className="text-6xl font-bold text-primary mb-4">{formatTime(timeLeft)}</div>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleStartPause} size="lg" className="gap-2">
              {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {isRunning ? "Pause" : "Start Workout"}
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </Card>

        <h2 className="text-2xl font-bold text-foreground mb-4">Exercises</h2>
        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => (
            <Card key={index} className="p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-2">{exercise.name}</h3>
              <p className="text-primary font-medium mb-2">{exercise.reps}</p>
              <p className="text-muted-foreground text-sm">{exercise.instructions}</p>
            </Card>
          ))}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}

