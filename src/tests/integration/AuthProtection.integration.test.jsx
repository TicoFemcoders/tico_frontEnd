import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "../../context/AuthContext.jsx";
import ProtectedRoute from "../../routes/ProtectedRoute.jsx";
import RoleRoute from "../../routes/RoleRoute.jsx";

const renderWithAuth = (ui) =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/target"]}>
        <Routes>
          <Route path="/login" element={<div>Página Login</div>} />
          <Route path="/my-tickets" element={<div>Mis Tickets</div>} />
          <Route path="/target" element={ui} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );

describe("Integración — ProtectedRoute con AuthProvider real", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("sin token redirige a /login", () => {
    renderWithAuth(
      <ProtectedRoute>
        <div>Contenido protegido</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Página Login")).toBeInTheDocument();
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });

  it("con token en localStorage muestra el contenido protegido", () => {
    localStorage.setItem("token", "valid-token");
    localStorage.setItem("user", JSON.stringify({ id: 1, name: "Admin", roles: ["ROLE_ADMIN"] }));

    renderWithAuth(
      <ProtectedRoute>
        <div>Contenido protegido</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
    expect(screen.queryByText("Página Login")).not.toBeInTheDocument();
  });
});

describe("Integración — RoleRoute con AuthProvider real", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("usuario ADMIN puede acceder a la ruta de administración", () => {
    localStorage.setItem("token", "valid-token");
    localStorage.setItem("user", JSON.stringify({ id: 1, name: "Admin", roles: ["ROLE_ADMIN"] }));

    renderWithAuth(
      <RoleRoute role="ADMIN">
        <div>Panel Admin</div>
      </RoleRoute>,
    );

    expect(screen.getByText("Panel Admin")).toBeInTheDocument();
    expect(screen.queryByText("Mis Tickets")).not.toBeInTheDocument();
  });

  it("usuario EMPLOYEE es redirigido a /my-tickets desde una ruta de admin", () => {
    localStorage.setItem("token", "valid-token");
    localStorage.setItem("user", JSON.stringify({ id: 2, name: "Employee", roles: ["ROLE_EMPLOYEE"] }));

    renderWithAuth(
      <RoleRoute role="ADMIN">
        <div>Panel Admin</div>
      </RoleRoute>,
    );

    expect(screen.getByText("Mis Tickets")).toBeInTheDocument();
    expect(screen.queryByText("Panel Admin")).not.toBeInTheDocument();
  });

  it("usuario sin token no puede acceder a ninguna ruta de rol", () => {
    renderWithAuth(
      <ProtectedRoute>
        <RoleRoute role="ADMIN">
          <div>Panel Admin</div>
        </RoleRoute>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Página Login")).toBeInTheDocument();
    expect(screen.queryByText("Panel Admin")).not.toBeInTheDocument();
  });
});
