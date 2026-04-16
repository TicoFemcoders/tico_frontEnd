// import { Box, Typography, Stack } from "@mui/material";
// import { StatusChip, PriorityChip } from "../../components/common/TicketChips";

// const TicketHeader = ({ ticket }) => {
//   return (
//     <Box sx={{ mb: 2 }}>

//       <Stack direction="row" justifyContent="space-between" alignItems="center">

//         <Typography variant="caption" color="text.secondary">
//           TIC-{ticket.id}
//         </Typography>

//         <Stack direction="row" spacing={1}>
//           <StatusChip status={ticket.status} />
//           <PriorityChip priority={ticket.priority} />
//         </Stack>

//       </Stack>

//       <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
//         {ticket.title}
//       </Typography>

//       <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//         Creado el {new Date(ticket.createdAt).toLocaleDateString()}
//       </Typography>

//     </Box>
//   );
// };

import { Box, Typography, Stack } from "@mui/material";
import { StatusChip, PriorityChip } from "../common/TicketChips";

const TicketHeader = ({ ticket }) => (
  <Box sx={{ mb: 3 }}>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
      <Typography variant="caption" fontWeight={700} color="text.subtle">
        TIC-{ticket.id}
      </Typography>
      <StatusChip status={ticket.status} />
      <PriorityChip priority={ticket.priority} />
    </Stack>
    
    <Typography variant="h1" sx={{ color: "text.primary", mb: 1 }}>
      {ticket.title}
    </Typography>
    
    <Typography variant="body2" color="text.secondary">
      Creado el {new Date(ticket.createdAt).toLocaleDateString()} • Asignado a: <strong>{ticket.assignedTo || 'Sin asignar'}</strong>
    </Typography>
  </Box>
);

export default TicketHeader;