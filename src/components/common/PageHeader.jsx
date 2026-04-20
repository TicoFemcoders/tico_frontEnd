import { Box, Typography,Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const PageHeader = ({ title, subtitle, actionText, onActionClick}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }} component="header">

      <Box>
        <Typography variant="h1" gutterBottom sx={{ color: "text.primary", fontWeight: 700 }}>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {actionText && onActionClick && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onActionClick}
            sx={{ borderRadius: 2, px: 3, py: 1 }}
          >
            {actionText}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;