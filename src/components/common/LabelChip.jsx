import { Chip } from "@mui/material";
import { getContrastText } from "../../utils/getContrastText";

export const LabelChip = ({ label, sxOverrides }) => {
    if (!label) return null;

    return (
        <Chip
            label={label.name ?? label}
            size="small"
            sx={{
                bgcolor: label.color ?? "grey.300",
                color: getContrastText(label.color),
                fontWeight: 600,
                ...sxOverrides
            }}
        />
    );
};

export default LabelChip;