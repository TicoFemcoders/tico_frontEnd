
// import { Box, CircularProgress } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import { useParams } from "react-router-dom";
// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../context/authContext";
// import { ticketService } from "../services/ticketService";

// import TicketHeader from "../components/detailTicket/TicketHeader";
// import TicketDescription from "../components/detailTicket/TicketDescription";
// import TicketHistory from "../components/detailTicket/TicketHistory";
// import TicketResponseBox from "../components/detailTicket/TicketResponseBox";
// import TicketSidebar from "../components/detailTicket/TicketSidebar";

// const DetailTicketPage = () => {
//   const { id } = useParams();
//   console.log("ID:", id);
//   const { user } = useContext(AuthContext);

//   const [ticket, setTicket] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const isAdmin = user?.role === "ADMIN";

//   useEffect(() => {
//     const fetchTicket = async () => {
//       try {
//         const data = await ticketService.getTicketById(id);
//         setTicket(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTicket();
//   }, [id]);

//   if (loading) return <CircularProgress />;
//   if (!ticket) return <div>No encontrado</div>;

//   return (
//     <Grid container spacing={3}>
      
//       <Grid item xs={12} md={8}>
//         <TicketHeader ticket={ticket} />

//         <TicketDescription description={ticket.description} />

//         <TicketHistory history={ticket.history} />

//         <TicketResponseBox />
//       </Grid>

//       <Grid item xs={12} md={4}>
//         <TicketSidebar ticket={ticket} isAdmin={isAdmin} />
//       </Grid>

//     </Grid>
//   );
// };

// export default DetailTicketPage;

import { Box, CircularProgress, Grid, Stack, Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { ticketService } from "../services/ticketService";

import TicketHeader from "../components/detailTicket/TicketHeader";
import TicketDescription from "../components/detailTicket/TicketDescription";
import TicketHistory from "../components/detailTicket/TicketHistory";
import TicketResponseBox from "../components/detailTicket/TicketResponseBox";
import TicketSidebar from "../components/detailTicket/TicketSidebar";

const DetailTicketPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await ticketService.getTicketById(id);
        setTicket(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchTicket();
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (!ticket) return <Typography variant="h6" sx={{ textAlign: 'center', mt: 10 }}>Ticket no encontrado</Typography>;

return (
  <Box sx={{ 
    display: 'flex', 
    bgcolor: '#EDEEF0', 
    minHeight: '100vh', 
    width: '100%' 
  }}>

    <Box sx={{ 
      flexGrow: 1, 
      p: 4, 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      
     
      <TicketHeader ticket={ticket} />

      <Grid container spacing={3} sx={{ mt: 0.5, width: '100%' }}>
        
        <Grid item xs={12} md={8.5} lg={9}>
          <Stack spacing={3}>
            <TicketDescription description={ticket.description} />
            <TicketHistory history={ticket.history} />
            <TicketResponseBox />
          </Stack>
        </Grid>

        <Grid item xs={12} md={3.5} lg={3}>
          <TicketSidebar ticket={ticket} isAdmin={isAdmin} />
        </Grid>
        
      </Grid>
    </Box>
  </Box>
);
}
export default DetailTicketPage;
