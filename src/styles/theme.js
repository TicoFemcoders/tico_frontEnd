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
      secondary: "#6b7280",
    },

    navbar: {
      bg: "#1c2845",
      border: "rgba(255,255,255,0.07)",
      active: "#f28a2e",
      text: "rgba(255,255,255,0.4)",
      textActive: "#ffffff",
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