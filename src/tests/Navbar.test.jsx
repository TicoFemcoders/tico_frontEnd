import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme.js";
import Navbar from "../components/layout/Navbar.jsx";

const mockNavigate = vi.fn();
const mockLogout = vi.fn();
let mockPathname = "/my-tickets";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: mockPathname }),
  };
});

vi.mock("../context/useAuth.js", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../components/common/TicoLogo.jsx", () => ({
  default: () => <div />,
}));

import { useAuth } from "../context/useAuth.js";

const employeeAuth = {
  user: { name: "Ana García", email: "ana@test.com", roles: ["ROLE_EMPLOYEE"] },
  logout: mockLogout,
  hasRole: (role) => role === "EMPLOYEE",
};

const adminAuth = {
  user: { name: "Carlos Admin", email: "carlos@test.com", roles: ["ROLE_ADMIN"] },
  logout: mockLogout,
  hasRole: (role) => role === "ADMIN",
};

const renderNavbar = (props = {}) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <Navbar {...props} />
      </MemoryRouter>
    </ThemeProvider>
  );


describe("Navbar", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = "/my-tickets";
  });

  describe("vista de empleado", () => {
    beforeEach(() => {
      useAuth.mockReturnValue(employeeAuth);
    });

    it("muestra el item Mis tickets", () => {
      renderNavbar();
      expect(screen.getAllByText("Mis tickets")[0]).toBeInTheDocument();
    });

    it("muestra el botón Nuevo ticket", () => {
      renderNavbar();
      expect(screen.getAllByText("Nuevo ticket")[0]).toBeInTheDocument();
    });

    it("no muestra items exclusivos de administración", () => {
      renderNavbar();
      expect(screen.queryByText("Todos los tickets")).not.toBeInTheDocument();
      expect(screen.queryByText("Usuarios")).not.toBeInTheDocument();
      expect(screen.queryByText("Etiquetas")).not.toBeInTheDocument();
    });

    it("muestra el nombre del usuario", () => {
      renderNavbar();
      expect(screen.getAllByText("Ana García")[0]).toBeInTheDocument();
    });

    it("muestra el rol Empleada", () => {
      renderNavbar();
      expect(screen.getAllByText("Empleada")[0]).toBeInTheDocument();
    });

    it("navega a /my-tickets al hacer click en Mis tickets", async () => {
      renderNavbar();
      await userEvent.click(screen.getAllByText("Mis tickets")[0]);
      expect(mockNavigate).toHaveBeenCalledWith("/my-tickets");
    });

    it("navega a /tickets al hacer click en Nuevo ticket", async () => {
      renderNavbar();
      await userEvent.click(screen.getAllByText("Nuevo ticket")[0]);
      expect(mockNavigate).toHaveBeenCalledWith("/tickets");
    });
  });

  describe("vista de administrador", () => {
    beforeEach(() => {
      useAuth.mockReturnValue(adminAuth);
    });

    it("muestra Todos los tickets", () => {
      renderNavbar();
      expect(screen.getAllByText("Todos los tickets")[0]).toBeInTheDocument();
    });

    it("muestra Mis tickets asignados", () => {
      renderNavbar();
      expect(screen.getAllByText("Mis tickets asignados")[0]).toBeInTheDocument();
    });

    it("muestra Usuarios", () => {
      renderNavbar();
      expect(screen.getAllByText("Usuarios")[0]).toBeInTheDocument();
    });

    it("muestra Etiquetas", () => {
      renderNavbar();
      expect(screen.getAllByText("Etiquetas")[0]).toBeInTheDocument();
    });

    it("no muestra el botón Nuevo ticket", () => {
      renderNavbar();
      expect(screen.queryByText("Nuevo ticket")).not.toBeInTheDocument();
    });

    it("muestra el rol Administrador", () => {
      renderNavbar();
      expect(screen.getAllByText("Administrador")[0]).toBeInTheDocument();
    });

    it("navega a /all-tickets al hacer click en Todos los tickets", async () => {
      renderNavbar();
      await userEvent.click(screen.getAllByText("Todos los tickets")[0]);
      expect(mockNavigate).toHaveBeenCalledWith("/all-tickets");
    });

    it("navega a /users al hacer click en Usuarios", async () => {
      renderNavbar();
      await userEvent.click(screen.getAllByText("Usuarios")[0]);
      expect(mockNavigate).toHaveBeenCalledWith("/users");
    });

    it("navega a /labels al hacer click en Etiquetas", async () => {
      renderNavbar();
      await userEvent.click(screen.getAllByText("Etiquetas")[0]);
      expect(mockNavigate).toHaveBeenCalledWith("/labels");
    });
  });

  it("llama a logout al hacer click en el botón de cerrar sesión", async () => {
    useAuth.mockReturnValue(employeeAuth);
    renderNavbar();
    await userEvent.click(screen.getByRole("button", { name: /cerrar sesión/i }));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("marca como seleccionado el item de la ruta actual", () => {
    mockPathname = "/my-tickets";
    useAuth.mockReturnValue(employeeAuth);
    renderNavbar();
    const item = screen.getAllByText("Mis tickets")[0].closest("[class*='MuiListItemButton']");
    expect(item).toHaveClass("Mui-selected");
  });
});
