import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const MTHeader = ({ activeCount, closedCount, role, type }) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }} component="header">
      <Box>
        <Typography variant="h1" gutterBottom sx={{ color: "text.primary", fontWeight: 700 }}>Mis tickets</Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {activeCount} tickets activos · {closedCount} cerrados
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {role === 'ADMIN' && type === 'asignment' ? null : (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/tickets")}
            sx={{ borderRadius: 2, px: 3, py: 1 }}
          >
            Nuevo ticket
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default MTHeader;