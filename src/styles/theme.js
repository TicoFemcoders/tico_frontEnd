import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f28a2e",
      dark: "#d4761f",
      light: "#fef3e2",
      contrastText: "#fff",
    },
    secondary: {
      main: "#202B45",
      dark: "#1c2845",
      light: "#2b3a5e",
      contrastText: "#fff",
    },
    error: { main: "#ef4444" },
    warning: { main: "#f59e0b" },
    success: { main: "#10b981" },
    background: {
      default: "#EDEEF0",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      mid: "#374151",
      secondary: "#6b7280",
      subtle: "#9ca3af",
    },

    border: {
      main: "#d1d5db",
      soft: "#e5e7eb",
    },

    blueAccent: {
      main: "#43598f",
    },

    navbar: {
      bg: "#1c2845",
      border: "rgba(255,255,255,0.07)",
      active: "#f28a2e",
      text: "rgba(255,255,255,0.4)",
    },

    status: {
      open: { bg: "#dbeafe", text: "#1e40af" },
      inProg: { bg: "#fef3c7", text: "#92400e" },
      closed: { bg: "#d1fae5", text: "#065f46" },
    },
    priority: {
      urgent: { bg: "#fee2e2", text: "#991b1b" },
      high: { bg: "#ffedd5", text: "#9a3412" },
      medium: { bg: "#fef9c3", text: "#854d0e" },
      low: { bg: "#f0fdf4", text: "#166534" },
    },












    dateStatus: {
      created: "#1976D2",
      updated: "#ED6C02",
      closed: "#2E7D32",
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, sans-serif",
    h1: { fontSize: "20px", fontWeight: 700 },
    h2: { fontSize: "16px", fontWeight: 700 },
    h3: { fontSize: "14px", fontWeight: 600 },
    body1: { fontSize: "13px", color: "#374151" },
    body2: { fontSize: "12px" },
  },
  shape: {
    borderRadius: 7,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, fontSize: "13px" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: "11px" },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { background: "#FAFAFA" },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontSize: "11px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" },
        body: { fontSize: "13px", color: "#374151" },
      },
    },
  },
});

theme.customShadows = {
  card: "0 20px 60px rgba(0,0,0,0.35)",
};

export default theme;