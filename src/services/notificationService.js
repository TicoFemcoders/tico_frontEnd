import { api } from "./api"; 

 export const getPaginatedNotifications = (page = 0, size = 10, signal = null) => {       
      return api.get(                                                                      
          "/api/notifications", {                                                          
          params: { page, size },   // ← falta coma aquí                                   
          signal                                                                         
      }).then(res => res.data);                
  };
  export const markAsRead= (notifId) => 
   api.put(`/api/notifications/${notifId}/read`).then(res => res.data);
   
  
  export const markAllAsRead= () => 
    api.put('/api/notifications/read-all').then(res => res.data);

   export const notificationService = {
    getPaginatedNotifications,
    markAsRead,
    markAllAsRead
   }
