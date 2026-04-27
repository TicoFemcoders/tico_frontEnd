import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getInitials } from "../utils/getInitials";
import { formatDate, formatDateTime } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";
import { getContrastText } from "../utils/getContrastText";

describe("getInitials", () => {
    it("devuelve las iniciales de dos palabras", () => {
        expect(getInitials("Ana García")).toBe("AG");
    });

    it("devuelve string vacío si el nombre es vacío", () => {
        expect(getInitials("")).toBe("");
    });

    it("devuelve solo una inicial si el nombre tiene una palabra", () => {
        expect(getInitials("Ana")).toBe("A");
    });

    it("devuelve máximo 2 iniciales aunque haya más palabras", () => {
        expect(getInitials("Ana María García")).toBe("AM");
    });

    it("devuelve las iniciales en mayúsculas", () => {
        expect(getInitials("ana garcía")).toBe("AG");
    });
});

describe("formatDate", () => {
    it("formatea una fecha válida en formato local", () => {
        const result = formatDate("2024-01-15");
        expect(result).toContain("15");
        expect(result).toContain("2024");
    });

    it("devuelve '-' si la fecha es null", () => {
        expect(formatDate(null)).toBe("-");
    });

    it("devuelve '-' si la fecha es undefined", () => {
        expect(formatDate(undefined)).toBe("-");
    });

    it("devuelve '-' si la fecha es string vacío", () => {
        expect(formatDate("")).toBe("-");
    });
});

describe("formatDateTime", () => {
    it("formatea una fecha y hora válida", () => {
        const result = formatDateTime("2024-01-15T10:30:00");
        expect(result).toContain("15");
        expect(result).toContain("2024");
    });

    it("devuelve '-' si la fecha es null", () => {
        expect(formatDateTime(null)).toBe("-");
    });
});

describe("formatTime", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2024-01-15T12:00:00"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("devuelve 'Ahora mismo' si han pasado menos de 1 minuto", () => {
        const fecha = new Date("2024-01-15T11:59:30").toISOString();
        expect(formatTime(fecha)).toBe("Ahora mismo");
    });

    it("devuelve 'Hace 30 min' si han pasado 30 minutos", () => {
        const fecha = new Date("2024-01-15T11:30:00").toISOString();
        expect(formatTime(fecha)).toBe("Hace 30 min");
    });

    it("devuelve 'Hace 5h' si han pasado 5 horas", () => {
        const fecha = new Date("2024-01-15T07:00:00").toISOString();
        expect(formatTime(fecha)).toBe("Hace 5h");
    });

    it("devuelve 'Hace 3d' si han pasado 3 días", () => {
        const fecha = new Date("2024-01-12T12:00:00").toISOString();
        expect(formatTime(fecha)).toBe("Hace 3d");
    });
});

describe("getContrastText", () => {
    it("devuelve '#000' para color claro (#FFFFFF)", () => {
        expect(getContrastText("#FFFFFF")).toBe("#000");
    });

    it("devuelve '#fff' para color oscuro (#000000)", () => {
        expect(getContrastText("#000000")).toBe("#fff");
    });

    it("devuelve '#fff' si no hay color", () => {
        expect(getContrastText(null)).toBe("#fff");
    });

    it("devuelve '#fff' si el color no empieza por #", () => {
        expect(getContrastText("rgb(255,255,255)")).toBe("#fff");
    });

    it("devuelve '#fff' si el color es undefined", () => {
        expect(getContrastText(undefined)).toBe("#fff");
    });
});