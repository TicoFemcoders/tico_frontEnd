import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CodeInputs from "./CodeInputs";

export default function AuthCodeForm({ title, buttonLabel, submitFn, resendFn, successPath }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendMsg, setResendMsg] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (code.some((c) => !c)) return setError("Introduce los 6 caracteres del código.");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (password !== confirmPassword) return setError("Las contraseñas no coinciden.");

    setLoading(true);
    try {
      await submitFn({ email, code: code.join(""), password, confirmPassword });
      navigate(successPath);
    } catch (err) {
      const msg = err.response?.data?.message || "";
      setError(msg || "Ha ocurrido un error. Inténtalo de nuevo.");
      if (msg.toLowerCase().includes("expirado")) {
        setCode(["", "", "", "", "", ""]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await resendFn(email);
      setResendMsg("Te hemos enviado un nuevo código.");
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setError("No se ha podido reenviar el código. Inténtalo más tarde.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        bgcolor: "background.paper",
        borderRadius: "14px",
        width: "420px",
        p: "36px 32px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        border: (t) => `1px solid ${t.palette.border.soft}`,
      }}
    >
      <Box component="header" sx={{ textAlign: "center", mb: "20px" }}>
        <Box
          component="span"
          aria-hidden="true"
          sx={{
            width: 52,
            height: 52,
            bgcolor: "secondary.dark",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: "14px",
            fontSize: "24px",
          }}
        >
          🔐
        </Box>
        <Box component="h1" sx={{ fontSize: "18px", fontWeight: 700, color: "text.primary" }}>
          {title}
        </Box>
        <Box component="p" sx={{ fontSize: "13px", color: "text.secondary", mt: "6px", lineHeight: 1.5 }}>
          Introduce el código de 6 dígitos enviado a<br />
          <Box component="strong" sx={{ color: "text.primary" }}>
            {email}
          </Box>
        </Box>
      </Box>

      <CodeInputs value={code} onChange={setCode} />

      <Box component="p" sx={{ textAlign: "center", fontSize: "11px", color: "text.subtle", mb: "20px" }}>
        Código válido durante{" "}
        <Box component="strong" sx={{ color: "primary.main" }}>
          30 minutos
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, fontSize: "13px" }}>
          {error}
        </Alert>
      )}
      {resendMsg && (
        <Alert severity="success" sx={{ mb: 2, fontSize: "13px" }}>
          {resendMsg}
        </Alert>
      )}

      <Box sx={{ mb: "12px" }}>
        <Box component="label" htmlFor="new-password" sx={{ display: "block", fontSize: "12px", fontWeight: 600, color: "text.primary", mb: "6px" }}>
          Nueva contraseña{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            *
          </Box>
        </Box>
        <TextField id="new-password" fullWidth type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Box>

      <Box sx={{ mb: "16px" }}>
        <Box component="label" htmlFor="confirm-password" sx={{ display: "block", fontSize: "12px", fontWeight: 600, color: "text.primary", mb: "6px" }}>
          Confirmar contraseña{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            *
          </Box>
        </Box>
        <TextField id="confirm-password" fullWidth type="password" placeholder="Repite la contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </Box>

      <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: "11px", fontSize: "13px", fontWeight: 600 }}>
        {loading ? <CircularProgress size={18} color="inherit" /> : buttonLabel}
      </Button>

      <Box
        component="button"
        type="button"
        onClick={handleResend}
        sx={{
          display: "block",
          width: "100%",
          textAlign: "center",
          mt: "14px",
          fontSize: "12px",
          color: resendCooldown > 0 ? "text.subtle" : "blueAccent.main",
          cursor: resendCooldown > 0 ? "default" : "pointer",
          background: "none",
          border: "none",
          p: 0,
        }}
      >
        {resendCooldown > 0 ? `No he recibido el código · Reenviar (${resendCooldown}s)` : "No he recibido el código · Reenviar"}
      </Box>
    </Box>
  );
}
