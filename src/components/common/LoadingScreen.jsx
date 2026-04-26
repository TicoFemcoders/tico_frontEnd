import { Box, CircularProgress } from "@mui/material";

const LoadingScreen = ({ minHeight = "50vh" }) => (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight }}>
        <CircularProgress />
    </Box>
);

export default LoadingScreen;