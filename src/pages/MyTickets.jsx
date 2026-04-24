import { Box } from "@mui/material";; 
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ticketService } from "../services/ticketService";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../context/useAuth";
import PageHeader from "../components/common/PageHeader";
import TicketTable from "../components/myTickets/TicketTable";
import StatCards from "../components/myTickets/StatCards";
import { TICKET_STATUS } from "../utils/enums";
import LoadingScreen from "../components/common/LoadingScreen";


const MyTickets = ({ viewType = "default" }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user, hasRole} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;
    const dataTickets = async () => {
      setLoading(true); 
      try {
        let data = [];
        if (viewType === "assigned") {
            data = await ticketService.getAssignedTickets();
        } else if (viewType === "all") {
            data = await ticketService.getAllTickets(); 
        } else {
            data  = await ticketService.getMyTickets();
        }
        setTickets(data);
      } catch (error) {
        console.error("Error al cargar tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    dataTickets();
  }, [viewType, user?.id]);

  const activeTickets = tickets.filter(t =>
    t.status === TICKET_STATUS.OPEN || t.status === TICKET_STATUS.IN_PROGRESS
  );
  const closedTickets = tickets.filter(t => t.status === TICKET_STATUS.CLOSED);

  const stats = [
      { label: "Abiertos", value: tickets.filter(t => t.status === TICKET_STATUS.OPEN).length, color: "primary.main" },
      { label: "En curso", value: tickets.filter(t => t.status === TICKET_STATUS.IN_PROGRESS).length, color: "secondary.main" },
      { label: "Cerrados", value: closedTickets.length, color: "text.subtle" }
  ];

  if (["assigned", "all"].includes(viewType)) {
    stats.push({ 
      label: "Sin asignar", 
      value: tickets.filter(t => !t.assignedToId).length, 
      color: "success.main" 
    });
  }

  const pageTitles = {
    assigned: "Tickets Asignados",
    all: "Todos los tickets",
    default: "Mis tickets" 
  };

  const currentTitle = pageTitles[viewType] || pageTitles.default;

  const buttonText = viewType === "default" ? "Nuevo ticket" : null;

  return (
    <Box>
      {loading ? (
         <LoadingScreen />
      ) : (
        <>
          <PageHeader 
            title={currentTitle} 
            subtitle={(viewType=== "all"?"Panel de administración · gestión global de incidencias":`${activeTickets.length} tickets activos · ${closedTickets.length} cerrados`)}
            actionText={buttonText}
            onActionClick={() => navigate("/tickets")}
          />
          
          <StatCards stats={stats}  />
          
          <TicketTable 
            title="Tickets activos" 
            tickets={activeTickets} 
            showFilter={true} 
            variant={viewType}
          />
          <TicketTable 
            title="Tickets cerrados" 
            tickets={closedTickets} 
            showFilter={false} 
            variant={viewType}
          />
        </>
      )}
    </Box>
  );
};
export default MyTickets;