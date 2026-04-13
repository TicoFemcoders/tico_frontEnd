import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function LoginBrand() {
  return (
    <Box component="aside" sx={{ flex: 1, display: { xs: "none", md: "block" } }}>
      <Typography
        component="p"
        sx={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "navbar.text",
          mb: 2,
        }}
      >
        CoHispania
      </Typography>

      <Typography component="h2" sx={{ fontSize: 44, fontWeight: 900, lineHeight: 1.15, mb: 2, color: "secondary.contrastText" }}>
        Sistema de
        <br />
        gestión de tickets
      </Typography>

      <Typography component="p" sx={{ fontSize: 14, color: "navbar.text", lineHeight: 1.6, maxWidth: 340 }}>
        Reporta problemas técnicos y haz seguimiento en tiempo real. Tu equipo de soporte siempre informado.
      </Typography>

      <Box component="ul" sx={{ mt: 4, display: "flex", gap: 3, listStyle: "none", p: 0, m: 0 }}>
        <Box component="li">
          <Typography component="strong" sx={{ fontSize: 22, fontWeight: 800, color: "primary.main" }}>
            +200
          </Typography>
          <Typography component="span" sx={{ fontSize: 12, color: "navbar.text" }}>
            Tickets gestionados
          </Typography>
        </Box>
        <Box component="li">
          <Typography component="strong" sx={{ fontSize: 22, fontWeight: 800, color: "primary.main" }}>
            98%
          </Typography>
          <Typography component="span" sx={{ fontSize: 12, color: "navbar.text" }}>
            Tasa de resolución
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
