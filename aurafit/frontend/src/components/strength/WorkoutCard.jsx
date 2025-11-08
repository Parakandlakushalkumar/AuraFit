import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export const WorkoutCard = ({ title, image, isPro = false, className, id }) => {
  const navigate = useNavigate();
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl bg-card shadow-[0_2px_8px_hsl(var(--shadow-card))] transition-all duration-300 hover:shadow-[0_4px_16px_hsl(var(--shadow-card-hover))] hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      onClick={() => navigate(`/strength/workout/${id}`)}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      {isPro && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 shadow-lg">
          <Lock className="h-3.5 w-3.5 text-primary-foreground" />
          <span className="text-xs font-semibold text-primary-foreground">Pro</span>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2">{title}</h3>
      </div>
    </div>
  );
};

