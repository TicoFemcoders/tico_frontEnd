import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import { ticketService } from "../services/ticketService";
import TicketDescription from "../components/detailTicket/TicketDescription";
import TicketHistory from "../components/detailTicket/TicketHistory";
import TicketResponseBox from "../components/detailTicket/TicketResponseBox";
import TicketSidebar from "../components/detailTicket/TicketSidebar";
import PageHeader from "../components/common/PageHeader";
import EnumChip from "../components/common/EnumChip";
import LabelChip from "../components/common/LabelChip";
import { STATUS_CONFIG, USER_ROLES, PRIORITY_CONFIG } from "../utils/enums";

const DetailTicketPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const isAdmin = user?.roles?.includes(USER_ROLES.ADMIN);

  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketById(id);
      setTicket(data);
    } catch (err) {
      console.error("Error al cargar el ticket:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchTicket();
  }, [id, fetchTicket]);

  const handleMessageSent = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading && !ticket) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh", 
        bgcolor: "background.default"
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ticket) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h6">Ticket no encontrado</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: "flex", 
      bgcolor: "background.default", 
      minHeight: "100vh", 
      width: "100%" 
    }}>
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, display: "flex", flexDirection: "column", width: "100%" }}>
        
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mr: 1 }}>
              {`TIC-${ticket.id}`}
            </Typography>
            <EnumChip value={ticket.status} config={STATUS_CONFIG} type="status" />
            <EnumChip value={ticket.priority} config={PRIORITY_CONFIG} type="priority" />
            
            {ticket.labels?.map((l, index) => (
              <LabelChip 
                key={l.id || index} 
                label={l} 
              />
            ))}
          </Stack>

          <PageHeader
            title={ticket.title}
            subtitle={`Creado el ${new Date(ticket.createdAt).toLocaleDateString()} · Asignado a: ${
              ticket.assignedToName?.name || ticket.assignedToName || "Sin asignar"
            }`}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, width: "100%" }}>
          
          <Box sx={{ flex: { md: "0 0 75%" }, minWidth: 0 }}>
            <Stack spacing={2}>
              <TicketDescription description={ticket.description} createdAt={ticket.createdAt} />
              <TicketHistory ticketId={id} refreshTrigger={refreshTrigger} />
              <TicketResponseBox 
                ticket={ticket} 
                onMessageSent={handleMessageSent}
              />
            </Stack>
          </Box>

          <Box sx={{ flex: { md: "0 0 25%" }, minWidth: 0 }}>
            <TicketSidebar 
              ticket={ticket} 
              isAdmin={isAdmin} 
              currentUser={user}
              onRefresh={fetchTicket} 
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DetailTicketPage;
