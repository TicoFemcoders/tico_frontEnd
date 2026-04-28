import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme.js";
import AppModal from "../components/common/AppModal";

const renderAppModal = (props, children = <p>Contenido del modal</p>) =>
    render(
        <ThemeProvider theme={theme}>
            <AppModal {...props}>{children}</AppModal>
        </ThemeProvider>
    );

describe("AppModal", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("cuando open=true renderiza el título y los children", () => {
        renderAppModal({ open: true, onClose: vi.fn(), title: "Título test" });

        expect(screen.getByText("Título test")).toBeInTheDocument();
        expect(screen.getByText("Contenido del modal")).toBeInTheDocument();
    });

    it("cuando open=false no muestra el contenido", () => {
        renderAppModal({ open: false, onClose: vi.fn(), title: "Título test" });

        expect(screen.queryByText("Contenido del modal")).not.toBeInTheDocument();
    });

    it("renderiza las actions cuando se pasan", () => {
        renderAppModal({
            open: true,
            onClose: vi.fn(),
            title: "Título test",
            actions: <button>Confirmar</button>,
        });

        expect(screen.getByRole("button", { name: /confirmar/i })).toBeInTheDocument();
    });

    it("no renderiza actions cuando no se pasan", () => {
        renderAppModal({ open: true, onClose: vi.fn(), title: "Título test" });

        expect(screen.queryByRole("button", { name: /confirmar/i })).not.toBeInTheDocument();
    });

    it("llama a onClose cuando se pulsa el botón X", async () => {
        const onCloseMock = vi.fn();

        renderAppModal({ open: true, onClose: onCloseMock, title: "Título test" });

        await userEvent.click(screen.getByRole("button"));

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it("renderiza el título correctamente", () => {
        renderAppModal({ open: true, onClose: vi.fn(), title: "Mi título personalizado" });

        expect(screen.getByText("Mi título personalizado")).toBeInTheDocument();
    });

    it("renderiza múltiples children cuando se pasan", () => {
        renderAppModal(
            { open: true, onClose: vi.fn(), title: "Título test" },
            <>
                <p>Primer párrafo</p>
                <p>Segundo párrafo</p>
            </>
        );

        expect(screen.getByText("Primer párrafo")).toBeInTheDocument();
        expect(screen.getByText("Segundo párrafo")).toBeInTheDocument();
    });
});
