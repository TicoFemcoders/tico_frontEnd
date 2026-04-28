import React, { useRef } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

export default function CodeInputs({ value, onChange }) {
  const theme = useTheme();
  const inputRefs = useRef([]);

  const handleChange = (index, raw) => {
    const char = raw.toUpperCase().slice(-1);
    const next = [...value];
    next[index] = char;
    onChange(next);
    if (char && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);
    const next = [...value];
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    onChange(next);
    const firstEmpty = next.findIndex((c) => !c);
    inputRefs.current[firstEmpty >= 0 ? firstEmpty : 5]?.focus();
  };

  return (
    <Box role="group" aria-label="Código de verificación" sx={{ display: "flex", gap: "8px", justifyContent: "center", my: "20px" }} onPaste={handlePaste}>
      {value.map((val, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          maxLength={1}
          value={val}
          aria-label={`Dígito ${i + 1} de 6`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          style={{
            width: "44px",
            height: "52px",
            background: theme.palette.background.paper,
            border: `1.5px solid ${val ? theme.palette.primary.main : theme.palette.border.main}`,
            borderRadius: "8px",
            textAlign: "center",
            fontSize: "20px",
            fontWeight: 700,
            color: val ? theme.palette.primary.main : theme.palette.text.subtle,
            fontFamily: theme.typography.fontFamily,
            outline: "none",
          }}
        />
      ))}
    </Box>
  );
}
