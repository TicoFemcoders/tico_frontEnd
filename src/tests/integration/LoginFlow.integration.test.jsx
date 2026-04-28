import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import theme from "../../styles/theme.js";
import { AuthProvider } from "../../context/AuthContext.jsx";
import LoginForm from "../../components/login/LoginForm.jsx";

const ADMIN_RESPONSE = {
  userId: 1,
  name: "Admin Test",
  email: "admin@cohispania.com",
  roles: ["ROLE_ADMIN"],
};

const EMPLOYEE_RESPONSE = {
  userId: 2,
  name: "Employee Test",
  email: "emp@cohispania.com",
  roles: ["ROLE_EMPLOYEE"],
};

const server = setupServer(
  http.post("http://localhost:8080/login", () =>
    HttpResponse.json(ADMIN_RESPONSE, {
      headers: { Authorization: "Bearer fake-token-admin" },
    }),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderLoginFlow = () =>
  render(
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/all-tickets" element={<div>Panel Admin</div>} />
            <Route path="/my-tickets" element={<div>Mis Tickets</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </ThemeProvider>,
  );

describe("Integración — Flujo de login", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("login ADMIN: navega a /all-tickets y guarda el token en localStorage", async () => {
    renderLoginFlow();

    await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "admin@cohispania.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText("Panel Admin")).toBeInTheDocument();
    });

    expect(localStorage.getItem("token")).toBe("fake-token-admin");
    expect(JSON.parse(localStorage.getItem("user"))).toMatchObject({
      name: "Admin Test",
      roles: ["ROLE_ADMIN"],
    });
  });

  it("login EMPLOYEE: navega a /my-tickets", async () => {
    server.use(
      http.post("http://localhost:8080/login", () =>
        HttpResponse.json(EMPLOYEE_RESPONSE, {
          headers: { Authorization: "Bearer fake-token-emp" },
        }),
      ),
    );

    renderLoginFlow();

    await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "emp@cohispania.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText("Mis Tickets")).toBeInTheDocument();
    });

    expect(localStorage.getItem("token")).toBe("fake-token-emp");
  });

  it("credenciales incorrectas: muestra error y no navega", async () => {
    server.use(http.post("http://localhost:8080/login", () => HttpResponse.json({ message: "Unauthorized" }, { status: 401 })));

    renderLoginFlow();

    await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "wrong@test.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText("Credenciales incorrectas. Comprueba tu email y contraseña.")).toBeInTheDocument();
    });

    expect(localStorage.getItem("token")).toBeNull();
    expect(screen.queryByText("Panel Admin")).not.toBeInTheDocument();
  });

  it("error de servidor 500: api.js asigna friendlyMessage y se muestra al usuario", async () => {
    server.use(http.post("http://localhost:8080/login", () => HttpResponse.json({ message: "Internal Server Error" }, { status: 500 })));

    renderLoginFlow();

    await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "test@test.com");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText("Ocurrió un error inesperado")).toBeInTheDocument();
    });
  });
});
