import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Badge, Menu, MenuItem, Breadcrumbs, CircularProgress, Alert } from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; 
import { notificationService } from "../../services/notificationService";
import { formatTime } from "../../utils/formatTime";
import BreadcrumbItem from "../common/BreadcrumbItem";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import InfiniteScrollFooter from "../common/InfiniteScrollFooter";

const TopBar = ({ breadcrumbs = [] }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false); 
  const [hasMore, setHasMore] = useState(true);
  const { page, setPage, handleScroll, scrollRef, canScroll, isAtBottom } = useInfiniteScroll(loading, hasMore, notifications);

  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleReadAndGo = async (notificacion) => {
    handleClose();
    try {
        await notificationService.markAsRead(notificacion.id);
        setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
        setNotifications(prev => prev.map(n =>
            n.id === notificacion.id ? { ...n, read: true } : n
        ));
    } catch {
        setError("No se pudo marcar la notificación como leída.");
    }
    navigate(`/detail-ticket/${notificacion.ticketId}`);
};

  const fetchNotificationsPagination = async (currentPage, signal) => {
    if (loading || !hasMore) return; 
    setLoading(true);
    try {
      const data = await notificationService.getPaginatedNotifications(currentPage, 10, signal);
      setUnreadCount(data?.totalUnread ?? 0);
      const items = data?.content ?? [];
      setNotifications((prev) => {
        const existingIds = new Set(prev.map(n => n.id));
        const unique = items.filter(n => !existingIds.has(n.id));
        return [...prev, ...unique];
      });
      setHasMore(items.length === 10);
    } catch (error) {
      if (error.name === 'CanceledError') return;
      setError("Error al cargar notificaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setError(""); 
    const prevCount = unreadCount; 
    const prevNotifications = notifications;
    setUnreadCount(0); 
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    try {
      await notificationService.markAllAsRead();
    } catch(error) {
      setUnreadCount(prevCount);
      setNotifications(prevNotifications);
      setError("Error del servidor. No se han podido marcar.");
      }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchNotificationsPagination(page, controller.signal);
    return () => {
    controller.abort();
  };
  }, [page]);

  return (
    <Box 
      component="nav" 
      aria-label="Barra superior y notificaciones"
      sx={{ 
        display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", py: 1.5, 
        px: 4, bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "border.soft"}}
    >
      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <BreadcrumbItem key={index} crumb={crumb} isLast={index === breadcrumbs.length - 1} />
        ))}
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
          slotProps={{
            paper: {
            ref: scrollRef,  
            elevation: 3, onScroll: handleScroll,
            sx: { mt: 1.5, minWidth: 300, maxWidth: 450, maxHeight: 400, overflowY: "auto", borderRadius: 2 }
          }}}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 2, borderBottom: '1px solid', borderColor: 'border.soft', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '14px', color: 'text.primary' }}>Notificaciones</Typography>
             {unreadCount > 0 && (
               <Typography 
                 variant="caption" 
                 onClick= {handleMarkAllAsRead}
                 sx={{ px:2, color: 'primary.main', cursor: 'pointer', fontWeight: 600, fontSize: '11px', '&:hover': { textDecoration: 'underline' } }}
               >
                 Marcar todo como leído
               </Typography>
             )}
          </Box>
          {error && (
            <Box sx={{ px: 2, pt: 2 }}>
               <Alert severity="error" sx={{ fontSize: 13 }}>
                 {error}
               </Alert>
            </Box>
          )}
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <MenuItem key={notif.id}  onClick={() => handleReadAndGo(notif)} sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'border.soft'}}>
                <Box sx={{ width: '100%', overflow: 'hidden' }}>
                  <Typography variant="body2" sx={{ fontWeight: notif.read ? 400 : 700, color: notif.read ? 'text.secondary' : 'text.primary' ,
                    whiteSpace: 'normal',  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    {notif.content}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.subtle', display: 'block', mt: 0.5 }}>
                    {formatTime(notif.createdAt)}
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
          <InfiniteScrollFooter 
              loading={loading} 
              hasMore={hasMore} 
              isEmpty={notifications.length === 0} 
              scrollText="↓ Cargar más notificaciones" 
              endText="— Estás al día —" 
          />
          {canScroll && !isAtBottom && (
             <Box sx={{ 
                 position: 'sticky', 
                 bottom: 0, 
                 bgcolor: 'background.paper', 
                 py: 1.5, 
                 textAlign: 'center', 
                 borderTop: '1px solid var(--border)', 
                 boxShadow: '0 -10px 10px -10px rgba(0,0,0,0.1)' // Sombrilla sutil hacia arriba
             }}>
                 <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                     ↓ Desliza para ver más
                 </Typography>
             </Box>
          )}
          
        </Menu>
      </Box>
    </Box>
  );
};
export default TopBar;