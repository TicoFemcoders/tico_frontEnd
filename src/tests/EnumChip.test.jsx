import React from "react";
import Chip from "@mui/material/Chip";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import EnumChip from "../components/common/EnumChip";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "../utils/enums";

const theme = createTheme();

const renderWithTheme = (ui) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("EnumChip", () => {
    // ── STATUS ─────────────────────────────────────────────────────────────

    it("renderiza el chip de estado OPEN correctamente", () => {
        renderWithTheme(
            <EnumChip value="OPEN" config={STATUS_CONFIG} type="status" />
        );
        expect(screen.getByText("Abierto")).toBeInTheDocument();
    });

    it("renderiza el chip de estado IN_PROGRESS correctamente", () => {
        renderWithTheme(
            <EnumChip value="IN_PROGRESS" config={STATUS_CONFIG} type="status" />
        );
        expect(screen.getByText("En curso")).toBeInTheDocument();
    });

    it("renderiza el chip de estado CLOSED correctamente", () => {
        renderWithTheme(
            <EnumChip value="CLOSED" config={STATUS_CONFIG} type="status" />
        );
        expect(screen.getByText("Cerrado")).toBeInTheDocument();
    });

    // ── PRIORITY ───────────────────────────────────────────────────────────

    it("renderiza el chip de prioridad CRITICAL correctamente", () => {
        renderWithTheme(
            <EnumChip value="CRITICAL" config={PRIORITY_CONFIG} type="priority" />
        );
        expect(screen.getByText("Urgente")).toBeInTheDocument();
    });

    it("renderiza el chip de prioridad HIGH correctamente", () => {
        renderWithTheme(
            <EnumChip value="HIGH" config={PRIORITY_CONFIG} type="priority" />
        );
        expect(screen.getByText("Alta")).toBeInTheDocument();
    });

    it("renderiza el chip de prioridad MEDIUM correctamente", () => {
        renderWithTheme(
            <EnumChip value="MEDIUM" config={PRIORITY_CONFIG} type="priority" />
        );
        expect(screen.getByText("Media")).toBeInTheDocument();
    });

    it("renderiza el chip de prioridad LOW correctamente", () => {
        renderWithTheme(
            <EnumChip value="LOW" config={PRIORITY_CONFIG} type="priority" />
        );
        expect(screen.getByText("Baja")).toBeInTheDocument();
    });

    // ── EDGE CASES ─────────────────────────────────────────────────────────

    it("no renderiza nada si el valor no existe en el config", () => {
        const { container } = renderWithTheme(
            <EnumChip value="INEXISTENTE" config={STATUS_CONFIG} type="status" />
        );
        expect(container.firstChild).toBeNull();
    });
});