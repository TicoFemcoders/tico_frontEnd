
import { Outlet } from "react-router-dom";
import { Box, Container, CssBaseline } from "@mui/material";

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/*<CssBaseline />*/}
      {/* <Navbar /> */}

      <Container 
        component="main" 
        maxWidth="lg" 
        sx={{ 
          mt: 4, 
          mb: 4, 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        <Outlet />
      </Container>

    </Box>
  );
};

export default MainLayout;