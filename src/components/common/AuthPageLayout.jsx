import Box from "@mui/material/Box";
import TicoLogo from "./TicoLogo";

export default function AuthPageLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "secondary.dark",
        display: "flex",
        flexDirection: "column",
        p: { xs: 2, md: 5 },
      }}
    >
      <Box sx={{ mb: 4 }}>
        <TicoLogo variant="light" size={36} />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
