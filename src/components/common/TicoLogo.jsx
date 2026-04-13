import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function TicoLogo({ variant = "dark", size = 40 }) {
  const textColor = variant === "light" ? "secondary.contrastText" : "secondary.dark";
  const dotSize = size * 0.6;

  return (
    <Box role="img" aria-label="Tico" sx={{ display: "flex", alignItems: "flex-end" }}>
      <Typography
        component="span"
        aria-hidden="true"
        sx={{
          fontWeight: 900,
          fontSize: size,
          color: textColor,
          lineHeight: 1,
          letterSpacing: "-1px",
        }}
      >
        Tic
      </Typography>
      <Box
        aria-hidden="true"
        sx={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          bgcolor: "primary.main",
          ml: "2px",
          mb: `${size * 0.1}px`,
        }}
      />
    </Box>
  );
}
