import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import { useAuth } from "../../context/useAuth";

const DRAWER_WIDTH = 240;

function NavContent({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 18, color: "#ffffff", letterSpacing: "-0.3px" }}>
          TICO
        </Typography>
        <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
          Tickets CoHispania
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "navbar.border" }} />

      {/* Navegación */}
      <Box sx={{ px: 1.5, pt: 2, flex: 1 }}>
        <List disablePadding>

          {/* Mis tickets */}
          <ListItemButton
            selected={location.pathname === "/dashboard-employee"}
            onClick={() => handleNavigate("/dashboard-employee")}
            sx={{
              borderRadius: 1.5,
              mb: 0.5,
              color: "rgba(255,255,255,0.75)",
              "&.Mui-selected": {
                bgcolor: "rgba(255,255,255,0.1)",
                color: "#ffffff",
              },
              "&:hover": {
                bgcolor: "#f28a2e",
                color: "#ffffff",
              },
            }}
          >
            <ConfirmationNumberOutlinedIcon sx={{ fontSize: 18, mr: 1.5, color: "inherit" }} />
            <Typography sx={{ fontSize: 14, color: "inherit" }}>Mis tickets</Typography>
          </ListItemButton>

          {/* Nuevo ticket */}
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            fullWidth
            onClick={() => handleNavigate("/tickets")}
            sx={{
              mt: 0.5,
              justifyContent: "flex-start",
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
              py: 1,
              px: 1.5,
              borderRadius: 1.5,
            }}
          >
            Nuevo ticket
          </Button>

        </List>
      </Box>

      {/* Usuario */}
      <Divider sx={{ borderColor: "navbar.border" }} />
      <Box
        sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
        onClick={logout}
      >
        <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: "primary.main" }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#ffffff" }}>
            {user?.name}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
            Empleada
          </Typography>
        </Box>
      </Box>

    </Box>
  );
}

export default function Navbar({ mobileOpen, onMobileClose }) {
  return (
    <>
      {/* Desktop */}
      <Box
        component="nav"
        sx={{
          width: { md: DRAWER_WIDTH },
          flexShrink: { md: 0 },
          display: { xs: "none", md: "block" },
        }}
      >
        <Box
          sx={{
            width: DRAWER_WIDTH,
            height: "100vh",
            position: "fixed",
            bgcolor: "navbar.bg",
            borderRight: "1px solid",
            borderColor: "navbar.border",
          }}
        >
          <NavContent />
        </Box>
      </Box>

      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            bgcolor: "navbar.bg",
            borderRight: "1px solid",
            borderColor: "navbar.border",
          },
        }}
      >
        <NavContent onNavigate={onMobileClose} />
      </Drawer>
    </>
  );
}