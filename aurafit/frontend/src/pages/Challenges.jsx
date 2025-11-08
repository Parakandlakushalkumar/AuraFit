import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Zap, Calendar, Users, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import api, { handleApiError } from "@/api/client";

const Challenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [completingId, setCompletingId] = useState(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/challenges");
      setChallenges(data || []);
    } catch (err) {
      const message = handleApiError(err);
      toast({
        title: "Failed to load challenges",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (challengeId) => {
    if (!user?._id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to join challenges.",
        variant: "destructive",
      });
      return;
    }

    setJoiningId(challengeId);
    try {
      const { data } = await api.post(`/challenges/join/${challengeId}`, {
        userId: user._id,
      });

      if (data.success) {
        toast({
          title: "Challenge joined!",
          description: "Good luck completing the challenge!",
        });
        fetchChallenges();
      }
    } catch (err) {
      const message = handleApiError(err);
      toast({
        title: "Join failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setJoiningId(null);
    }
  };

  const handleComplete = async (challengeId) => {
    if (!user?._id) return;

    setCompletingId(challengeId);
    try {
      const { data } = await api.patch(`/challenges/${challengeId}/complete`, {
        userId: user._id,
      });

      if (data.success) {
        toast({
          title: "Challenge completed!",
          description: `You earned ${data.xpEarned} XP! Total: ${data.totalXP} XP`,
        });
        fetchChallenges();
      }
    } catch (err) {
      const message = handleApiError(err);
      toast({
        title: "Completion failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setCompletingId(null);
    }
  };

  const isParticipant = (challenge) => {
    if (!user?._id) return false;
    return challenge.participants?.some(p => 
      (typeof p === 'string' ? p : p._id || p) === user._id
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "border-green-500/30 bg-green-500/10";
      case "upcoming": return "border-blue-500/30 bg-blue-500/10";
      case "completed": return "border-muted/30 bg-muted/10";
      default: return "border-border";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Challenges & Gamification
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Complete challenges, earn XP, and climb the leaderboard
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const isJoined = isParticipant(challenge);
            const statusColor = getStatusColor(challenge.status);

            return (
              <Card
                key={challenge._id}
                className={`border-2 ${statusColor} bg-card/50 backdrop-blur-xl hover:shadow-lg transition-all`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex-1">{challenge.title}</CardTitle>
                    <div className="flex items-center gap-1 text-primary">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-bold">{challenge.rewardXP}</span>
                    </div>
                  </div>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(challenge.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{challenge.participants?.length || 0} participants</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!isJoined ? (
                      <Button
                        onClick={() => handleJoin(challenge._id)}
                        disabled={joiningId === challenge._id || challenge.status !== "active"}
                        className="flex-1"
                        size="sm"
                      >
                        {joiningId === challenge._id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          "Join Challenge"
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleComplete(challenge._id)}
                        disabled={completingId === challenge._id || challenge.status === "completed"}
                        className="flex-1 bg-gradient-to-r from-primary to-purple-600"
                        size="sm"
                      >
                        {completingId === challenge._id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Completing...
                          </>
                        ) : challenge.status === "completed" ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Trophy className="mr-2 h-4 w-4" />
                            Complete
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {challenges.length === 0 && (
          <Card className="border-2 border-border bg-card/50">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No challenges available yet. Check back soon!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Challenges;

