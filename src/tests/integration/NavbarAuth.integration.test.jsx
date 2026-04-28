import React from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import theme from "../../styles/theme.js";
import { AuthProvider } from "../../context/AuthContext.jsx";
import Navbar from "../../components/layout/Navbar.jsx";

const renderNavbar = () =>
  render(
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <MemoryRouter initialEntries={["/my-tickets"]}>
          <Routes>
            <Route path="/login" element={<div>Página Login</div>} />
            <Route path="*" element={<Navbar />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </ThemeProvider>,
  );

describe("Integración — Navbar según rol de usuario", () => {
  afterEach(() => {
    localStorage.clear();
  });

  describe("usuario EMPLOYEE", () => {
    beforeEach(() => {
      localStorage.setItem("token", "fake-token");
      localStorage.setItem("user", JSON.stringify({ id: 2, name: "Ana García", roles: ["ROLE_EMPLOYEE"] }));
    });

    it("muestra el nombre del usuario desde localStorage", () => {
      renderNavbar();
      expect(screen.getAllByText("Ana García").length).toBeGreaterThan(0);
    });

    it("muestra el rol Empleada", () => {
      renderNavbar();
      expect(screen.getAllByText("Empleada").length).toBeGreaterThan(0);
    });

    it("muestra el item Mis tickets", () => {
      renderNavbar();
      expect(screen.getAllByText("Mis tickets").length).toBeGreaterThan(0);
    });

    it("muestra el botón Nuevo ticket", () => {
      renderNavbar();
      expect(screen.getAllByText("Nuevo ticket").length).toBeGreaterThan(0);
    });

    it("NO muestra los items exclusivos de administración", () => {
      renderNavbar();
      expect(screen.queryAllByText("Todos los tickets")).toHaveLength(0);
      expect(screen.queryAllByText("Usuarios")).toHaveLength(0);
      expect(screen.queryAllByText("Etiquetas")).toHaveLength(0);
    });
  });

  describe("usuario ADMIN", () => {
    beforeEach(() => {
      localStorage.setItem("token", "fake-token");
      localStorage.setItem("user", JSON.stringify({ id: 1, name: "Carlos Admin", roles: ["ROLE_ADMIN"] }));
    });

    it("muestra el nombre del usuario desde localStorage", () => {
      renderNavbar();
      expect(screen.getAllByText("Carlos Admin").length).toBeGreaterThan(0);
    });

    it("muestra el rol Administrador", () => {
      renderNavbar();
      expect(screen.getAllByText("Administrador").length).toBeGreaterThan(0);
    });

    it("muestra los items de gestión exclusivos de admin", () => {
      renderNavbar();
      expect(screen.getAllByText("Todos los tickets").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Usuarios").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Etiquetas").length).toBeGreaterThan(0);
    });

    it("NO muestra el botón Nuevo ticket", () => {
      renderNavbar();
      expect(screen.queryAllByText("Nuevo ticket")).toHaveLength(0);
    });
  });

  describe("logout", () => {
    beforeEach(() => {
      localStorage.setItem("token", "fake-token");
      localStorage.setItem("user", JSON.stringify({ id: 1, name: "Carlos Admin", roles: ["ROLE_ADMIN"] }));
    });

    it("al hacer click en cerrar sesión limpia el token del localStorage", async () => {
      renderNavbar();

      await userEvent.click(screen.getByRole("button", { name: /cerrar sesión/i }));

      await waitFor(() => {
        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("user")).toBeNull();
      });
    });
  });
});
