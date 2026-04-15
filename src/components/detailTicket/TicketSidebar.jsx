import { Paper, Typography, Box, Button, Stack } from "@mui/material";
import { StatusChip, PriorityChip } from "../common/TicketChips";

const TicketSidebar = ({ ticket, isAdmin }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

      {isAdmin && (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Acciones
          </Typography>

          <Stack spacing={1}>
            <Button variant="contained" fullWidth>
              Asignar agente
            </Button>

            <Button variant="outlined" color="error" fullWidth>
              Cerrar ticket
            </Button>
          </Stack>
        </Paper>
      )}

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Estado
        </Typography>

        <StatusChip status={ticket.status} />
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Prioridad
        </Typography>

        <PriorityChip priority={ticket.priority} />
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Etiquetas
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {ticket.labels?.map((l, i) => (
            <Box key={i} sx={{ mb: 1 }}>
              {l}
            </Box>
          ))}
        </Stack>
      </Paper>

    </Box>
  );
};

export default TicketSidebar;
