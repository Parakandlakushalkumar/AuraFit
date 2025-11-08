import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import api, { handleApiError } from "@/api/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ImageUp, Loader2, ShieldCheck } from "lucide-react";

const ProfileEdit = () => {
  const { user, updateUser } = useAuth();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) {
      toast({ title: "Unsupported file", description: "Choose a valid image.", variant: "destructive" });
      return;
    }
    setFile(nextFile);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!user?.id) {
      toast({ title: "Login required", description: "Sign in to update your profile.", variant: "destructive" });
      return;
    }
    if (!file) {
      toast({ title: "Select an image", description: "Choose a file before uploading.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    try {
      const { data } = await api.put(`/user/${user.id}/profile-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = data?.imageUrl || data?.url || data?.secure_url;
      if (imageUrl) {
        updateUser?.({ imageUrl });
      }
      toast({ title: "Profile updated", description: "Your new avatar is live." });
      setFile(null);
    } catch (err) {
      toast({ title: "Upload failed", description: handleApiError(err), variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 pt-28 pb-16 space-y-12">
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient">Profile Center</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Update your profile image and personal brand across the AuraFit experience.
          </p>
        </div>

        {!user && (
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle>Sign in to manage your profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Log in or create an account to personalize your profile image and preferences.
              </p>
              <div className="flex gap-3 justify-center">
                <Link to="/login">
                  <Button variant="neon">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="secondary">Create Account</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {user && (
          <div className="grid gap-10 lg:grid-cols-2">
            <Card className="border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <ImageUp className="w-6 h-6 text-primary" />
                    Upload new avatar
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    Supports PNG, JPG, GIF up to 5MB. Stored securely via Cloudinary.
                  </p>
                </div>
                {isUploading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Profile image</Label>
                    <input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground">Recommended: 800x800px, square format.</p>
                  </div>

                  {previewUrl && (
                    <div className="rounded-2xl border border-border overflow-hidden bg-card/60">
                      <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
                    </div>
                  )}

                  <Button type="submit" variant="neon" className="w-full" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Save changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  Current profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-2xl border border-border bg-card/60 p-6 flex flex-col items-center gap-4">
                  <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-primary/40">
                    <img
                      src={previewUrl || user?.imageUrl || "https://placehold.co/320x320?text=AuraFit"}
                      alt="Current avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-lg font-semibold">{user?.name || "AuraFit Athlete"}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    {user?.fitnessGoal && (
                      <p className="text-xs uppercase tracking-widest text-primary">{user.fitnessGoal}</p>
                    )}
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-card/40 p-6 text-sm text-muted-foreground space-y-2">
                  <p className="font-semibold text-foreground">Upload tips</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use good lighting so the avatar is clear.</li>
                    <li>Square aspect ratio gives the best result.</li>
                    <li>Transparent PNGs keep neon effects crisp.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileEdit;

