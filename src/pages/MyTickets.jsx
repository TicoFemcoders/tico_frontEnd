import { Box } from "@mui/material";
import MTHeader from "../components/myTickets/MTHeader";
import StatCards from "../components/myTickets/StatCards";
import TicketTable from "../components/myTickets/ticketTable";
// Mock data (en el futuro esto vendrá de una API o un custom hook)
const activeTickets = [
  {
    id: 42,
    title: "El portal de RRHH no carga al iniciar sesión",
    description: "El usuario intenta acceder y recibe un error 500 constante.",
    status: "IN_PROGRESS",
    priority: "CRITICAL",
    createdById: 101,
    assignedToId: 202,
    labels: ["Software", "Bug", "Prioritario"],
    emailSubject: "Error acceso portal RRHH",
    createdAt: "2026-04-10T10:00:00.000Z",
    updatedAt: "2026-04-13T15:30:00.000Z",
    closedAt: null
  },
  {
    id: 39,
    title: "Impresora planta 2 no responde en red",
    description: "Se ha reiniciado el router pero sigue sin aparecer en la lista de dispositivos.",
    status: "OPEN",
    priority: "MEDIUM",
    createdById: 105,
    assignedToId: null,
    labels: ["Hardware", "Infraestructura"],
    emailSubject: "Problema impresora",
    createdAt: "2026-04-12T09:15:00.000Z",
    updatedAt: "2026-04-12T09:15:00.000Z",
    closedAt: null
  },
  {
    id: 31,
    title: "Sin acceso a carpetas compartidas en servidor",
    description: "Permisos denegados tras la última actualización de seguridad.",
    status: "CLOSED",
    priority: "LOW",
    createdById: 110,
    assignedToId: 202,
    labels: ["Accesos", "Seguridad", "Servidores"],
    emailSubject: "Fallo permisos carpetas",
    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-04-05T12:00:00.000Z",
    closedAt: "2026-04-05T12:00:00.000Z"
  }
];
const MyTickets = () => {
  const stats = [
    { label: "Abiertos", value: 2, color: "primary.main" },
    { label: "En curso", value: 1, color: "secondary.main" },
    { label: "Cerrados", value: 12, color: "text.subtle" }
  ];
  return (
    <Box>
      <MTHeader activeCount={3} closedCount={12} role= "ADMIN" type= "" />
      
      <StatCards stats={stats} />
      
      <TicketTable 
        title="Tickets activos" 
        tickets={activeTickets} 
        showFilter={true} 
      />
      <TicketTable 
        title="Tickets cerrados" 
        tickets={[]} 
        showFilter={false} 
      />
    </Box>
  );
};
export default MyTickets;