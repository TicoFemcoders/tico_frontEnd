import Chip from "@mui/material/Chip";

const EnumChip = ({ value, config, type, sxOverrides }) => {
   const data = config[value];
    if (!data) return null;
    return (
        <Chip
            label={data.label}
            size="small"
            sx={{
                bgcolor: `${type}.${data.key}.bg`,  
                color:   `${type}.${data.key}.text`, 
                fontWeight: 600,
                ...sxOverrides
            }}
        />
    );
};
export default EnumChip;