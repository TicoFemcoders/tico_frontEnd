import React from "react";
import { Chip } from "@mui/material";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LabelChip from "../components/common/LabelChip";

const theme = createTheme();

const renderWithTheme = (ui) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("LabelChip", () => {
    it("renderiza el nombre de la etiqueta", () => {
        renderWithTheme(
            <LabelChip label={{ name: "Bug", color: "#ff0000", isActive: true }} />
        );
        expect(screen.getByText("Bug")).toBeInTheDocument();
    });

    it("renderiza con string en lugar de objeto", () => {
        renderWithTheme(<LabelChip label="Feature" />);
        expect(screen.getByText("Feature")).toBeInTheDocument();
    });

    it("no renderiza nada si label es null", () => {
        const { container } = renderWithTheme(<LabelChip label={null} />);
        expect(container.firstChild).toBeNull();
    });

    it("no renderiza nada si label es undefined", () => {
        const { container } = renderWithTheme(<LabelChip label={undefined} />);
        expect(container.firstChild).toBeNull();
    });

    it("muestra el icono de desactivada cuando isActive es false", () => {
        renderWithTheme(
            <LabelChip label={{ name: "Obsoleta", color: "#cccccc", isActive: false }} />
        );
        expect(screen.getByText("Obsoleta")).toBeInTheDocument();
        expect(document.querySelector("svg")).toBeInTheDocument();
    });

    it("no muestra icono de desactivada cuando isActive es true", () => {
        renderWithTheme(
            <LabelChip label={{ name: "Activa", color: "#00ff00", isActive: true }} />
        );
        expect(screen.getByText("Activa")).toBeInTheDocument();
    });
});