import { Navigate, Route, Routes } from "react-router";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/router/ProtectedRoute";
import DashboardPage from "@/pages/app/DashboardPage";
import ManagerPage from "@/pages/app/ManagerPage";
import VPPage from "@/pages/app/VPPage";
import NotAuthorized from "@/pages/auth/NotAuthorized";
import RequestPage from "@/pages/app/RequestPage";
import NewRequestPage from "@/pages/app/NewRequestPage";
import { MappingPage } from "@/pages/app/MappingPage";
import { DeveloperPage } from "@/pages/app/DeveloperPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={["MANAGER", "MANAGER_IT", "VP"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/new-request"
          element={
            <ProtectedRoute roles={["USER"]}>
              <NewRequestPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <ProtectedRoute roles={["USER"]}>
              <RequestPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoute roles={["MANAGER", "MANAGER_IT", "VP"]}>
              <ManagerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vp"
          element={
            <ProtectedRoute roles={["VP"]}>
              <VPPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mapping"
          element={
            <ProtectedRoute roles={["MANAGER_IT"]}>
              <MappingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/developer"
          element={
            <ProtectedRoute roles={["DEV"]}>
              <DeveloperPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/not-authorized" element={<NotAuthorized />} />
    </Routes>
  );
}
