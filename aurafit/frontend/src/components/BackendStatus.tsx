import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import api from "@/api/client";

export const BackendStatus = () => {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected" | "blocked">("checking");
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const checkBackend = async () => {
      try {
        await api.get("/health", { timeout: 2000 });
        if (mounted) {
          setStatus("connected");
          setTimeout(() => setShowAlert(false), 5000); // Hide after 5 seconds if connected
        }
      } catch (error: any) {
        if (!mounted) return;
        
        const isBlocked = error?.code === "ERR_BLOCKED_BY_CLIENT" || 
                         error?.message?.includes("ERR_BLOCKED_BY_CLIENT") ||
                         error?.request?.responseURL?.includes("localhost:5001");
        
        // If blocked, it's likely ad blocker - show helpful message
        if (isBlocked) {
          setStatus("blocked");
        } else {
          // Otherwise, backend might not be running
          setStatus("disconnected");
        }
      }
    };

    // Initial check after a short delay
    const timeout = setTimeout(checkBackend, 500);
    // Then check every 30 seconds
    const interval = setInterval(checkBackend, 30000);
    
    return () => {
      mounted = false;
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  if (!showAlert || status === "connected") return null;

  return (
    <Alert 
      variant={status === "blocked" ? "destructive" : "default"}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-2xl mx-4 shadow-lg"
    >
      {status === "blocked" ? (
        <>
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Backend Connection Blocked</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Your browser or ad blocker is blocking API requests to the backend.</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowAlert(false)}
              >
                Dismiss
              </Button>
            </div>
            <p className="text-xs mt-2">
              <strong>To fix:</strong> Disable ad blockers for localhost, or make sure backend is running on port 5001.
            </p>
          </AlertDescription>
        </>
      ) : (
        <>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Backend Server Not Connected</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Unable to connect to the backend API. Some features may not work.</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Retry Connection
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowAlert(false)}
              >
                Dismiss
              </Button>
            </div>
            <p className="text-xs mt-2">
              <strong>To start backend:</strong> Open terminal and run: <code className="bg-muted px-1 rounded">cd backend && npm start</code>
            </p>
          </AlertDescription>
        </>
      )}
    </Alert>
  );
};

