import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatCards from "../components/myTickets/StatCards.jsx";

const mockStats = [
  { label: "Total", value: 10, color: "#f28a2e" },
  { label: "Abiertos", value: 4, color: "#202B45" },
  { label: "Cerrados", value: 6, color: "#4caf50" },
];

describe("StatCards", () => {
  it("renderiza una card por cada stat", () => {
    render(<StatCards stats={mockStats} />);
    expect(screen.getAllByRole("article")).toHaveLength(mockStats.length);
  });

  it("muestra el label de cada stat", () => {
    render(<StatCards stats={mockStats} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Abiertos")).toBeInTheDocument();
    expect(screen.getByText("Cerrados")).toBeInTheDocument();
  });

  it("muestra el valor de cada stat", () => {
    render(<StatCards stats={mockStats} />);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("el contenedor tiene el aria-label de estadísticas", () => {
    render(<StatCards stats={mockStats} />);
    expect(screen.getByRole("region", { name: /estadísticas de tickets/i })).toBeInTheDocument();
  });

  it("no renderiza cards si stats está vacío", () => {
    render(<StatCards stats={[]} />);
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });

  it("renderiza correctamente con una sola stat", () => {
    render(<StatCards stats={[{ label: "Pendientes", value: 2, color: "#ff0000" }]} />);
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Pendientes")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
