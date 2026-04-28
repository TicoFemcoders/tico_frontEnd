import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AuthCodeForm from "../components/auth/AuthCodeForm.jsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme.js";


const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../components/auth/CodeInputs.jsx", () => ({
    default: ({ value, onChange }) => (
        <input
            data-testid="code-input"
            value={value.join("")}
            onChange={(e) => {
                const chars = e.target.value.padEnd(6, "").split("").slice(0, 6);
                onChange(chars);
            }}
            maxLength={6}
        />
    ),
}));

const mockSubmitFn = vi.fn();
const mockResendFn  = vi.fn();

const renderForm = (email = "test@cohispania.com") =>
    render(
        <ThemeProvider theme={theme}>
            <MemoryRouter initialEntries={[`/activation?email=${email}`]}>
                <AuthCodeForm
                    title="Activa tu cuenta"
                    buttonLabel="Activar cuenta"
                    submitFn={mockSubmitFn}
                    resendFn={mockResendFn}
                    successPath="/login?activated=1"
                />
            </MemoryRouter>
        </ThemeProvider>
    );

describe("AuthCodeForm", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza el título y el email", () => {
        renderForm();
        expect(screen.getByText("Activa tu cuenta")).toBeInTheDocument();
        expect(screen.getByText("test@cohispania.com")).toBeInTheDocument();
    });

    it("muestra error si el código está incompleto", async () => {
        renderForm();
        await userEvent.click(screen.getByRole("button", { name: /activar cuenta/i }));
        expect(screen.getByText("Introduce los 6 caracteres del código.")).toBeInTheDocument();
    });

    it("muestra error si la contraseña es menor de 8 caracteres", async () => {
        renderForm();
        await userEvent.type(screen.getByTestId("code-input"), "ABC123");
        await userEvent.type(screen.getByPlaceholderText("Mínimo 8 caracteres"), "corta");
        await userEvent.click(screen.getByRole("button", { name: /activar cuenta/i }));
        expect(screen.getByText("La contraseña debe tener al menos 8 caracteres.")).toBeInTheDocument();
    });

    it("muestra error si las contraseñas no coinciden", async () => {
        renderForm();
        await userEvent.type(screen.getByTestId("code-input"), "ABC123");
        await userEvent.type(screen.getByPlaceholderText("Mínimo 8 caracteres"), "contraseña1");
        await userEvent.type(screen.getByPlaceholderText("Repite la contraseña"), "contraseña2");
        await userEvent.click(screen.getByRole("button", { name: /activar cuenta/i }));
        expect(screen.getByText("Las contraseñas no coinciden.")).toBeInTheDocument();
    });

    it("llama a submitFn con los datos correctos", async () => {
        mockSubmitFn.mockResolvedValueOnce({});
        renderForm();
        await userEvent.type(screen.getByTestId("code-input"), "ABC123");
        await userEvent.type(screen.getByPlaceholderText("Mínimo 8 caracteres"), "contraseña123");
        await userEvent.type(screen.getByPlaceholderText("Repite la contraseña"), "contraseña123");
        await userEvent.click(screen.getByRole("button", { name: /activar cuenta/i }));
        await waitFor(() => {
            expect(mockSubmitFn).toHaveBeenCalledWith({
                email: "test@cohispania.com",
                code: "ABC123",
                password: "contraseña123",
                confirmPassword: "contraseña123",
            });
        });
    });

    it("navega a successPath tras activar correctamente", async () => {
        mockSubmitFn.mockResolvedValueOnce({});
        renderForm();
        await userEvent.type(screen.getByTestId("code-input"), "ABC123");
        await userEvent.type(screen.getByPlaceholderText("Mínimo 8 caracteres"), "contraseña123");
        await userEvent.type(screen.getByPlaceholderText("Repite la contraseña"), "contraseña123");
        await userEvent.click(screen.getByRole("button", { name: /activar cuenta/i }));
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login?activated=1");
        });
    });

    it("muestra error si submitFn falla", async () => {
        mockSubmitFn.mockRejectedValueOnce({
            response: { data: { message: "Código inválido." } }
        });
        renderForm();
        await userEvent.type(screen.getByTestId("code-input"), "ABC123");
        await userEvent.type(screen.getByPlaceholderText("Mínimo 8 caracteres"), "contraseña123");
        await userEvent.type(screen.getByPlaceholderText("Repite la contraseña"), "contraseña123");
        await userEvent.click(screen.getByRole("button", { name: /activar cuenta/i }));
        await waitFor(() => {
            expect(screen.getByText("Código inválido.")).toBeInTheDocument();
        });
    });

    it("llama a resendFn al hacer clic en reenviar", async () => {
        mockResendFn.mockResolvedValueOnce({});
        renderForm();
        await userEvent.click(screen.getByText(/no he recibido el código/i));
        await waitFor(() => {
            expect(mockResendFn).toHaveBeenCalledWith("test@cohispania.com");
        });
    });

    it("muestra mensaje de éxito tras reenviar", async () => {
        mockResendFn.mockResolvedValueOnce({});
        renderForm();
        await userEvent.click(screen.getByText(/no he recibido el código/i));
        await waitFor(() => {
            expect(screen.getByText("Te hemos enviado un nuevo código.")).toBeInTheDocument();
        });
    });
});