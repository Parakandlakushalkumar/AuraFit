import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import api, { handleApiError } from "@/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Loader2, MessageSquare, Flame, Trophy, Send, Trophy as TrophyIcon, Zap } from "lucide-react";

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [commentTexts, setCommentTexts] = useState({});
  const [reactingPostId, setReactingPostId] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchLeaderboard();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await api.get("/community");
      setPosts(Array.isArray(data) ? data : []);
      if (data && Array.isArray(data) && data.length > 0) {
        toast({ title: "Community synced", description: "Pulled the latest posts from AuraFit." });
      }
    } catch (err) {
      const message = handleApiError(err);
      const isBlocked = err?.code === "ERR_BLOCKED_BY_CLIENT" || 
                       err?.message?.includes("ERR_BLOCKED_BY_CLIENT");
      setError(isBlocked ? "Backend connection blocked. Please check if backend is running." : message);
      setPosts([]);
      if (!isBlocked) {
        toast({ title: "Unable to load community", description: message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const { data } = await api.get("/community/leaderboard");
      if (data.success) {
        setLeaderboard(data.leaderboard || []);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    }
  };

  const handleReact = async (postId, reactionType) => {
    if (!user?._id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to react.",
        variant: "destructive",
      });
      return;
    }

    if (!postId) {
      toast({
        title: "Error",
        description: "Invalid post ID",
        variant: "destructive",
      });
      return;
    }

    setReactingPostId(postId);
    try {
      const { data } = await api.patch(`/community/${postId}/react`, {
        userId: user._id || user.id,
        reactionType,
      });

      if (data.success) {
        // Refresh posts to get updated data
        await fetchPosts();
        toast({
          title: "Reaction updated!",
          description: "Your reaction has been recorded.",
        });
      }
    } catch (err) {
      const message = handleApiError(err);
      console.error("React error:", err);
      toast({
        title: "Reaction failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setReactingPostId(null);
    }
  };

  const handleComment = async (postId) => {
    if (!user?._id || !commentTexts[postId]?.trim()) return;

    if (!postId) {
      toast({
        title: "Error",
        description: "Invalid post ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data } = await api.post(`/community/${postId}/comment`, {
        userId: user._id || user.id,
        author: user.name || user.email,
        content: commentTexts[postId],
      });

      if (data.success) {
        // Refresh posts to get updated comments
        await fetchPosts();
        setCommentTexts(prev => ({ ...prev, [postId]: "" }));
        toast({ title: "Comment added!" });
      }
    } catch (err) {
      const message = handleApiError(err);
      console.error("Comment error:", err);
      toast({
        title: "Comment failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-center text-gradient">
            Community
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Join challenges, share progress, and get support from like-minded athletes.
          </p>
        </div>

        <div className="flex items-center justify-between mt-12">
          <h2 className="text-2xl font-display font-semibold">Latest posts</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowLeaderboard(!showLeaderboard)}
            >
              <TrophyIcon className="mr-2 h-4 w-4" />
              {showLeaderboard ? "Hide" : "Show"} Leaderboard
            </Button>
            {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
          </div>
        </div>

        {/* Leaderboard */}
        {showLeaderboard && (
          <Card className="mt-6 border-2 border-primary/20 bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-primary" />
                Top 10 Leaderboard
              </CardTitle>
              <CardDescription>Users ranked by XP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.map((user, index) => (
                  <div
                    key={user._id || user.email}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? "bg-yellow-500 text-white" :
                        index === 1 ? "bg-gray-400 text-white" :
                        index === 2 ? "bg-orange-600 text-white" :
                        "bg-muted text-foreground"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{user.name || user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <Zap className="w-4 h-4" />
                      <span className="font-bold">{user.xp || 0} XP</span>
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No leaderboard data yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="mt-6 p-4 border border-red-500/30 bg-red-500/10 text-sm rounded-xl text-red-200">
            {error}
          </div>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <div className="mt-6 p-6 border border-border rounded-2xl bg-card/40 text-center text-muted-foreground">
            No posts yet — start the conversation with the AuraFit community!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {posts.map((post, index) => (
            <div
              key={post._id || post.id || `${post.author}-${index}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 transition-all hover:shadow-xl hover:-translate-y-1"
              style={{ animationDelay: `${120 * (index + 1)}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{post.author || "Anonymous"}</p>
                    {post.createdAt && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{post.content}</p>

                {/* Reactions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReact(post._id, "like")}
                    disabled={reactingPostId === post._id}
                    className="flex items-center gap-1"
                  >
                    <Heart className="w-4 h-4" />
                    {post.likes || 0}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReact(post._id, "fire")}
                    disabled={reactingPostId === post._id}
                    className="flex items-center gap-1"
                  >
                    <Flame className="w-4 h-4" />
                    {post.fire || 0}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReact(post._id, "trophy")}
                    disabled={reactingPostId === post._id}
                    className="flex items-center gap-1"
                  >
                    <Trophy className="w-4 h-4" />
                    {post.trophy || 0}
                  </Button>
                </div>

                {/* Comments */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-sm font-semibold">Comments:</p>
                    {post.comments.map((comment, idx) => (
                      <div key={idx} className="text-sm bg-muted/40 p-2 rounded">
                        <p className="font-semibold">{comment.author}</p>
                        <p className="text-muted-foreground">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                {user && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Input
                      placeholder="Add a comment..."
                      value={commentTexts[post._id] || ""}
                      onChange={(e) => setCommentTexts(prev => ({ ...prev, [post._id]: e.target.value }))}
                      onKeyPress={(e) => e.key === "Enter" && handleComment(post._id)}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleComment(post._id)}
                      disabled={!commentTexts[post._id]?.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
