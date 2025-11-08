import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-6xl font-display font-bold">404</h1>
        <p className="text-muted-foreground">This page could not be found.</p>
        <Button variant="neon" onClick={() => navigate("/")}>Go Home</Button>
      </div>
    </div>
  );
};

export default NotFound;
