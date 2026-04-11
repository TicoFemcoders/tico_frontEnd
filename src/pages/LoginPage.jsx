import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import LoginBrand from "../components/login/LoginBrand";
import LoginForm from "../components/login/LoginForm";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const justActivated = searchParams.get("activated") === "1";
  const justReset = searchParams.get("reset") === "1";

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
          {justActivated && (
            <Alert severity="success" sx={{ mb: 2, fontSize: "13px" }}>
              ¡Cuenta activada! Ya puedes iniciar sesión.
            </Alert>
          )}
          {justReset && (
            <Alert severity="success" sx={{ mb: 2, fontSize: "13px" }}>
              Contraseña actualizada. Ya puedes iniciar sesión.
            </Alert>
          )}
          <LoginForm />
        </Box>
      </Box>
    </Box>
  );
}
