import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../context/useAuth";
import * as authService from "../../services/authService";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Rellena todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(form);
      login(response);

      if (response.data.roles?.includes("ROLE_ADMIN")) {
        navigate("/dashboard-admin", { replace: true });
      } else {
        navigate("/dashboard-employee", { replace: true });
      }
    } catch (err) {
      setError(err.response?.status === 401 ? "Credenciales incorrectas. Comprueba tu email y contraseña." : "Error del servidor. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Box
          sx={{
            bgcolor: "secondary.dark",
            borderRadius: 2,
            px: 2,
            py: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 900, fontSize: 32, color: "secondary.contrastText", lineHeight: 1, letterSpacing: "-1px" }}>Tic</Typography>
          <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: "primary.main", ml: 0.5, mb: "-2px" }} />
        </Box>
      </Box>

      <Typography variant="h1" sx={{ mb: 0.5 }}>
        Bienvenido/a
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Inicia sesión con tu cuenta corporativa
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, fontSize: 13 }}>
          {error}
        </Alert>
      )}

      <TextField label="Correo electrónico" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu.nombre@cohispania.com" fullWidth size="small" sx={{ mb: 2 }} autoComplete="email" autoFocus />

      <TextField label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" fullWidth size="small" sx={{ mb: 2 }} autoComplete="current-password" />

      <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.2, fontWeight: 600 }}>
        {loading ? <CircularProgress size={20} color="inherit" /> : "Iniciar sesión"}
      </Button>

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography component={Link} to="/reset-password" sx={{ fontSize: 13, color: "primary.main", textDecoration: "none", fontWeight: 500 }}>
          ¿Has olvidado tu contraseña?
        </Typography>
      </Box>

      <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px solid", borderColor: "divider", textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          ¿No tienes cuenta? Contacta con tu administrador
        </Typography>
      </Box>
    </Box>
  );
}
