import { Paper, Typography, Box, Stack, Divider } from "@mui/material";

const TicketHistory = ({ history = [] }) => {
  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>

      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Historial
      </Typography>

      <Stack spacing={2}>
        {history.map((item, i) => (
          <Box key={i}>

            <Typography variant="body2" fontWeight={600}>
              {item.author}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {item.date}
            </Typography>

            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {item.message}
            </Typography>

            {i !== history.length - 1 && (
              <Divider sx={{ mt: 1.5 }} />
            )}

          </Box>
        ))}
      </Stack>

    </Paper>
  );
};

export default TicketHistory;