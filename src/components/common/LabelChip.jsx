import { Chip } from "@mui/material";

export const LabelChip = ({ label, sxOverrides, onDelete }) => {
    if (!label) return null;

    return (
        <Chip
            label={label.name ?? label}
            onDelete={onDelete}
            size="small"
            sx={{
                bgcolor: label.color ?? "grey.300",
                color: "#fff", //está hardcodeado porque el dato viene del backend, no se puede garantizar que tenga un color de texto adecuado
                fontWeight: 600,
                ...sxOverrides
            }}
        />
    );
};

export default LabelChip;