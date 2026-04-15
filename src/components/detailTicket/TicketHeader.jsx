import { Box, Typography, Stack } from "@mui/material";
import { StatusChip, PriorityChip } from "../../components/common/TicketChips";

const TicketHeader = ({ ticket }) => {
  return (
    <Box sx={{ mb: 2 }}>

      <Stack direction="row" justifyContent="space-between" alignItems="center">

        <Typography variant="caption" color="text.secondary">
          TIC-{ticket.id}
        </Typography>

        <Stack direction="row" spacing={1}>
          <StatusChip status={ticket.status} />
          <PriorityChip priority={ticket.priority} />
        </Stack>

      </Stack>

      <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
        {ticket.title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Creado el {new Date(ticket.createdAt).toLocaleDateString()}
      </Typography>

    </Box>
  );
};

export default TicketHeader;