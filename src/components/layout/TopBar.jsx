import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Badge, Menu, MenuItem, Breadcrumbs, Link as MuiLink, CircularProgress } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom"; 

const TopBar = ({ breadcrumbs = [] }) => {
  // Estado para controlar que se abra y cierre el menú de la campana
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleReadAndGo = async (notificacion) => {
    handleClose();
    setUnreadCount(prev => prev > 0 ? prev - 1 : 0); 
    // Aquí iría el fetch a SpringBoot para tacharla por ID en la BD
    // Rebotamos al usuario al ticket asociado (usando de ejemplo el ID de la notificación)
    navigate(`/tickets/${notificacion.id}`);
  };

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(0); 
  const [loading, setLoading] = useState(false); 
  const [hasMore, setHasMore] = useState(true);
  const fetchNotificationsPagination = async (currentPage) => {
    if (loading || !hasMore) return; 
    setLoading(true);
    try {
      // -- Así se vería tu llamada real --
      // const response = await fetch(`/api/notifications?page=${currentPage}&size=10`);
      // const data = await response.json();
      // setUnreadCount(data.totalUnread);
      // setNotifications((prev) => [...prev, ...data.content]); // Se añaden sin borrar las previas
      // setHasMore(data.content.length === 10); // Si te devuelve menos de 10, es que se acabaron
      // -- DATOS DE PRUEBA SIMULADOS --
      setUnreadCount(142);
      await new Promise(r => setTimeout(r, 800));
      const newBatch = [
         { id: currentPage * 10 + 1, title: `Límite Base de datos pt.${currentPage}`, time: "Hace un momento" },
         { id: currentPage * 10 + 2, title: `El ticket TIC-0043 fue asig...`, time: "Hace un rato" },
         { id: currentPage * 10 + 3, title: `Nuevo mensaje de soporte`, time: "Hace un rato" },
         { id: currentPage * 10 + 1, title: `Límite Base de datos pt.${currentPage}`, time: "Hace un momento" },
         { id: currentPage * 10 + 2, title: `El ticket TIC-0043 fue asig...`, time: "Hace un rato" },
         { id: currentPage * 10 + 3, title: `Nuevo mensaje de soporte`, time: "Hace un rato" },
         { id: currentPage * 10 + 1, title: `Límite Base de datos pt.${currentPage}`, time: "Hace un momento" },
         { id: currentPage * 10 + 2, title: `El ticket TIC-0043 fue asig...`, time: "Hace un rato" },
         { id: currentPage * 10 + 3, title: `Nuevo mensaje de soporte`, time: "Hace un rato" },
         { id: currentPage * 10 + 1, title: `Límite Base de datos pt.${currentPage}`, time: "Hace un momento" },
         { id: currentPage * 10 + 2, title: `El ticket TIC-0043 fue asig...`, time: "Hace un rato" },
         { id: currentPage * 10 + 3, title: `Nuevo mensaje de soporte`, time: "Hace un rato" },
         { id: currentPage * 10 + 1, title: `Límite Base de datos pt.${currentPage}`, time: "Hace un momento" },
         { id: currentPage * 10 + 2, title: `El ticket TIC-0043 fue asig...`, time: "Hace un rato" },
         { id: currentPage * 10 + 3, title: `Nuevo mensaje de soporte`, time: "Hace un rato" },
         { id: currentPage * 10 + 1, title: `Límite Base de datos pt.${currentPage}`, time: "Hace un momento" },
         { id: currentPage * 10 + 2, title: `El ticket TIC-0043 fue asig...`, time: "Hace un rato" },
         { id: currentPage * 10 + 3, title: `Nuevo mensaje de soporte`, time: "Hace un rato" }
      ];
      // Juntamos las que ya existían con las nuevas
      setNotifications((prev) => [...prev, ...newBatch]);
      
      // Simulamos que al llegar a la validación 3 se acaban (para que veas que el scroll para)
      setHasMore(currentPage < 3);
    } catch (error) {
      console.error("Error al simular scroll", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotificationsPagination(page);
  }, [page]);
  // 4. El detector de Scroll matemático
  const handleScroll = (event) => {
    const listboxNode = event.currentTarget;
    // Comprobamos si (posición scroll + parte visible) es casi igual a (altura total del contenido)
    if (listboxNode.scrollTop + listboxNode.clientHeight >= listboxNode.scrollHeight - 10) {
      if (!loading && hasMore) {
        setPage((prevPage) => prevPage + 1); // Pedimos la página siguiente
      }
    }
  };


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
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon sx={{ color: "text.mid", fontSize: 24 }} />
          </Badge>
        </IconButton>
        <Menu
          id="notifications-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 3, onScroll: handleScroll,
            sx: { mt: 1.5, minWidth: 280, maxWidth: 320, maxHeight: 400, overflowY: "auto", borderRadius: 2 }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'border.soft', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Notificaciones</Typography>
             {unreadCount > 0 && (
               <Typography 
                 variant="caption" 
                 onClick={() => {
                   setUnreadCount(0); // Borra todo de golpe visualmente
                   // Aquí iría el fetch a SpringBoot "mark-all-read"
                 }} 
                 sx={{ px:2, color: 'primary.main', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
               >
                 Marcar todo como leído
               </Typography>
             )}
          </Box>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <MenuItem key={notif.id}  onClick={() => handleReadAndGo(notif)} sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'border.soft'}}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {notif.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.subtle' }}>
                    {notif.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          ) : (
             <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.subtle' }}>
                   No hay notificaciones sin leer
                </Typography>
             </Box>
          )}
          {loading && (
             <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} sx={{ color: "text.subtle" }} />
             </Box>
          )}
          
        </Menu>
      </Box>
    </Box>
  );
};
export default TopBar;