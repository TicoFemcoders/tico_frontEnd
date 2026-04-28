import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import CreateTicketForm from "../components/tickets/CreateTicketForm";

export default function TicketPage() {

  return (
    <Box
      sx={{
        maxWidth: 860,
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontSize: { xs: "22px", md: "28px" }, fontWeight: 700, mb: "6px", color: "text.primary" }}
      >
        Crear nuevo ticket
      </Typography>
      <Typography sx={{ fontSize: "13px", color: "text.secondary", mb: 4 }}>
        Describe tu incidencia con el máximo detalle posible
      </Typography>

      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "14px",
          p: { xs: "20px", md: "32px" },
          border: "border.soft",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <CreateTicketForm />
      </Box>
    </Box>
  );
}