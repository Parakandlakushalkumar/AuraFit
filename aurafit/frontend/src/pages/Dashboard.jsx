import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Activity, TrendingUp, Flame, Users, BarChart3, Calendar, Zap, Loader2 } from "lucide-react";
import api, { handleApiError } from "@/api/client";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [progressData, setProgressData] = useState(null);
  const [communityComments, setCommunityComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?._id || user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    setIsLoading(true);
    try {
      // Fetch progress data
      const progressRes = await api.get(`/progress/${userId}/detailed`);
      if (progressRes.data.success) {
        setProgressData(progressRes.data);
      }

      // Fetch community posts with comments
      const communityRes = await api.get("/community");
      if (Array.isArray(communityRes.data)) {
        // Filter comments for current user
        const userComments = [];
        communityRes.data.forEach(post => {
          if (post.comments && Array.isArray(post.comments)) {
            post.comments.forEach(comment => {
              if (comment.userId?._id === userId || comment.userId === userId) {
                userComments.push({
                  ...comment,
                  postId: post._id,
                  postContent: post.content,
                  postAuthor: post.author,
                });
              }
            });
          }
        });
        setCommunityComments(userComments);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Please log in to access your dashboard</p>
            <Button onClick={() => navigate("/login")}>Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user.name || user.email}! Track your progress and stay connected.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-2 border-primary/20 bg-card/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      Total Workouts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{progressData?.totalWorkouts || 0}</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20 bg-card/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-primary" />
                      Calories Burned
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{progressData?.totalCaloriesBurned || 0}</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20 bg-card/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Activity Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{progressData?.streakDays || 0} days</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-primary/20 bg-card/50">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/dashboard/workouts")}>
                      <Activity className="mr-2 w-4 h-4" />
                      Log Workout
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/dashboard/diet")}>
                      <BarChart3 className="mr-2 w-4 h-4" />
                      Log Meal
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/planner")}>
                      <Calendar className="mr-2 w-4 h-4" />
                      View Planner
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/community")}>
                      <Users className="mr-2 w-4 h-4" />
                      Community
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20 bg-card/50">
                  <CardHeader>
                    <CardTitle>Weekly Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {progressData?.weeklyStats ? (
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Workouts</span>
                            <span>{progressData.weeklyStats.workouts}</span>
                          </div>
                          <Progress value={(progressData.weeklyStats.workouts / 7) * 100} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Calories Burned</span>
                            <span>{progressData.weeklyStats.caloriesBurned}</span>
                          </div>
                          <Progress value={Math.min((progressData.weeklyStats.caloriesBurned / 5000) * 100, 100)} />
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No data yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card className="border-2 border-primary/20 bg-card/50">
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                  <CardDescription>Track your fitness journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate("/planner?tab=tracker")} className="w-full">
                    View Detailed Tracker
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-6">
              <Card className="border-2 border-primary/20 bg-card/50">
                <CardHeader>
                  <CardTitle>Comments on Your Posts</CardTitle>
                  <CardDescription>See who commented on your community posts</CardDescription>
                </CardHeader>
                <CardContent>
                  {communityComments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No comments yet. Engage with the community!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {communityComments.map((comment, index) => (
                        <div key={index} className="p-4 rounded-lg border border-border bg-card/60">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold">{comment.author}</p>
                              <p className="text-sm text-muted-foreground">{comment.content}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                              On post by <span className="font-semibold">{comment.postAuthor}</span>
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{comment.postContent}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <Card className="border-2 border-primary/20 bg-card/50">
                <CardHeader>
                  <CardTitle>User Chat</CardTitle>
                  <CardDescription>Chat with other users (Coming Soon)</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Real-time chat functionality will be available soon. For now, use the Community page to interact with others.
                  </p>
                  <Button onClick={() => navigate("/community")} className="w-full">
                    Go to Community
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

