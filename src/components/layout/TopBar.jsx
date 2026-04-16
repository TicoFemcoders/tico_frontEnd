import { useState } from "react";
import { Box, Typography, IconButton, Badge, Menu, MenuItem, Breadcrumbs, Link as MuiLink } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { Link } from "react-router-dom"; 

const TopBar = ({ breadcrumbs = [] }) => {
  // Estado para controlar que se abra y cierre el menú de la campana
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  return (
    <Box 
      component="nav" 
      aria-label="Barra superior y notificaciones"
      sx={{ 
        display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", py: 1.5, 
        px: 4, bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "border.soft"}}
    >
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return isLast ? (
            <Typography key={index} sx={{ color: "text.primary", fontWeight: 700, fontSize: "14px" }}>
              {crumb.label}
            </Typography>
          ) : (
             <MuiLink 
               component={Link} 
               to={crumb.href || "#"} 
               key={index} 
               sx={{ color: "text.subtle", textDecoration: "none", fontSize: "14px", '&:hover': { textDecoration: 'underline' } }}
             >
               {crumb.label}
             </MuiLink>
          );
        })}
      </Breadcrumbs>
      <Box>
        <IconButton 
          onClick={handleClick} 
          aria-controls={open ? 'notifications-menu' : undefined} 
          aria-haspopup="true" 
          aria-expanded={open ? 'true' : undefined}
        >
          <Badge badgeContent={3} color="error">
            <NotificationsIcon sx={{ color: "text.mid", fontSize: 24 }} />
          </Badge>
        </IconButton>
        <Menu
          id="notifications-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 3,
            sx: { mt: 1.5, minWidth: 280, borderRadius: 2 }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'border.soft' }}>
             <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Notificaciones</Typography>
          </Box>
          
          {/* Elemento de notificación ficticio, esto tiene que ser un .map */}
          <MenuItem onClick={handleClose} sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'border.soft' }}>
             <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>El ticket TIC-0043 fue asig...</Typography>
                <Typography variant="caption" color="text.subtle">Hace 5 min</Typography>
             </Box>
          </MenuItem>
          
          <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
             <Box>
                <Typography variant="body2">Nuevo mensaje de soporte</Typography>
                <Typography variant="caption" color="text.subtle">Hace 1 hora</Typography>
             </Box>
          </MenuItem>
          {/* Enlace estático para ir a la vista completa */}
          <Box sx={{ p: 1.5, textAlign: 'center', bgcolor: 'background.default' }}>
            <MuiLink component={Link} to="/notifications" sx={{ fontSize: '12px', fontWeight: 600, color: 'primary.main' }}>
              Ver todas las notificaciones
            </MuiLink>
          </Box>
        </Menu>
      </Box>
    </Box>
  );
};
export default TopBar;