import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedLayout from "./ProtectedLayout";
import RoleRoute from "./RoleRoute";
import LoginPage from "../pages/LoginPage";
import ActivationPage from "../pages/ActivationPage";
import DashboardAdmin from "../pages/DashboardAdmin";
import TicketPage from "../pages/TicketPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import MyTickets from "../pages/MyTickets";
// import TicketDetailPage from "../pages/TicketDetailPage";
import UsersPage from "../pages/UsersPage";
import LabelsPage from "../pages/LabelsPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/activation", element: <ActivationPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  {
    
    element: (
      <ProtectedRoute>
        <ProtectedLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/my-tickets", element: <MyTickets viewType="default" /> },
      { path: "/tickets", element: <TicketPage /> },
      { path: "/tickets/:id", element: <div>Detalle ticket — próxima tarea</div> },
      { path: "/assigned", element: <RoleRoute role="ADMIN"><MyTickets viewType="assigned" /></RoleRoute> },

      {
        path: "/all-tickets",
        element: (
          <RoleRoute role="ADMIN">
            <MyTickets viewType="all" />
          </RoleRoute>
        )
      },
      {
        path: "/users",
        element: (
          <RoleRoute role="ADMIN">
            <UsersPage />
          </RoleRoute>
        ),
      },
      {
        path: "/labels",
        element: (
          <RoleRoute role="ADMIN">
            <LabelsPage />
          </RoleRoute>
        ),
      },
    ],
  },

  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "*", element: <Navigate to="/login" replace /> },
]);
