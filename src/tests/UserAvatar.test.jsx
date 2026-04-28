import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme.js";
import UserAvatar from "../components/common/UserAvatar";

const renderUserAvatar = (props) =>
    render(
        <ThemeProvider theme={theme}>
            <UserAvatar {...props} />
        </ThemeProvider>
    );

describe("UserAvatar", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza las iniciales de nombre y apellido", () => {
        renderUserAvatar({ name: "Sukaina Hadani", role: "EMPLOYEE" });

        expect(screen.getByText("SH")).toBeInTheDocument();
    });

    it("renderiza las iniciales de un nombre diferente", () => {
        renderUserAvatar({ name: "María García", role: "ADMIN" });

        expect(screen.getByText("MG")).toBeInTheDocument();
    });

    it("renderiza solo la primera inicial cuando el nombre tiene una sola palabra", () => {
        renderUserAvatar({ name: "Carlos", role: "EMPLOYEE" });

        expect(screen.getByText("C")).toBeInTheDocument();
    });

    it("muestra como máximo 2 iniciales aunque el nombre tenga más palabras", () => {
        renderUserAvatar({ name: "Ana María López García", role: "EMPLOYEE" });

        expect(screen.getByText("AM")).toBeInTheDocument();
    });

    it("renderiza el avatar con rol ADMIN", () => {
        renderUserAvatar({ name: "Admin User", role: "ADMIN" });

        expect(screen.getByText("AU")).toBeInTheDocument();
    });

    it("renderiza el avatar con rol EMPLOYEE", () => {
        renderUserAvatar({ name: "Employee User", role: "EMPLOYEE" });

        expect(screen.getByText("EU")).toBeInTheDocument();
    });
});
