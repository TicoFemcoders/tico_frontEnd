import React from "react";
import { describe, it, expect, beforeAll, afterEach, afterAll, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import theme from "../../styles/theme.js";
import { AuthProvider } from "../../context/AuthContext.jsx";
import CreateTicketForm from "../../components/tickets/CreateTicketForm.jsx";

const MOCK_LABELS = [
  { id: 1, name: "Bug", color: "#ff0000", isActive: true },
  { id: 2, name: "Feature", color: "#00cc00", isActive: true },
];

const MOCK_TICKET = {
  id: 42,
  title: "Problema con el sistema",
  status: "OPEN",
};

const server = setupServer(
  http.get("http://localhost:8080/api/labels/active", () => HttpResponse.json(MOCK_LABELS)),
  http.post("http://localhost:8080/api/tickets", () => HttpResponse.json(MOCK_TICKET, { status: 201 })),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderCreateTicketFlow = () =>
  render(
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={["/tickets/new"]}>
            <Routes>
              <Route path="/tickets/new" element={<CreateTicketForm />} />
              <Route path="/my-tickets" element={<div>Lista de mis tickets</div>} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>,
  );

describe("Integración — Flujo de creación de ticket", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-employee-token");
    localStorage.setItem("user", JSON.stringify({ id: 5, name: "Ana García", roles: ["ROLE_EMPLOYEE"] }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("carga las etiquetas de la API y las muestra en el selector", async () => {
    renderCreateTicketFlow();

    const [labelSelect] = await screen.findAllByRole("combobox");
    await userEvent.click(labelSelect);

    await waitFor(() => {
      expect(screen.getByRole("option", { name: /bug/i })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: /feature/i })).toBeInTheDocument();
    });
  });

  it("ticket creado exitosamente: navega a /my-tickets", async () => {
    renderCreateTicketFlow();

    await waitFor(() => expect(screen.getAllByRole("combobox").length).toBeGreaterThan(0));

    await userEvent.type(screen.getByPlaceholderText("Describe brevemente el problema..."), "Problema con el sistema");
    await userEvent.type(screen.getByPlaceholderText("Explica con detalle el problema..."), "Descripción detallada del problema encontrado");

    const [, prioritySelect] = await screen.findAllByRole("combobox");
    await userEvent.click(prioritySelect);
    await userEvent.click(await screen.findByRole("option", { name: /urgente/i }));

    const [labelSelect] = await screen.findAllByRole("combobox");
    await userEvent.click(labelSelect);
    await userEvent.click(await screen.findByRole("option", { name: /bug/i }));
    await userEvent.keyboard("{Escape}");

    await userEvent.click(screen.getByRole("button", { name: /enviar ticket/i }));

    await waitFor(() => {
      expect(screen.getByText("Lista de mis tickets")).toBeInTheDocument();
    });
  }, 15000);

  it("error al crear ticket: la API devuelve 500 y el formulario no navega", async () => {
    server.use(http.post("http://localhost:8080/api/tickets", () => HttpResponse.json({ mensaje: "Error interno del servidor" }, { status: 500 })));

    renderCreateTicketFlow();

    await waitFor(() => expect(screen.getAllByRole("combobox").length).toBeGreaterThan(0));

    await userEvent.type(screen.getByPlaceholderText("Describe brevemente el problema..."), "Problema con el sistema");
    await userEvent.type(screen.getByPlaceholderText("Explica con detalle el problema..."), "Descripción detallada del problema encontrado");

    const [, prioritySelect] = await screen.findAllByRole("combobox");
    await userEvent.click(prioritySelect);
    await userEvent.click(await screen.findByRole("option", { name: /urgente/i }));

    const [labelSelect] = await screen.findAllByRole("combobox");
    await userEvent.click(labelSelect);
    await userEvent.click(await screen.findByRole("option", { name: /bug/i }));
    await userEvent.keyboard("{Escape}");

    await userEvent.click(screen.getByRole("button", { name: /enviar ticket/i }));

    await waitFor(() => {
      expect(screen.queryByText("Lista de mis tickets")).not.toBeInTheDocument();
    });
  }, 15000);
});
