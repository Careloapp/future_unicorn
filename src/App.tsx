import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import NotFound from "./pages/NotFound.tsx";
import AuthCallback from "./pages/AuthCallback.tsx";

import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard.tsx";
import StaffDashboard from "./pages/dashboard/StaffDashboard.tsx";
import Settings from "./pages/dashboard/Settings.tsx";
import CallLogs from "./pages/dashboard/CallLogs.tsx";
import Analytics from "./pages/dashboard/Analytics.tsx";
import Profile from "./pages/dashboard/Profile.tsx";
import Performance from "./pages/dashboard/Performance.tsx";
import AdminAuditLog from "./pages/dashboard/AdminAuditLog.tsx";
import StaffAuditLog from "./pages/dashboard/StaffAuditLog.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Google OAuth callback */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Legacy redirect */}
          <Route path="/dashboard" element={<Navigate to="/login" replace />} />

          {/* Admin routes */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/calls"
            element={
              <ProtectedRoute requiredRole="admin">
                <CallLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/analytics"
            element={
              <ProtectedRoute requiredRole="admin">
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/settings"
            element={
              <ProtectedRoute requiredRole="admin">
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/profile"
            element={
              <ProtectedRoute requiredRole="admin">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/audit"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAuditLog />
              </ProtectedRoute>
            }
          />

          {/* Staff routes */}
          <Route
            path="/dashboard/staff"
            element={
              <ProtectedRoute requiredRole="employee">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/staff/performance"
            element={
              <ProtectedRoute requiredRole="employee">
                <Performance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/staff/settings"
            element={
              <ProtectedRoute requiredRole="employee">
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/staff/profile"
            element={
              <ProtectedRoute requiredRole="employee">
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/staff/audit"
            element={
              <ProtectedRoute requiredRole="employee">
                <StaffAuditLog />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
