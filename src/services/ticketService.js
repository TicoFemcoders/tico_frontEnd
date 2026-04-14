import { api } from "./api";
export const ticketService = {

    getAllTickets: async () => {
    const response = await api.get("/api/tickets");
    return response.data;
  },

//   getTicketById: async (id) => {
//     const response = await api.get(`/api/tickets/${id}`);
//     return response.data;
//   },

    getMyTickets: async (userId) => { 
    const response = await api.get("/api/tickets/my-tickets", {
         params: { userId: userId }
    });
    return response.data;
  },

  getAssignedTickets: async (userId) => {
    const response = await api.get("/api/tickets/assigned", {
         params: { adminId: userId }
    });
    return response.data;
  },
};


