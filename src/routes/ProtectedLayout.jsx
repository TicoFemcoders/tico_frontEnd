import { useState } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/layout/Sidebar";

export default function ProtectedLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { md: "none" },
          bgcolor: "sidebar.bg",
          borderBottom: "1px solid",
          borderColor: "sidebar.border",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography sx={{ fontWeight: 700, letterSpacing: "-0.3px" }}>TICO</Typography>
        </Toolbar>
      </AppBar>

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <Box component="main" sx={{ flex: 1, p: 3, overflow: "auto", mt: { xs: 8, md: 0 } }}>
        <Outlet />
      </Box>
    </Box>
  );
}
