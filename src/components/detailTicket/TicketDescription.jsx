import { Paper, Typography } from "@mui/material";

const TicketDescription = ({ description }) => {
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "border.soft",
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Descripción inicial
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Paper>
  );
};

export default TicketDescription;