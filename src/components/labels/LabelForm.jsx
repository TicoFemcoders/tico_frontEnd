import React,  { useState } from "react";
import { Box, Typography, Popover, FormHelperText, TextField } from "@mui/material";
import { HexColorPicker } from "react-colorful";

const LabelForm = ({ name, setName, color, setColor, error }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <TextField
                label="Nombre de la etiqueta"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!error && !name}
                size="small"
            />

            <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                    Color de etiqueta
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                        role="button"
                        tabIndex={0}
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setAnchorEl(e.currentTarget);
                            }
                        }}
                        sx={{
                            width: 40, height: 40,
                            bgcolor: color,
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                            cursor: "pointer",
                            flexShrink: 0,
                            "&:focus-visible": {
                                outline: "2px solid",
                                outlineColor: "primary.main",
                                outlineOffset: 2
                            }
                        }}
                    />
                    <Typography variant="body2" sx={{ color: "text.secondary", fontFamily: "monospace" }}>
                        {color.toUpperCase()}
                    </Typography>
                </Box>

                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                    <Box sx={{ p: 2 }}>
                        <HexColorPicker color={color} onChange={setColor} />
                    </Box>
                </Popover>

                {error && (
                    <FormHelperText error sx={{ mt: 1 }}>
                        {error}
                    </FormHelperText>
                )}
            </Box>
        </Box>
    );
};

export default LabelForm;