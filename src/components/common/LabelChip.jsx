import React from "react";
import { Chip } from "@mui/material";
import { getContrastText } from "../../utils/getContrastText";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";

export const LabelChip = ({ label, sxOverrides, onDelete }) => {
    if (!label) return null;

    return (
        <Chip
            label={label.name ?? label}
            icon={label.isActive === false ? <DoNotDisturbIcon style={{ fontSize: 14, color: getContrastText(label.color) }} /> : undefined}
            onDelete={onDelete}
            size="small"
            sx={{
                bgcolor: `${label.color}80` ?? "grey.300",
                color: getContrastText(label.color),
                fontWeight: 600,
                ...sxOverrides
            }}
        />
    );
};

export default LabelChip;