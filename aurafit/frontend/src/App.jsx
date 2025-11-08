import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import Index from "./pages/Index.jsx";
import Privacy from "./pages/legal/Privacy.jsx";
import Terms from "./pages/legal/Terms.jsx";
import NotFound from "./pages/NotFound.jsx";
import Workouts from "./pages/Workouts.jsx";
import Mind from "./pages/Mind.jsx";
import Nutrition from "./pages/Nutrition.jsx";
import Community from "./pages/Community.jsx";
import PricingPage from "./pages/Pricing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import FeaturesPage from "./pages/FeaturesPage.tsx";
import MindStressAnxiety from "./pages/MindStressAnxiety.jsx";
import MindBetterSleep from "./pages/MindBetterSleep.jsx";
import Planner from "./pages/Planner.jsx";
import ProfileEdit from "./pages/ProfileEdit.jsx";
import StrengthIndex from "./pages/strength/StrengthIndex.tsx";
import StrengthWorkoutDetail from "./pages/strength/StrengthWorkoutDetail.tsx";
import StrengthProfile from "./pages/strength/StrengthProfile.tsx";
import AIGenerator from "./pages/AIGenerator.jsx";
import PoseDetection from "./pages/PoseDetection.jsx";
import Challenges from "./pages/Challenges.jsx";
import Progress from "./pages/Progress.jsx";
import WorkoutTracker from "./pages/dashboard/WorkoutTracker.jsx";
import DietTracker from "./pages/dashboard/DietTracker.jsx";
import AIMealPlan from "./pages/dashboard/AIMealPlan.jsx";
import AdminPanel from "./pages/dashboard/AdminPanel.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import api from "@/api/client";
import { BackendStatus } from "@/components/BackendStatus";

const queryClient = new QueryClient();

const MainLayout = () => (
  <div className="min-h-screen">
    <Navbar />
    <Outlet />
  </div>
);

const App = () => {
  useEffect(() => {
    // Silent health check - errors are handled by BackendStatus component
    const baseUrl = import.meta.env.DEV ? "/api" : (import.meta.env.VITE_API_BASE_URL || "/api");
    console.info("🔗 Backend URL:", baseUrl);
    
    // Silent health check - don't spam console with errors
    api
      .get("/health", { timeout: 2000 })
      .then(() => {
        console.info("✅ Backend connected");
      })
      .catch((error) => {
        // Only log if it's not a blocked request (handled by BackendStatus component)
        const isBlocked = error?.code === "ERR_BLOCKED_BY_CLIENT" || 
                         error?.message?.includes("ERR_BLOCKED_BY_CLIENT");
        if (!isBlocked && error?.code !== "ECONNABORTED") {
          // Only log actual connection errors, not timeouts or blocks
          console.debug("Backend health check:", error?.message || "Connection failed");
        }
      });
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <BackendStatus />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/mind" element={<Mind />} />
              <Route path="/mind/stress-anxiety" element={<MindStressAnxiety />} />
              <Route path="/mind/better-sleep" element={<MindBetterSleep />} />
              <Route path="/mind/coming-soon" element={<NotFound />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/community" element={<Community />} />
              <Route path="/pricing" element={<PricingPage />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/legal/privacy" element={<Privacy />} />
                <Route path="/legal/terms" element={<Terms />} />
                {/* Strength Training Routes */}
                <Route path="/strength" element={<StrengthIndex />} />
                <Route path="/strength/workout/:id" element={<StrengthWorkoutDetail />} />
                <Route path="/strength/profile" element={<StrengthProfile />} />
                {/* New Feature Routes */}
                <Route path="/ai-generator" element={<AIGenerator />} />
                <Route path="/pose-detection" element={<PoseDetection />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/progress" element={<Progress />} />
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/workouts" element={<WorkoutTracker />} />
                <Route path="/dashboard/diet" element={<DietTracker />} />
                <Route path="/dashboard/ai-meal-plan" element={<AIMealPlan />} />
                <Route path="/dashboard/progress" element={<Progress />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
              <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);
};

export default App;

