import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme.js";
import CreateTicketForm from "../components/tickets/CreateTicketForm.jsx";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../context/useAuth.js", () => ({
  useAuth: () => ({ user: { name: "Test User" } }),
}));

vi.mock("../services/ticketService", () => ({
  createTicket: vi.fn(),
}));

vi.mock("../services/labelService", () => ({
  labelService: { getActiveLabels: vi.fn() },
}));

const mockEnqueueSnackbar = vi.fn();
vi.mock("notistack", () => ({
  useSnackbar: () => ({ enqueueSnackbar: mockEnqueueSnackbar }),
}));

vi.mock("../components/common/LabelChip.jsx", () => ({
  default: ({ label, onDelete }) =>
    label ? (
      <span data-testid="label-chip" onClick={onDelete}>
        {label.name}
      </span>
    ) : null,
}));

import * as ticketService from "../services/ticketService";
import { labelService } from "../services/labelService";

const mockLabels = [
  { id: 1, name: "Bug", color: "#ff0000", isActive: true },
  { id: 2, name: "Feature", color: "#00ff00", isActive: true },
];

const renderCreateTicketForm = () =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <CreateTicketForm />
      </MemoryRouter>
    </ThemeProvider>,
  );

const fillValidForm = async () => {
  await waitFor(() => expect(labelService.getActiveLabels).toHaveBeenCalled());

  await userEvent.type(screen.getByPlaceholderText("Describe brevemente el problema..."), "Problema con el sistema");
  await userEvent.type(screen.getByPlaceholderText("Explica con detalle el problema..."), "Descripción detallada del problema encontrado");

  const [, prioritySelect] = screen.getAllByRole("combobox");
  await userEvent.click(prioritySelect);
  await userEvent.click(await screen.findByRole("option", { name: /urgente/i }));

  const [labelSelect] = screen.getAllByRole("combobox");
  await userEvent.click(labelSelect);
  await userEvent.click(await screen.findByRole("option", { name: /bug/i }));
  await userEvent.keyboard("{Escape}");
};

describe("CreateTicketForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    labelService.getActiveLabels.mockResolvedValue([]);
  });

  it("renderiza el formulario correctamente", () => {
    renderCreateTicketForm();
    expect(screen.getByPlaceholderText("Describe brevemente el problema...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Explica con detalle el problema...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enviar ticket/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
  });

  it("carga las etiquetas activas al montar el componente", async () => {
    labelService.getActiveLabels.mockResolvedValue(mockLabels);
    renderCreateTicketForm();
    await waitFor(() => {
      expect(labelService.getActiveLabels).toHaveBeenCalledTimes(1);
    });
  });

  it("muestra todos los errores de validación al enviar el formulario vacío", async () => {
    renderCreateTicketForm();
    await userEvent.click(screen.getByRole("button", { name: /enviar ticket/i }));
    expect(screen.getByText("El asunto debe tener entre 5 y 100 caracteres.")).toBeInTheDocument();
    expect(screen.getByText("La descripción debe tener entre 10 y 500 caracteres.")).toBeInTheDocument();
    expect(screen.getByText("Se requiere seleccionar prioridad.")).toBeInTheDocument();
    expect(screen.getByText("Se requiere seleccionar al menos una etiqueta.")).toBeInTheDocument();
  });

  it("muestra error si el título es demasiado corto", async () => {
    renderCreateTicketForm();
    await userEvent.type(screen.getByPlaceholderText("Describe brevemente el problema..."), "abc");
    await userEvent.click(screen.getByRole("button", { name: /enviar ticket/i }));
    expect(screen.getByText("El asunto debe tener entre 5 y 100 caracteres.")).toBeInTheDocument();
  });

  it("muestra error si la descripción es demasiado corta", async () => {
    renderCreateTicketForm();
    await userEvent.type(screen.getByPlaceholderText("Explica con detalle el problema..."), "corta");
    await userEvent.click(screen.getByRole("button", { name: /enviar ticket/i }));
    expect(screen.getByText("La descripción debe tener entre 10 y 500 caracteres.")).toBeInTheDocument();
  });

  it("navega a /my-tickets al hacer click en Cancelar", async () => {
    renderCreateTicketForm();
    await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/my-tickets");
  });

  it("llama a ticketService.createTicket con los datos del formulario", async () => {
    labelService.getActiveLabels.mockResolvedValue(mockLabels);
    ticketService.createTicket.mockResolvedValueOnce({});
    renderCreateTicketForm();

    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /enviar ticket/i }));

    await waitFor(() => {
      expect(ticketService.createTicket).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Problema con el sistema",
          description: "Descripción detallada del problema encontrado",
          priority: "CRITICAL",
          labelIds: [1],
        }),
      );
    });
  });

  it("redirige a /my-tickets tras crear el ticket exitosamente", async () => {
    labelService.getActiveLabels.mockResolvedValue(mockLabels);
    ticketService.createTicket.mockResolvedValueOnce({});
    renderCreateTicketForm();

    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /enviar ticket/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/my-tickets");
    });
  });

  it("muestra snackbar de éxito tras crear el ticket", async () => {
    labelService.getActiveLabels.mockResolvedValue(mockLabels);
    ticketService.createTicket.mockResolvedValueOnce({});
    renderCreateTicketForm();

    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /enviar ticket/i }));

    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Ticket creado correctamente.", { variant: "success" });
    });
  });

  it("muestra snackbar de error si falla la creación del ticket", async () => {
    labelService.getActiveLabels.mockResolvedValue(mockLabels);
    ticketService.createTicket.mockRejectedValueOnce({ friendlyMessage: "Error al conectar con el servidor." });
    renderCreateTicketForm();

    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /enviar ticket/i }));

    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Error al conectar con el servidor.", { variant: "error" });
    });
  });

  it("muestra el mensaje de error genérico si no hay friendlyMessage", async () => {
    labelService.getActiveLabels.mockResolvedValue(mockLabels);
    ticketService.createTicket.mockRejectedValueOnce({});
    renderCreateTicketForm();

    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /enviar ticket/i }));

    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Error al enviar el ticket. Inténtalo de nuevo.", { variant: "error" });
    });
  });
});
