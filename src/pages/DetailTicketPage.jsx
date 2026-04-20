// import {
//   Box,
//   CircularProgress,
//   Grid,
//   Stack,
//   Container,
//   Typography,
//   Chip,
// } from "@mui/material";
// import { useParams } from "react-router-dom";
// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../context/authContext";
// import { ticketService } from "../services/ticketService";
// import { useNavigate } from "react-router-dom";
// import { StatusChip, PriorityChip } from "../components/common/TicketChips";
// import { ticketMessageService } from "../services/ticketMessageService";
// import TicketDescription from "../components/detailTicket/TicketDescription";
// import TicketHistory from "../components/detailTicket/TicketHistory";
// import TicketResponseBox from "../components/detailTicket/TicketResponseBox";
// import TicketSidebar from "../components/detailTicket/TicketSidebar";
// import PageHeader from "../components/common/PageHeader";

// const DetailTicketPage = () => {
//   const { id } = useParams();
//   const { user } = useContext(AuthContext);
//   const [ticket, setTicket] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();
//   const isAdmin = user?.roles?.includes("ROLE_ADMIN");

//   const currentTitle = ticket
//     ? `Ticket / TIC-${ticket.id}`
//     : "Detalle de Ticket";

//   useEffect(() => {
//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
      
//       // 1. Cargamos el ticket (usando await como ya tenías)
//       const ticketData = await ticketService.getTicketById(id);
//       setTicket(ticketData);

//       // 2. Cargamos los mensajes (usando tu nuevo servicio con .then)
//       // Como tu servicio ya tiene el .then(res => res.data), aquí recibes la lista directa
//       const messagesData = await ticketMessageService.getMessagesByTicketId(id);
//       setMessages(messagesData);

//     } catch (err) {
//       console.error("Error cargando el detalle del ticket:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (id) {
//     fetchAllData();
//   }
// }, [id]);

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         bgcolor: "#EDEEF0",
//         minHeight: "100vh",
//         width: "100%",
//       }}
//     >
//       <Box
//         sx={{
//           flexGrow: 1,
//           p: { xs: 2, md: 5 },
//           display: "flex",
//           flexDirection: "column",
//           width: "100%",
//           boxSizing: "border-box",
//         }}
//       >
//         <Box sx={{ mb: 3 }}>
//           <Stack
//             direction="row"
//             spacing={1}
//             sx={{ mb: 1, alignItems: "center" }}
//           >
//             <Typography
//               variant="caption"
//               sx={{ fontWeight: 700, color: "text.secondary", mr: 1 }}
//             >
//               {`TIC-${ticket.id}`}
//             </Typography>
//             <StatusChip status={ticket.status} />
//             <PriorityChip priority={ticket.priority} />
//             {ticket.category && (
//               <Chip
//                 label={ticket.category}
//                 size="small"
//                 sx={{ fontWeight: 600, fontSize: "11px" }}
//               />
//             )}

// {/* //CAMBIAR POR COMPONENTE DE ETIQUETA */}
//             {ticket.labels && Array.from(ticket.labels).map((labelName) => (
//             <Chip
//               key={labelName}
//               label={labelName}
//               size="small"
//               sx={{ 
//                 fontWeight: 600, 
//                 fontSize: "11px",
//                 bgcolor: "#3498DB", 
//                 color: "#fff",
//                 '& .MuiChip-label': { px: 1 },
//                 height: 24
//               }}
//             />
//           ))}
//           </Stack>
          
//           <PageHeader
//             title={ticket.title}
//             subtitle={`Creado el ${new Date(ticket.createdAt).toLocaleDateString()} · Asignado a: ${ticket.assignedTo || "Sin asignar"}`}
//           />
//         </Box>

//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: { xs: "column", md: "row" },
//             gap: 4,
//             width: "100%",
//           }}
//         >

//           <Box sx={{ flex: { md: "0 0 75%" }, minWidth: 0 }}>
//             <Stack spacing={2}>
//               <TicketDescription 
//               description={ticket.description} 
//               createdAt={ticket.createdAt}
//               />
//               <TicketHistory history={ticket.history} />

//               <TicketResponseBox ticketId={ticket.id} />
//             </Stack>
//           </Box>

//           <Box sx={{ flex: { md: "0 0 25%" }, minWidth: 0 }}>
//             <TicketSidebar ticket={ticket} isAdmin={isAdmin} />
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };
// export default DetailTicketPage;

import { Box, CircularProgress, Stack, Typography, Chip } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { ticketService } from "../services/ticketService";
import { ticketMessageService } from "../services/ticketMessageService";

import TicketDescription from "../components/detailTicket/TicketDescription";
import TicketHistory from "../components/detailTicket/TicketHistory";
import TicketResponseBox from "../components/detailTicket/TicketResponseBox";
import TicketSidebar from "../components/detailTicket/TicketSidebar";
import PageHeader from "../components/common/PageHeader";
import { StatusChip, PriorityChip } from "../components/common/TicketChips";


const DetailTicketPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleMessageSent = () => {
      setRefreshTrigger(prev => prev + 1);
    };

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const data = await ticketService.getTicketById(id);
        setTicket(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "#EDEEF0" }}>
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
    <Box sx={{ display: "flex", bgcolor: "#EDEEF0", minHeight: "100vh", width: "100%" }}>
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 }, display: "flex", flexDirection: "column", width: "100%" }}>
        
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", mr: 1 }}>
              {`TIC-${ticket.id}`}
            </Typography>
            <StatusChip status={ticket.status} />
            <PriorityChip priority={ticket.priority} />
            {ticket.labels && Array.from(ticket.labels).map((labelName) => (
              <Chip key={labelName} label={labelName} size="small" sx={{ fontWeight: 600, fontSize: "11px", bgcolor: "#3498DB", color: "#fff", height: 24 }} />
            ))}
          </Stack>
          <PageHeader
            title={ticket.title}
            subtitle={`Creado el ${new Date(ticket.createdAt).toLocaleDateString()} · Asignado a: ${ticket.assignedTo || "Sin asignar"}`}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, width: "100%" }}>
          <Box sx={{ flex: { md: "0 0 75%" }, minWidth: 0 }}>
            <Stack spacing={2}>
              <TicketDescription description={ticket.description} createdAt={ticket.createdAt} />
              
              <TicketHistory ticketId={id} refreshTrigger={refreshTrigger} />
              
              <TicketResponseBox ticketId={id} onMessageSent={handleMessageSent} />
            </Stack>
          </Box>
          <Box sx={{ flex: { md: "0 0 25%" }, minWidth: 0 }}>
            <TicketSidebar ticket={ticket} isAdmin={isAdmin} />
          </Box>
        </Box>
      </Box>
    </Box>
  );

};

export default DetailTicketPage;
