import { Navigate, Route, Routes } from "react-router";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/router/ProtectedRoute";
import DashboardPage from "@/pages/app/DashboardPage";
import NotAuthorized from "@/pages/auth/NotAuthorized";
import RequestPage from "@/pages/app/requests/RequestPage";
import NewRequestPage from "@/pages/app/requests/NewRequestPage";
import RequestDetailPage from "@/pages/app/requests/RequestDetailPage";

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
            <ProtectedRoute
              roles={["USER", "MANAGER", "MANAGER_IT", "VP", "DEV"]}
            >
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
          path="/requests/edit/:id"
          element={
            <ProtectedRoute roles={["USER"]}>
              <NewRequestPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/requests/:id"
          element={
            <ProtectedRoute
              roles={["USER", "MANAGER", "MANAGER_IT", "VP", "DEV"]}
            >
              <RequestDetailPage />
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
      </Route>

      <Route path="/not-authorized" element={<NotAuthorized />} />
    </Routes>
  );
}
