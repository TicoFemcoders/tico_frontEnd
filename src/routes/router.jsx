import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/LoginPage";
import ActivationPage from "../pages/ActivationPage";
import DashboardEmployee from "../pages/DashboardEmployee";
import TicketPage from "../pages/TicketPage";
import DashboardAdmin from "../pages/DashboardAdmin";

export const router = createBrowserRouter([

  { path: "/login", 
    element: <LoginPage /> 
  },
  {
    path: "/activation",
    element: <ActivationPage />,
  },

  {
    path: "/",
    /* LUEGO : <ProtectedRoute>*/
    element: <MainLayout />, 
    children: [
      { index: true, element: <Navigate to="/login" replace /> },

      { 
        path: "dashboard-employee", 
        element: <DashboardEmployee /> 
      },

      { 
        path: "dashboard-admin", 
        element: <DashboardAdmin /> 
      },

      { 
        path: "tickets", 
        element: <TicketPage /> 
      },
    ],
  },

  { path: "*", element: <Navigate to="/login" replace /> },
]);
