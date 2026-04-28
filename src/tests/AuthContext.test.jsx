import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext.jsx";
import { useAuth } from "../context/useAuth.js";


vi.mock("../services/api.js", () => ({
    api: {
        create: vi.fn(),
        defaults: { headers: { common: {} } },
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() }
        }
    }
}));

const TestComponent = () => {
    const { user, token, hasRole, login, logout } = useAuth();
    return (
        <div>
            <span data-testid="user">{user ? user.name : "null"}</span>
            <span data-testid="token">{token ?? "null"}</span>
            <span data-testid="hasAdmin">{String(hasRole("ADMIN"))}</span>
            <span data-testid="hasEmployee">{String(hasRole("EMPLOYEE"))}</span>
            <button onClick={() => login({
                headers: { authorization: "Bearer token123" },
                data: { userId: 1, name: "Ana", email: "ana@test.com", roles: ["ROLE_ADMIN"] }
            })}>login</button>
            <button onClick={logout}>logout</button>
        </div>
    );
};

const renderWithProvider = () =>
    render(
        <AuthProvider>
            <TestComponent />
        </AuthProvider>
    );


describe("AuthContext", () => {

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("empieza sin usuario ni token", () => {
        renderWithProvider();
        expect(screen.getByTestId("user").textContent).toBe("null");
        expect(screen.getByTestId("token").textContent).toBe("null");
    });

    it("login guarda el usuario y el token", async () => {
        renderWithProvider();
        await act(async () => {
            screen.getByText("login").click();
        });
        expect(screen.getByTestId("user").textContent).toBe("Ana");
        expect(screen.getByTestId("token").textContent).toBe("token123");
    });

    it("login guarda el token en localStorage", async () => {
        renderWithProvider();
        await act(async () => {
            screen.getByText("login").click();
        });
        expect(localStorage.getItem("token")).toBe("token123");
    });

    it("login guarda el usuario en localStorage", async () => {
        renderWithProvider();
        await act(async () => {
            screen.getByText("login").click();
        });
        const stored = JSON.parse(localStorage.getItem("user"));
        expect(stored.name).toBe("Ana");
        expect(stored.email).toBe("ana@test.com");
    });

    it("hasRole devuelve true para el rol correcto", async () => {
        renderWithProvider();
        await act(async () => {
            screen.getByText("login").click();
        });
        expect(screen.getByTestId("hasAdmin").textContent).toBe("true");
        expect(screen.getByTestId("hasEmployee").textContent).toBe("false");
    });

    it("logout limpia el usuario y el token", async () => {
        renderWithProvider();
        await act(async () => {
            screen.getByText("login").click();
        });
        await act(async () => {
            screen.getByText("logout").click();
        });
        expect(screen.getByTestId("user").textContent).toBe("null");
        expect(screen.getByTestId("token").textContent).toBe("null");
    });

    it("logout limpia el localStorage", async () => {
        renderWithProvider();
        await act(async () => {
            screen.getByText("login").click();
        });
        await act(async () => {
            screen.getByText("logout").click();
        });
        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("user")).toBeNull();
    });

    it("recupera el usuario del localStorage al iniciar", () => {
        localStorage.setItem("token", "tokenGuardado");
        localStorage.setItem("user", JSON.stringify({
            id: 2, name: "Luis", email: "luis@test.com", roles: ["ROLE_EMPLOYEE"]
        }));
        renderWithProvider();
        expect(screen.getByTestId("user").textContent).toBe("Luis");
        expect(screen.getByTestId("token").textContent).toBe("tokenGuardado");
    });

    it("useAuth lanza error si se usa fuera del AuthProvider", () => {
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() => render(<TestComponent />)).toThrow("useAuth debe usarse dentro de un AuthProvider");
        spy.mockRestore();
    });
});