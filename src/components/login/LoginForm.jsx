import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../../context/useAuth";
import * as authService from "../../services/authService";
import ForgotPasswordModal from "../login/ForgotPasswordModal";
import TicoLogo from "../common/TicoLogo";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
        navigate("/all-tickets", { replace: true });
      } else {
        navigate("/my-tickets", { replace: true });
      }
    } catch (err) {
      setError(  err.response?.status === 401 
          ? "Credenciales incorrectas. Comprueba tu email y contraseña."
          : (err.friendlyMessage || "Error del servidor. Inténtalo de nuevo.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box component="header" sx={{ mb: 4 }}>
        <TicoLogo variant="dark" size={40} />
      </Box>

      <Typography variant="h1" sx={{ mb: 0.5, color: "secondary.dark", fontWeight: 900, fontSize: "24px" }}>
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

      <Typography component="label" htmlFor="login-email" sx={{ fontSize: 13, fontWeight: 500, color: "text.primary", mb: 0.5 }}>
        Correo electrónico
      </Typography>
      <TextField id="login-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu.nombre@cohispania.com" fullWidth size="small" sx={{ mb: 2 }} autoComplete="email" autoFocus />

      <Typography component="label" htmlFor="login-password" sx={{ fontSize: 13, fontWeight: 500, color: "text.primary", mb: 0.5 }}>
        Contraseña
      </Typography>
      <TextField id="login-password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" fullWidth size="small" sx={{ mb: 2 }} autoComplete="current-password" />

      <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.2, fontWeight: 600 }}>
        {loading ? <CircularProgress size={20} color="inherit" /> : "Iniciar sesión"}
      </Button>

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography component="button" type="button" onClick={() => setModalOpen(true)} sx={{ cursor: "pointer", fontSize: 13, color: "blueAccent.main", background: "none", border: "none", p: 0 }}>
          ¿Has olvidado tu contraseña?
        </Typography>
        <ForgotPasswordModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </Box>

      <Box component="footer" sx={{ mt: 2.5, pt: 2, borderTop: "1px solid", borderColor: "divider", textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          ¿No tienes cuenta? Contacta con tu administrador
        </Typography>
      </Box>
    </Box>
  );
}
