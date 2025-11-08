import { WorkoutCard } from "@/components/strength/WorkoutCard";
import { BottomNav } from "@/components/strength/BottomNav";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const lowerBodyImage = "/workout-lower-body.jpg";
const jumpsImage = "/workout-jumps.jpg";
const glutesImage = "/workout-glutes.jpg";
const chestArmsImage = "/workout-chest-arms.jpg";
const shouldersImage = "/workout-shoulders.jpg";
const absImage = "/workout-abs.jpg";

const StrengthIndex = () => {
  const navigate = useNavigate();
  
  const lowerBodyWorkouts = [
    { id: "lower-body", title: "Complex Lower Body", image: lowerBodyImage, isPro: false },
    { id: "jumps", title: "Explosive Power Jumps", image: jumpsImage, isPro: true },
    { id: "glutes", title: "Amazing Butt", image: glutesImage, isPro: true },
  ];

  const upperBodyWorkouts = [
    { id: "chest-arms", title: "Chest & Arms", image: chestArmsImage, isPro: false },
    { id: "shoulders", title: "Shoulders & Upper Back", image: shouldersImage, isPro: true },
  ];

  const absWorkouts = [
    { id: "abs", title: "Insane Six Pack", image: absImage, isPro: true },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="max-w-md mx-auto px-6 py-5 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/workouts")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Strength Training</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 py-6 space-y-8">
        {/* Lower Body Section */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Lower Body</h2>
          <div className="grid grid-cols-2 gap-4">
            {lowerBodyWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                id={workout.id}
                title={workout.title}
                image={workout.image}
                isPro={workout.isPro}
              />
            ))}
          </div>
        </section>

        {/* Upper Body Section */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Upper Body</h2>
          <div className="grid grid-cols-2 gap-4">
            {upperBodyWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                id={workout.id}
                title={workout.title}
                image={workout.image}
                isPro={workout.isPro}
              />
            ))}
          </div>
        </section>

        {/* Abs Section */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Abs (Insane Six Pack)</h2>
          <div className="grid grid-cols-2 gap-4">
            {absWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                id={workout.id}
                title={workout.title}
                image={workout.image}
                isPro={workout.isPro}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default StrengthIndex;

