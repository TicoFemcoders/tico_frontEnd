import { Paper, Box, Typography, TextField, Button, Popover, IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";

const FIXED_PALETTE = [
    "#FF5733", "#C70039", "#900C3F", "#581845", "#FF4D4D", "#B22222",
    "#FFC300", "#FF8D1A", "#D4AC0D", "#997300", "#FFD700", "#E67E22",
    "#AF7AC5", "#8E44AD", "#633974", "#4A235A", "#9B59B6", "#5B2C6F",
    "#2ECC71", "#28B463", "#1D8348", "#145A32", "#27AE60", "#0E6251",
    "#3498DB", "#2E86C1", "#21618C", "#1B4F72", "#1ABC9C", "#2C3E50"
];

const normalize = (c) => c?.replace('#', '').trim().toUpperCase() || "";

const LabelForm = ({ onAdd, existingLabels = [] }) => {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#3498DB");
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenPicker = (event) => setAnchorEl(event.currentTarget);
    const handleClosePicker = () => setAnchorEl(null);

    const isColorTaken = existingLabels.some(l => normalize(l.color) === normalize(color));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && !isColorTaken) {
            onAdd({ name, color });
            setName("");
            const nextAvailable = FIXED_PALETTE.find(c => 
                !existingLabels.some(l => normalize(l.color) === normalize(c))
            );
            setColor(nextAvailable || "#3498DB");
        }
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 2, mt: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
                CREAR NUEVA ETIQUETA
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <TextField
                    label="Nombre de la etiqueta"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Soporte Técnico"
                    sx={{ flexGrow: 1 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Color:</Typography>
                    <Tooltip title={isColorTaken ? "Este color ya está en uso" : "Seleccionar color"}>
                        <IconButton
                            onClick={handleOpenPicker}
                            sx={{
                                bgcolor: color,
                                width: 42,
                                height: 42,
                                border: '3px solid #fff',
                                boxShadow: isColorTaken ? '0 0 0 2px #d32f2f' : '0 0 0 1px #ddd',
                                '&:hover': { bgcolor: color, opacity: 0.9 },
                                transition: 'all 0.2s'
                            }}
                        >
                            {isColorTaken && <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>✕</Typography>}
                        </IconButton>
                    </Tooltip>
                </Box>

                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleClosePicker}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    slotProps={{
                        paper: {
                            sx: { borderRadius: 2, mt: -1, boxShadow: '0px 8px 24px rgba(0,0,0,0.15)', border: '1px solid #eee' }
                        }
                    }}
                >
                    <Box sx={{ p: 2, width: 250 }}> 
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(6, 1fr)',
                            gap: 1
                        }}>
                            {FIXED_PALETTE.map((c) => {
                                const isUsed = existingLabels.some(l => normalize(l.color) === normalize(c));
                                const isSelected = normalize(color) === normalize(c);

                                return (
                                    <Box
                                        key={c}
                                        onClick={() => {
                                            if (!isUsed) {
                                                setColor(c);
                                                handleClosePicker();
                                            }
                                        }}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '6px',
                                            bgcolor: c,
                                            cursor: isUsed ? 'not-allowed' : 'pointer',
                                            opacity: isUsed ? 0.2 : 1,
                                            border: isSelected ? '2px solid #000' : '1px solid rgba(0,0,0,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            pointerEvents: isUsed ? 'none' : 'auto',
                                            transition: 'transform 0.1s',
                                            '&:hover': { transform: isUsed ? 'none' : 'scale(1.1)' }
                                        }}
                                    >
                                        {isUsed && <Typography sx={{ fontSize: '10px', color: 'rgba(0,0,0,0.6)' }}>✕</Typography>}
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Popover>

                <Button
                    variant="contained"
                    type="submit"
                    disabled={!name.trim() || isColorTaken}
                    sx={{
                        bgcolor: 'orange',
                        color: 'white',
                        px: 4,
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#e67e22' },
                        '&.Mui-disabled': { bgcolor: '#f5f5f5', color: '#999' }
                    }}
                >
                    {isColorTaken ? "COLOR USADO" : "GUARDAR"}
                </Button>
            </Box>
        </Paper>
    );
};

export default LabelForm;