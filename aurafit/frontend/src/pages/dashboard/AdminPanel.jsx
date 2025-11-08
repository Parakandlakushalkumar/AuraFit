import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users, Loader2, Send, Eye, TrendingUp, Flame } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import api, { handleApiError } from "@/api/client";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLogs, setUserLogs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionForm, setSuggestionForm] = useState({
    type: 'general',
    message: '',
  });

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'trainer')) {
      fetchUsers();
    } else {
      toast({
        title: "Access Denied",
        description: "Admin or Trainer access required.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user]);

  const fetchUsers = async () => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    setIsLoading(true);
    try {
      const { data } = await api.get("/admin/users", {
        data: { userId }, // In production, use JWT token
      });
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      toast({
        title: "Failed to load users",
        description: handleApiError(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserLogs = async (userId) => {
    const adminId = user?._id || user?.id;
    setIsLoading(true);
    try {
      const { data } = await api.get(`/admin/user/${userId}/logs`, {
        data: { userId: adminId },
      });
      if (data.success) {
        setUserLogs(data);
        setSelectedUser(userId);
      }
    } catch (err) {
      toast({
        title: "Failed to load user logs",
        description: handleApiError(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendSuggestion = async (userId) => {
    const adminId = user?._id || user?.id;
    if (!suggestionForm.message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a suggestion message.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data } = await api.post(`/admin/user/${userId}/suggestion`, {
        userId: adminId,
        suggestion: suggestionForm.message,
        type: suggestionForm.type,
      });

      if (data.success) {
        toast({
          title: "Suggestion sent!",
          description: "Your suggestion has been sent to the user.",
        });
        setSuggestionForm({ type: 'general', message: '' });
      }
    } catch (err) {
      toast({
        title: "Failed to send suggestion",
        description: handleApiError(err),
        variant: "destructive",
      });
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'trainer')) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
        <Card className="border-2 border-primary/20 bg-card/50">
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-primary opacity-50" />
            <p className="text-muted-foreground">Admin or Trainer access required</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-7xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage users, view stats, and send suggestions
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          {/* Users List */}
          <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Users ({users.length})
              </CardTitle>
              <CardDescription>All registered users</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No users found
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {users.map((u) => (
                    <div
                      key={u._id || u.id}
                      className={`rounded-xl border p-4 cursor-pointer transition-all ${
                        selectedUser === (u._id || u.id)
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card/60 hover:border-primary/50"
                      }`}
                      onClick={() => fetchUserLogs(u._id || u.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{u.name || u.email}</h4>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            Goal: {u.goalType || u.fitnessGoal || "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-primary">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-bold">{u.stats?.totalWorkouts || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-primary">
                            <Flame className="w-4 h-4" />
                            <span className="text-xs">{u.stats?.totalCaloriesBurned || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Details & Logs */}
          <div className="space-y-6">
            {userLogs ? (
              <>
                <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>User Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><span className="font-semibold">Name:</span> {userLogs.user.name}</p>
                      <p><span className="font-semibold">Email:</span> {userLogs.user.email}</p>
                      <p><span className="font-semibold">Goal:</span> {userLogs.user.goalType || "N/A"}</p>
                      <p><span className="font-semibold">Calorie Target:</span> {userLogs.user.dailyCalorieTarget || "N/A"}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Activity Logs</CardTitle>
                    <CardDescription>Workout and meal logs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Workout Logs ({userLogs.workoutLogs?.length || 0})</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {userLogs.workoutLogs?.slice(0, 5).map((log) => (
                            <div key={log._id} className="text-sm p-2 rounded bg-muted/40">
                              {log.workoutType} - {log.durationMin}min - {log.caloriesBurned} cal
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Meal Logs ({userLogs.mealLogs?.length || 0})</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {userLogs.mealLogs?.slice(0, 5).map((log) => (
                            <div key={log._id} className="text-sm p-2 rounded bg-muted/40">
                              {log.foodName} - {log.calories} cal ({log.mealType})
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Send Suggestion</CardTitle>
                    <CardDescription>Provide personalized recommendations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="suggestionType">Suggestion Type</Label>
                      <Select
                        value={suggestionForm.type}
                        onValueChange={(value) => setSuggestionForm(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="workout">Workout</SelectItem>
                          <SelectItem value="nutrition">Nutrition</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="suggestionMessage">Message</Label>
                      <Textarea
                        id="suggestionMessage"
                        value={suggestionForm.message}
                        onChange={(e) => setSuggestionForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Enter your suggestion or recommendation..."
                        rows={4}
                      />
                    </div>
                    <Button
                      onClick={() => sendSuggestion(selectedUser)}
                      variant="neon"
                      className="w-full"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Suggestion
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a user to view their details and logs</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

