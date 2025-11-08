import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Camera, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import api, { handleApiError } from "@/api/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PoseDetection = () => {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [exercise, setExercise] = useState("Push-up");
  const [duration, setDuration] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [stream, setStream] = useState(null);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsActive(true);
      startTimeRef.current = Date.now();
      
      // Simulate pose detection (replace with TensorFlow.js/MediaPipe in production)
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setDuration(elapsed);
          
          // Mock accuracy calculation (replace with real pose detection)
          const mockAccuracy = Math.min(95, 70 + Math.random() * 25);
          setAccuracy(Math.round(mockAccuracy));
          
          if (mockAccuracy > 85) {
            setFeedback("Perfect Form! Keep it up!");
          } else if (mockAccuracy > 70) {
            setFeedback("Good form! Minor adjustments needed.");
          } else {
            setFeedback("Adjust your posture. Focus on alignment.");
          }
        }
      }, 1000);
    } catch (err) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to use pose detection.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    setDuration(0);
    setAccuracy(0);
    setFeedback("");
  };

  const logPoseData = async () => {
    if (!user?._id || !accuracy) {
      toast({
        title: "No data to log",
        description: "Please start pose detection first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.post("/pose/log", {
        userId: user._id,
        exercise,
        accuracy,
        duration,
      });

      toast({
        title: "Performance logged!",
        description: `Saved ${exercise} session with ${accuracy}% accuracy.`,
      });
    } catch (err) {
      const message = handleApiError(err);
      toast({
        title: "Logging failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Video className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Real-Time Pose Detection
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Track your exercise form and improve your technique
          </p>
        </div>

        {/* Exercise Selection */}
        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Select Exercise</CardTitle>
            <CardDescription>Choose the exercise you want to track</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={exercise} onValueChange={setExercise} disabled={isActive}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Push-up">Push-up</SelectItem>
                <SelectItem value="Squat">Squat</SelectItem>
                <SelectItem value="Plank">Plank</SelectItem>
                <SelectItem value="Lunge">Lunge</SelectItem>
                <SelectItem value="Deadlift">Deadlift</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Camera Feed */}
        <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Live Feed</CardTitle>
            <CardDescription>Position yourself in front of the camera</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ display: isActive ? "block" : "none" }}
              />
              {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Camera feed will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              {!isActive ? (
                <Button
                  onClick={startCamera}
                  className="flex-1 bg-gradient-to-r from-primary to-purple-600"
                  size="lg"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Start Detection
                </Button>
              ) : (
                <Button
                  onClick={stopCamera}
                  variant="destructive"
                  className="flex-1"
                  size="lg"
                >
                  Stop Detection
                </Button>
              )}
              {isActive && (
                <Button
                  onClick={logPoseData}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Log Session
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {isActive && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-primary/20 bg-card/50">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-3xl font-bold text-primary">{accuracy}%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-card/50">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-3xl font-bold text-primary">
                    {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-card/50">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Exercise</p>
                  <p className="text-lg font-semibold">{exercise}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <Card className={`border-2 ${
            accuracy > 85 ? "border-green-500/30 bg-green-500/10" :
            accuracy > 70 ? "border-yellow-500/30 bg-yellow-500/10" :
            "border-red-500/30 bg-red-500/10"
          }`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                {accuracy > 85 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold mb-1">Form Feedback</p>
                  <p className="text-sm">{feedback}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PoseDetection;

