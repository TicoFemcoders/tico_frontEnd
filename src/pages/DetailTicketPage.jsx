import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Container,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { ticketService } from "../services/ticketService";
import { useNavigate } from "react-router-dom";
import { StatusChip, PriorityChip } from "../components/common/TicketChips";

import TicketDescription from "../components/detailTicket/TicketDescription";
import TicketHistory from "../components/detailTicket/TicketHistory";
import TicketResponseBox from "../components/detailTicket/TicketResponseBox";
import TicketSidebar from "../components/detailTicket/TicketSidebar";
import PageHeader from "../components/common/PageHeader";

const DetailTicketPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const isAdmin = user?.role === "ADMIN";

  const currentTitle = ticket
    ? `Ticket / TIC-${ticket.id}`
    : "Detalle de Ticket";

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await ticketService.getTicketById(id);
        setTicket(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  if (!ticket)
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 10 }}>
        Ticket no encontrado
      </Typography>
    );

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#EDEEF0",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Box sx={{ 
      flexGrow: 1, 
      p: { xs: 2, md: 5 },
      display: "flex", 
      flexDirection: "column",
      width: "100%",
      boxSizing: "border-box"
    }}>
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center" }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, color: "text.secondary", mr: 1 }}
          >
            {`TIC-${ticket.id}`}
          </Typography>
          <StatusChip status={ticket.status} />
          <PriorityChip priority={ticket.priority} />
          {ticket.category && (
            <Chip
              label={ticket.category}
              size="small"
              icon={<span>💻</span>}
              sx={{ bgcolor: "#DR-PLANT-THEME", fontWeight: 600 }}
            />
          )}
        </Stack>

        <PageHeader
          title={ticket.title}
          subtitle={`Creado el ${new Date(ticket.createdAt).toLocaleDateString()} · Asignado a: ${ticket.assignedTo || "Sin asignar"}`}
        />
      </Box>

      <Grid container spacing={3} sx={{ mt: 1, width: "100%" }}>
        <Grid item xs={12} md={9}>
          <Stack spacing={3}>
            <TicketDescription ticket={ticket} />
            <TicketHistory history={ticket.history} />
            <TicketResponseBox ticketId={ticket.id} />
          </Stack>
        </Grid>

        <Grid item xs={12} md={3}>
          <TicketSidebar ticket={ticket} isAdmin={isAdmin} />
        </Grid>
      </Grid>
    </Box>
    </Box>
  );
};
export default DetailTicketPage;
