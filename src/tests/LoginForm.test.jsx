import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme.js";
import LoginForm from "../components/login/LoginForm.jsx";


const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

const mockLogin = vi.fn();
vi.mock("../context/useAuth.js", () => ({
    useAuth: () => ({ login: mockLogin }),
}));

vi.mock("../services/authService.js", () => ({
    login: vi.fn(),
}));

vi.mock("../components/login/ForgotPasswordModal.jsx", () => ({
    default: () => <div />,
}));

vi.mock("../components/common/TicoLogo.jsx", () => ({
    default: () => <div />,
}));

import * as authService from "../services/authService.js";

// ── Helper ─────────────────────────────────
const renderLoginForm = () =>
    render(
        <ThemeProvider theme={theme}>
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        </ThemeProvider>
    );


describe("LoginForm", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza el formulario correctamente", () => {
        renderLoginForm();
        expect(screen.getByPlaceholderText("tu.nombre@cohispania.com")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
    });

    it("muestra error si los campos están vacíos", async () => {
        renderLoginForm();
        await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
        expect(screen.getByText("Rellena todos los campos.")).toBeInTheDocument();
    });

    it("muestra error si solo falta la contraseña", async () => {
        renderLoginForm();
        await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "test@test.com");
        await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
        expect(screen.getByText("Rellena todos los campos.")).toBeInTheDocument();
    });

    it("llama a authService.login con las credenciales correctas", async () => {
        authService.login.mockResolvedValueOnce({
            headers: { authorization: "Bearer token123" },
            data: { userId: 1, name: "Admin", email: "admin@test.com", roles: ["ROLE_ADMIN"] },
        });
        renderLoginForm();
        await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "admin@test.com");
        await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
        await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({

                email: "admin@test.com",
                password: "password123",
            });
        });
    });

    it("redirige a /all-tickets si el usuario es ADMIN", async () => {
        authService.login.mockResolvedValueOnce({
            headers: { authorization: "Bearer token123" },
            data: { userId: 1, name: "Admin", email: "admin@test.com", roles: ["ROLE_ADMIN"] },
        });
        renderLoginForm();
        await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "admin@test.com");
        await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
        await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/all-tickets", { replace: true });
        });
    });

    it("redirige a /my-tickets si el usuario es EMPLOYEE", async () => {
        authService.login.mockResolvedValueOnce({
            headers: { authorization: "Bearer token123" },
            data: { userId: 2, name: "Empleado", email: "emp@test.com", roles: ["ROLE_EMPLOYEE"] },
        });
        renderLoginForm();
        await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "emp@test.com");
        await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
        await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/my-tickets", { replace: true });
        });
    });

    it("muestra error 401 con credenciales incorrectas", async () => {
        authService.login.mockRejectedValueOnce({ response: { status: 401 } });
        renderLoginForm();
        await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "wrong@test.com");
        await userEvent.type(screen.getByPlaceholderText("••••••••"), "wrongpassword");
        await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
        await waitFor(() => {
            expect(screen.getByText("Credenciales incorrectas. Comprueba tu email y contraseña.")).toBeInTheDocument();
        });
    });

    it("muestra error de servidor si falla con otro código", async () => {
        authService.login.mockRejectedValueOnce({ response: { status: 500 } });
        renderLoginForm();
        await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "test@test.com");
        await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
        await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
        await waitFor(() => {
            expect(screen.getByText("Error del servidor. Inténtalo de nuevo.")).toBeInTheDocument();
        });
    });

    it("llama a login del AuthContext con la respuesta del servidor", async () => {
        const mockResponse = {
            headers: { authorization: "Bearer token123" },
            data: { userId: 1, name: "Admin", email: "admin@test.com", roles: ["ROLE_ADMIN"] },
        };
        authService.login.mockResolvedValueOnce(mockResponse);
        renderLoginForm();
        await userEvent.type(screen.getByPlaceholderText("tu.nombre@cohispania.com"), "admin@test.com");
        await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
        await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(mockResponse);
        });
    });
});