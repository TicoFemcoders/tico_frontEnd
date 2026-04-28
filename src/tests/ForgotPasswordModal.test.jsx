import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme.js";
import ForgotPasswordModal from "../components/login/ForgotPasswordModal.jsx";

vi.mock("../services/authService.js", () => ({
  requestPasswordReset: vi.fn(),
}));

import { requestPasswordReset } from "../services/authService.js";

const mockOnClose = vi.fn();
const mockOnSuccess = vi.fn();

const renderModal = (props = {}) =>
  render(
    <ThemeProvider theme={theme}>
      <ForgotPasswordModal open={true} onClose={mockOnClose} onSuccess={mockOnSuccess} {...props} />
    </ThemeProvider>,
  );

describe("ForgotPasswordModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el modal correctamente cuando está abierto", () => {
    renderModal();
    expect(screen.getByText("Recupera tu contraseña")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("tu.nombre@cohispania.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enviar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
  });

  it("no muestra el modal cuando open es false", () => {
    renderModal({ open: false });
    expect(screen.queryByText("Recupera tu contraseña")).not.toBeInTheDocument();
  });

  it("muestra error si se envía sin email", async () => {
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));
    expect(screen.getByText("Introduce tu correo electrónico.")).toBeInTheDocument();
  });

  it("llama a requestPasswordReset con el email introducido", async () => {
    requestPasswordReset.mockResolvedValueOnce({});
    renderModal();
    await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "ana@cohispania.com");
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));
    await waitFor(() => {
      expect(requestPasswordReset).toHaveBeenCalledWith("ana@cohispania.com");
    });
  });

  it("llama a onSuccess con el mensaje correcto tras un envío exitoso", async () => {
    requestPasswordReset.mockResolvedValueOnce({});
    renderModal();
    await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "ana@cohispania.com");
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith("Si el email está registrado, recibirás las instrucciones en breve.");
    });
  });

  it("llama a onSuccess en un error 404 para no revelar si el email existe", async () => {
    requestPasswordReset.mockRejectedValueOnce({ response: { status: 404 } });
    renderModal();
    await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "noexiste@cohispania.com");
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith("Si el email está registrado, recibirás las instrucciones en breve.");
    });
  });

  it("llama a onClose en un error 404", async () => {
    requestPasswordReset.mockRejectedValueOnce({ response: { status: 404 } });
    renderModal();
    await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "noexiste@cohispania.com");
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("muestra el friendlyMessage del error de servidor", async () => {
    requestPasswordReset.mockRejectedValueOnce({ friendlyMessage: "Servicio no disponible." });
    renderModal();
    await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "ana@cohispania.com");
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));
    await waitFor(() => {
      expect(screen.getByText("Servicio no disponible.")).toBeInTheDocument();
    });
  });

  it("muestra error genérico si no hay friendlyMessage", async () => {
    requestPasswordReset.mockRejectedValueOnce({});
    renderModal();
    await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "ana@cohispania.com");
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));
    await waitFor(() => {
      expect(screen.getByText("Error al conectar con el servidor. Inténtalo de nuevo.")).toBeInTheDocument();
    });
  });

  it("llama a onClose al hacer click en Cancelar", async () => {
    renderModal();
    await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("limpia el email y el error al cerrar", async () => {
    requestPasswordReset.mockRejectedValueOnce({});
    renderModal();
    const input = screen.getByPlaceholderText("tu.nombre@cohispania.com");
    await userEvent.type(input, "ana@cohispania.com");
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));
    await waitFor(() => screen.getByText("Error al conectar con el servidor. Inténtalo de nuevo."));

    await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(input).toHaveValue("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("envía el formulario al presionar Enter en el campo email", async () => {
    requestPasswordReset.mockResolvedValueOnce({});
    renderModal();
    await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "ana@cohispania.com{Enter}");
    await waitFor(() => {
      expect(requestPasswordReset).toHaveBeenCalledWith("ana@cohispania.com");
    });
  });
});
