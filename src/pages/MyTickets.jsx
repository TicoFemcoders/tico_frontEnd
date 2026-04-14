import { Box } from "@mui/material";
import MTHeader from "../components/myTickets/MTHeader";
import StatCards from "../components/myTickets/StatCards";
import TicketTable from "../components/myTickets/ticketTable";
import { useState, useEffect, useContext } from "react";
import { ticketService } from "../services/ticketService";
import { CircularProgress } from "@mui/material";
import { AuthContext } from "../context/authContext";


const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useContext(AuthContext);

  useEffect(() => {
    const dataTickets = async () => {
      try {
        const data = await ticketService.getMyTickets(user.id);
        setTickets(data);
      } catch (error) {
        console.error("Error al cargar tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    dataTickets();
  }, []);

  const activeTickets = tickets.filter(t => t.status === "OPEN" || t.status === "IN_PROGRESS");
  const closedTickets = tickets.filter(t => t.status === "CLOSED");

  const stats = [
    { label: "Abiertos", value: tickets.filter(t => t.status === "OPEN").length, color: "primary.main" },
    { label: "En curso", value: tickets.filter(t => t.status === "IN_PROGRESS").length, color: "secondary.main" },
    { label: "Cerrados", value: closedTickets.length, color: "text.subtle" }
  ];

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <MTHeader activeCount={activeTickets.length} closedCount={closedTickets.length} role= "ADMIN" type= "" />
          
          <StatCards stats={stats} />
          
          <TicketTable 
            title="Tickets activos" 
            tickets={activeTickets} 
            showFilter={true} 
          />
          <TicketTable 
            title="Tickets cerrados" 
            tickets={closedTickets} 
            showFilter={false} 
          />
        </>
      )}
    </Box>
  );
};
export default MyTickets;