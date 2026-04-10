import Box from "@mui/material/Box";

export default function Navbar({ mobileOpen, onMobileClose }) {
  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        bgcolor: "navbar.bg",
      }}
    />
  );
}
