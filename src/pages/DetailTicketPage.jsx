
import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { ticketService } from "../services/ticketService";

import TicketHeader from "../components/detailTicket/TicketHeader";
import TicketDescription from "../components/detailTicket/TicketDescription";
import TicketHistory from "../components/detailTicket/TicketHistory";
import TicketResponseBox from "../components/detailTicket/TicketResponseBox";
import TicketSidebar from "../components/detailTicket/TicketSidebar";

const DetailTicketPage = () => {
  const { id } = useParams();
  console.log("ID:", id);
  const { user } = useContext(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "ADMIN";

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

  if (loading) return <CircularProgress />;
  if (!ticket) return <div>No encontrado</div>;

  return (
    <Grid container spacing={3}>
      
      <Grid item xs={12} md={8}>
        <TicketHeader ticket={ticket} />

        <TicketDescription description={ticket.description} />

        <TicketHistory history={ticket.history} />

        <TicketResponseBox />
      </Grid>

      <Grid item xs={12} md={4}>
        <TicketSidebar ticket={ticket} isAdmin={isAdmin} />
      </Grid>

    </Grid>
  );
};

export default DetailTicketPage;