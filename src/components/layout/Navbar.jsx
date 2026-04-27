import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/useAuth";
import TicoLogo from "../common/TicoLogo";
import IconButton from "@mui/material/IconButton";
import { getInitials } from "../../utils/getInitials";

const DRAWER_WIDTH = 240;

const NAV_ITEM = {
  borderRadius: 1.5,
  mb: 0.5,
  color: "navbar.text",
  gap: 1.5,
  px: 1.5,
  py: 1,
  "&.Mui-selected": {
    bgcolor: "primary.main",
    color: "primary.contrastText",
    "&:hover": { bgcolor: "primary.dark" },
  },
  "&:hover": {
    bgcolor: "navbar.active",
    color: "navbar.text",
  },
};

function SectionLabel({ children }) {
  return <Typography sx={{ fontSize: 10, fontWeight: 700, color: "navbar.text", letterSpacing: 1, px: 1.5, mt: 2, mb: 0.5 }}>{children}</Typography>;
}

function NavItem({ icon, label, badge, onClick, selected }) {
  return (
    <ListItemButton selected={selected} onClick={onClick} sx={NAV_ITEM}>
      <Typography sx={{ fontSize: 16, lineHeight: 1 }}>{icon}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: selected ? 600 : 400, color: "inherit", flex: 1 }}>{label}</Typography>
      {badge > 0 && <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontSize: 10, fontWeight: 700, borderRadius: "10px", px: 0.8, py: 0.2, minWidth: 18, textAlign: "center" }}>{badge}</Box>}
    </ListItemButton>
  );
}

function NavContent({ onNavigate }) {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = hasRole("ADMIN");

  const handleNavigate = (path) => {
    navigate(path);
    onNavigate?.();
  };

  const isSelected = (path) => location.pathname === path;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: 2.5, py: 2.5 }}>
        <TicoLogo variant="light" size={28} />
        <Typography sx={{ fontSize: 11, color: "navbar.text", mt: 0.5 }}>Tickets Cohispania</Typography>
      </Box>

      <Divider sx={{ borderColor: "navbar.border" }} />

      <Box sx={{ px: 1, pt: 1.5, flex: 1, overflowY: "auto" }}>
        <List disablePadding>
          {isAdmin ? (
            <>
              <SectionLabel>TICKETS</SectionLabel>
              <NavItem icon="🎫" label="Todos los tickets" path="/all-tickets" selected={isSelected("/all-tickets")} onClick={() => handleNavigate("/all-tickets")} />
              <NavItem icon="📌" label="Mis tickets asignados" path="/assigned" selected={isSelected("/assigned")} onClick={() => handleNavigate("/assigned")} />
              <NavItem icon="🎫" label="Mis tickets creados" path="/my-tickets" selected={isSelected("/my-tickets")} onClick={() => handleNavigate("/my-tickets")} />

              <SectionLabel>GESTIÓN</SectionLabel>
              <NavItem icon="👥" label="Usuarios" path="/users" selected={isSelected("/users")} onClick={() => handleNavigate("/users")} />
              <NavItem icon="🏷️" label="Etiquetas" path="/labels" selected={isSelected("/labels")} onClick={() => handleNavigate("/labels")} />
            </>
          ) : (
            <>
              <NavItem icon="🎫" label="Mis tickets" path="/my-tickets" selected={isSelected("/my-tickets")} onClick={() => handleNavigate("/my-tickets")} />

              <Button
                startIcon={<AddIcon />}
                variant="text"
                fullWidth
                onClick={() => handleNavigate("/tickets")}
                sx={{
                  mt: 0.5,
                  justifyContent: "flex-start",
                  textTransform: "none",
                  fontWeight: 400,
                  fontSize: 13,
                  py: 1,
                  px: 1.5,
                  borderRadius: 1.5,
                  color: "navbar.text",
                  "&:hover": { bgcolor: "navbar.active", color: "primary.contrastText" },
                }}
              >
                Nuevo ticket
              </Button>
            </>
          )}
        </List>
      </Box>

      <Divider sx={{ borderColor: "navbar.border" }} />
      <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ width: 32, height: 32, fontSize: 13, fontWeight: 700, bgcolor: "primary.main" }}>
          {getInitials(user?.name)}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "primary.contrastText", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</Typography>
          <Typography sx={{ fontSize: 11, color: "navbar.text" }}>{isAdmin ? "Administrador" : "Empleada"}</Typography>
        </Box>
        <IconButton 
          onClick={logout} 
          size="small" 
          aria-label="Cerrar sesión"
          sx={{ 
            color: "navbar.text", 
            p: 0.5,
            "&:hover": { 
              color: "primary.contrastText"
            } 
          }}
        >
  <LogoutIcon sx={{ fontSize: 18 }} />
</IconButton>
      </Box>
    </Box>
  );
}

export default function Navbar({ mobileOpen, onMobileClose }) {
  return (
    <>
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 }, display: { xs: "none", md: "block" } }}>
        <Box sx={{ width: DRAWER_WIDTH, height: "100vh", position: "fixed", bgcolor: "navbar.bg", borderRight: "1px solid", borderColor: "navbar.border" }}>
          <NavContent />
        </Box>
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, bgcolor: "navbar.bg", borderRight: "1px solid", borderColor: "navbar.border" },
        }}
      >
        <NavContent onNavigate={onMobileClose} />
      </Drawer>
    </>
  );
}
