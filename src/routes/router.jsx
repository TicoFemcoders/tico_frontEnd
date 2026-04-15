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
import DetailTicketPage from "../pages/DetailTicketPage";
// import UsersPage from "../pages/UsersPage";
// import LabelsPage from "../pages/LabelsPage";

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
      { path: "/dashboard-employee", element: <MyTickets /> },
      { path: "/tickets", element: <TicketPage /> },
      { path: "/detail-ticket/:id", element: <DetailTicketPage /> },
      { path: "/assigned", element: <RoleRoute role="ADMIN"><div>Mis tickets asignados — próxima tarea</div></RoleRoute> },

      {
        path: "/dashboard-admin",
        element: (
          <RoleRoute role="ADMIN">
            <DashboardAdmin />
          </RoleRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <RoleRoute role="ADMIN">
            <div>Gestión usuarios — próxima tarea</div>
          </RoleRoute>
        ),
      },
      {
        path: "/labels",
        element: (
          <RoleRoute role="ADMIN">
            <div>Gestión etiquetas — próxima tarea</div>
          </RoleRoute>
        ),
      },
    ],
  },

  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "*", element: <Navigate to="/login" replace /> },
]);
