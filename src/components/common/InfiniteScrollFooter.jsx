import { Box, Typography, CircularProgress } from "@mui/material";
const InfiniteScrollFooter = ({ 
    loading, 
    hasMore, 
    isEmpty, 
    scrollText = "↓ Desliza para ver más", 
    endText = "— Fin de la lista —" 
}) => {
    if (isEmpty) return null;
    return (
        <Box sx={{ pb: 1 }}>
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} sx={{ color: "text.subtle" }} />
                </Box>
            )}
            {hasMore && !loading && scrollText &&(
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1.5, opacity: 0.7 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: 0.5 }}>
                        {scrollText}
                    </Typography>
                </Box>
            )}
            {!hasMore && !loading && endText && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, opacity: 0.5 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {endText}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};
export default InfiniteScrollFooter;