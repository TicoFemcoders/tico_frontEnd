import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RoleRoute from "../routes/RoleRoute";

// Mock useAuth
vi.mock("../context/useAuth", () => ({
    useAuth: vi.fn(),
}));

import { useAuth } from "../context/useAuth";

const renderWithRouter = (ui, { initialEntries = ["/"] } = {}) =>
    render(
        <MemoryRouter initialEntries={initialEntries}>
            <Routes>
                <Route path="/my-tickets" element={<div>Mis Tickets</div>} />
                <Route path="/" element={ui} />
            </Routes>
        </MemoryRouter>
    );

describe("RoleRoute", () => {
    it("redirige a /my-tickets si no tiene el rol correcto", () => {
        useAuth.mockReturnValue({ hasRole: () => false });

        renderWithRouter(
            <RoleRoute role="ROLE_ADMIN">
                <div>Panel Admin</div>
            </RoleRoute>
        );

        expect(screen.getByText("Mis Tickets")).toBeInTheDocument();
        expect(screen.queryByText("Panel Admin")).not.toBeInTheDocument();
    });

    it("renderiza los children si tiene el rol correcto", () => {
        useAuth.mockReturnValue({ hasRole: () => true });

        renderWithRouter(
            <RoleRoute role="ROLE_ADMIN">
                <div>Panel Admin</div>
            </RoleRoute>
        );

        expect(screen.getByText("Panel Admin")).toBeInTheDocument();
        expect(screen.queryByText("Mis Tickets")).not.toBeInTheDocument();
    });
});