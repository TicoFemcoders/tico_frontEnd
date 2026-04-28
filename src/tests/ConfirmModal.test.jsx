import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme.js";
import ConfirmModal from "../components/modals/ConfirmModal";

const renderConfirmModal = (props) =>
    render(
        <ThemeProvider theme={theme}>
            <ConfirmModal {...props} />
        </ThemeProvider>
    );

describe("ConfirmModal", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza el título y el mensaje cuando se pasan", () => {
        renderConfirmModal({
            open: true,
            onClose: vi.fn(),
            onConfirm: vi.fn(),
            title: "Título test",
            message: "¿Estás seguro?",
        });

        expect(screen.getByText("Título test")).toBeInTheDocument();
        expect(screen.getByText("¿Estás seguro?")).toBeInTheDocument();
    });

    it("cuando open=false no muestra el contenido", () => {
        renderConfirmModal({
            open: false,
            onClose: vi.fn(),
            onConfirm: vi.fn(),
            title: "Título test",
            message: "¿Estás seguro?",
        });

        expect(screen.queryByText("¿Estás seguro?")).not.toBeInTheDocument();
    });

    it("no renderiza el mensaje cuando no se pasa", () => {
        renderConfirmModal({
            open: true,
            onClose: vi.fn(),
            onConfirm: vi.fn(),
            title: "Título test",
        });

        expect(screen.queryByText("¿Estás seguro?")).not.toBeInTheDocument();
    });

    it("click en Confirmar llama a onConfirm y no a onClose", async () => {
        const onConfirmMock = vi.fn();
        const onCloseMock = vi.fn();

        renderConfirmModal({
            open: true,
            onClose: onCloseMock,
            onConfirm: onConfirmMock,
            title: "Título test",
            message: "¿Estás seguro?",
        });

        await userEvent.click(screen.getByRole("button", { name: /confirmar/i }));

        expect(onConfirmMock).toHaveBeenCalledTimes(1);
        expect(onCloseMock).not.toHaveBeenCalled();
    });

    it("click en Cancelar llama a onClose y no a onConfirm", async () => {
        const onConfirmMock = vi.fn();
        const onCloseMock = vi.fn();

        renderConfirmModal({
            open: true,
            onClose: onCloseMock,
            onConfirm: onConfirmMock,
            title: "Título test",
            message: "¿Estás seguro?",
        });

        await userEvent.click(screen.getByRole("button", { name: /cancelar/i }));

        expect(onCloseMock).toHaveBeenCalledTimes(1);
        expect(onConfirmMock).not.toHaveBeenCalled();
    });

    it("usa confirmLabel personalizado si se pasa", () => {
        renderConfirmModal({
            open: true,
            onClose: vi.fn(),
            onConfirm: vi.fn(),
            title: "Título test",
            confirmLabel: "Sí, eliminar",
        });

        expect(screen.getByRole("button", { name: /sí, eliminar/i })).toBeInTheDocument();
    });

    it("usa cancelLabel personalizado si se pasa", () => {
        renderConfirmModal({
            open: true,
            onClose: vi.fn(),
            onConfirm: vi.fn(),
            title: "Título test",
            cancelLabel: "No, volver",
        });

        expect(screen.getByRole("button", { name: /no, volver/i })).toBeInTheDocument();
    });

    it("renderiza children cuando se pasan", () => {
        renderConfirmModal({
            open: true,
            onClose: vi.fn(),
            onConfirm: vi.fn(),
            title: "Título test",
            children: <p>Contenido adicional</p>,
        });

        expect(screen.getByText("Contenido adicional")).toBeInTheDocument();
    });
});
