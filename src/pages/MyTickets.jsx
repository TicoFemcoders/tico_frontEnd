import { Box } from "@mui/material";; 
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ticketService } from "../services/ticketService";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../context/useAuth";
import PageHeader from "../components/common/PageHeader";
import TicketTable from "../components/myTickets/TicketTable";
import StatCards from "../components/myTickets/StatCards";
import { TICKET_STATUS } from "../utils/enums";
import LoadingScreen from "../components/common/LoadingScreen";
import { useCallback } from "react";
import { useProgressiveFetch } from "../hooks/useProgressiveFetch";

const MyTickets = ({ viewType = "default" }) => {
  const {user, hasRole} = useAuth();
  const navigate = useNavigate();

  const fetchFn = useCallback((page, size) => {
      if (viewType === "assigned") return ticketService.getAssignedTickets(page, size);
      if (viewType === "all") return ticketService.getAllTickets(page, size);
      return ticketService.getMyTickets(page, size);
  }, [viewType]); 
  const { data: tickets, loading, isSyncing } = useProgressiveFetch(fetchFn);

  const activeTickets = tickets.filter(t =>
    t.status === TICKET_STATUS.OPEN || t.status === TICKET_STATUS.IN_PROGRESS
  );
  const closedTickets = tickets.filter(t => t.status === TICKET_STATUS.CLOSED);

  const stats = [
      { label: "Abiertos", value: tickets.filter(t => t.status === TICKET_STATUS.OPEN).length, color: "primary.main" },
      { label: "En curso", value: tickets.filter(t => t.status === TICKET_STATUS.IN_PROGRESS).length, color: "secondary.main" },
      { label: "Cerrados", value: closedTickets.length, color: "text.subtle" }
  ];

  if ([ "all"].includes(viewType)) {
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
            subtitle={
              isSyncing 
                ? "Sincronizando base de datos en segundo plano..." 
                : (viewType === "all" ? "Panel de administración · gestión global de incidencias" : `${activeTickets.length} tickets activos · ${closedTickets.length} cerrados`)
            }
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