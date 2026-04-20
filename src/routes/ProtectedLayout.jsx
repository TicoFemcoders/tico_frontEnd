import { useState } from "react";
import { Outlet,  useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Navbar from "../components/layout/Navbar";
import TopBar from "../components/layout/TopBar";


const BREADCRUMBS_MAP = {
  "/my-tickets": [{ label: "Tickets" }, { label: "Mis tickets" }],
  "/assigned": [{ label: "Tickets" },{ label: "Tickets asignados" }], 
  "/all-tickets": [{ label: "Tickets" }, { label: "Todos los tickets" }],
  "/users": [{ label: "Gestión" }, { label: "Usuarios" }],
  "/labels": [{ label: "Gestión" }, { label: "Etiquetas" }],
  "/tickets": [
     { label: "Tickets", href: "/my-tickets" }, 
     { label: "Nuevo Ticket" }
  ]
};

export default function ProtectedLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation(); 
  let currentBreadcrumbs = BREADCRUMBS_MAP[location.pathname] || [];

  if (location.pathname.startsWith('/tickets/') && location.pathname !== '/tickets') {
    const ticketId = location.pathname.split('/').pop();
    const LastPage = location.state?.fromPath || "/my-tickets";
    currentBreadcrumbs = [
       { label: "Volver a la lista", href: LastPage }, 
       { label: `TIC-${ticketId}` }
    ];
  }
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { md: "none" },
          bgcolor: "navbar.bg",
          borderBottom: "1px solid",
          borderColor: "navbar.border",
        }}
      >
        <Toolbar>
          <IconButton aria-label="Abrir menú" color="inherit" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography component="span" sx={{ fontWeight: 700, letterSpacing: "-0.3px" }}>
            TICO
          </Typography>
        </Toolbar>
      </AppBar>

      <Navbar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column", mt: { xs: 8, md: 0 } }}>
        <TopBar breadcrumbs={currentBreadcrumbs} />
      
        <Box sx={{ flex: 1, p: 3, overflow: "auto", mt: { xs: 8, md: 0 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
