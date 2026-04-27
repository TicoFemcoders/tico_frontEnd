import { Paper, Typography, Box, Divider } from "@mui/material";
import { formatDateTime } from "../../utils/formatDate";

const TicketDescription = ({ description, createdAt }) => {

  return (
    <Paper
      sx={{
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 2,
        boxShadow: "var(--shadow)",
        border: "1px solid",
        borderColor: "var(--border)",
        backgroundColor: "var(--bg)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: "text.primary" }}
        >
          Descripción del empleado
        </Typography>

        <Typography
          variant="caption"
          sx={{ fontWeight: 400, color: "text.secondary"}}
        >
          {formatDateTime(createdAt)}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "var(--border)" }}/>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-line", color: "text.mid" }}
        >
          {description}
        </Typography>
      </Box>
    </Paper>
  );
};

export default TicketDescription;
