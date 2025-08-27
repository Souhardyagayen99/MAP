import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddActivity from "./pages/AddActivity";
import StudentProfile from "./pages/StudentProfile";
import StudentManagement from "./pages/StudentManagement";
import TeacherManagement from "./pages/TeacherManagement";
import SystemSettings from "./pages/SystemSettings";
import ActivityOversight from "./pages/ActivityOversight";
import PlaceholderPage from "./components/PlaceholderPage";
import NotFound from "./pages/NotFound";
import StudentSettings from "./pages/StudentSettings";
import TeacherSettings from "./pages/TeacherSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/settings" element={<StudentSettings />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/settings" element={<TeacherSettings />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Placeholder routes for future development */}
          <Route path="/student/activities" element={<AddActivity />} />
          <Route path="/student/analytics" element={
            <PlaceholderPage
              title="Student Analytics"
              description="Detailed progress analytics and charts"
              backLink="/student"
            />
          } />
          <Route path="/student/map" element={
            <PlaceholderPage
              title="Activity Map"
              description="Interactive map showing activity locations"
              backLink="/student"
            />
          } />
          <Route path="/teacher/events" element={
            <PlaceholderPage
              title="Event Management"
              description="Create and manage events for students"
              backLink="/teacher"
            />
          } />
          <Route path="/admin/students" element={<StudentManagement />} />
          <Route path="/admin/teachers" element={<TeacherManagement />} />
          <Route path="/admin/settings" element={<SystemSettings />} />
          <Route path="/admin/activities" element={<ActivityOversight />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
