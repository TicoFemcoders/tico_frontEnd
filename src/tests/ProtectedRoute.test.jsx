import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";

vi.mock("../context/useAuth", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../context/useAuth";

const renderWithRouter = (ui, { initialEntries = ["/"] } = {}) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<div>Página Login</div>} />
        <Route path="/" element={ui} />
      </Routes>
    </MemoryRouter>,
  );

describe("ProtectedRoute", () => {
  it("redirige a /login si no hay token", () => {
    useAuth.mockReturnValue({ token: null });

    renderWithRouter(
      <ProtectedRoute>
        <div>Contenido protegido</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Página Login")).toBeInTheDocument();
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });

  it("renderiza los children si hay token", () => {
    useAuth.mockReturnValue({ token: "fake-token" });

    renderWithRouter(
      <ProtectedRoute>
        <div>Contenido protegido</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
    expect(screen.queryByText("Página Login")).not.toBeInTheDocument();
  });
});
