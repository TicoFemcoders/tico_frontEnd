import Box from "@mui/material/Box";
import LoginBrand from "../components/login/LoginBrand";
import LoginForm from "../components/login/LoginForm";

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "secondary.dark",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 5 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          alignItems: "center",
          gap: { xs: 0, md: 10 },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <LoginBrand />

        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 4,
            width: "100%",
            maxWidth: 380,
            boxShadow: (theme) => theme.customShadows.card,
          }}
        >
          <LoginForm />
        </Box>
      </Box>
    </Box>
  );
}
