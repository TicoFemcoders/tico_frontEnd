import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme.js";
import AlertModal from "../components/modals/AlertModal";

const renderAlertModal = (props) =>
    render(
        <ThemeProvider theme={theme}>
            <AlertModal {...props} />
        </ThemeProvider>
    );

describe("AlertModal", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza el título y el mensaje cuando se pasan", () => {
        renderAlertModal({
            open: true,
            onClose: vi.fn(),
            title: "Título test",
            message: "Este es el mensaje",
        });

        expect(screen.getByText("Título test")).toBeInTheDocument();
        expect(screen.getByText("Este es el mensaje")).toBeInTheDocument();
    });

    it("cuando open=false no muestra el contenido", () => {
        renderAlertModal({
            open: false,
            onClose: vi.fn(),
            title: "Título test",
            message: "Este es el mensaje",
        });

        expect(screen.queryByText("Este es el mensaje")).not.toBeInTheDocument();
    });

    it("renderiza el icono cuando se pasa", () => {
        renderAlertModal({
            open: true,
            onClose: vi.fn(),
            title: "Título test",
            icon: <span data-testid="icono-test">🔔</span>,
        });

        expect(screen.getByTestId("icono-test")).toBeInTheDocument();
    });

    it("no renderiza el icono cuando no se pasa", () => {
        renderAlertModal({
            open: true,
            onClose: vi.fn(),
            title: "Título test",
            message: "Mensaje",
        });

        expect(screen.queryByTestId("icono-test")).not.toBeInTheDocument();
    });

    it("no renderiza el mensaje cuando no se pasa", () => {
        renderAlertModal({
            open: true,
            onClose: vi.fn(),
            title: "Título test",
        });

        expect(screen.queryByText("Este es el mensaje")).not.toBeInTheDocument();
    });

    it("click en el botón Cerrar llama a onClose", async () => {
        const onCloseMock = vi.fn();

        renderAlertModal({
            open: true,
            onClose: onCloseMock,
            title: "Título test",
            message: "Mensaje",
        });

        await userEvent.click(screen.getByRole("button", { name: /cerrar/i }));

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("usa closeLabel personalizado si se pasa", () => {
        renderAlertModal({
            open: true,
            onClose: vi.fn(),
            title: "Título test",
            message: "Mensaje",
            closeLabel: "Entendido",
        });

        expect(screen.getByRole("button", { name: /entendido/i })).toBeInTheDocument();
    });

    it("renderiza children cuando se pasan", () => {
        renderAlertModal({
            open: true,
            onClose: vi.fn(),
            title: "Título test",
            children: <p>Contenido hijo</p>,
        });

        expect(screen.getByText("Contenido hijo")).toBeInTheDocument();
    });
});
