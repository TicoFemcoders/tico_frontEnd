import { api } from "./api"; 

  export const getPaginatedNotifications= (page = 0, size = 10) => 
    api.get(`/api/notifications?page=${page}&size=${size}`).then(res=> res.data);
  
  export const markAsRead= (notifId) => 
   api.put(`/api/notifications/${notifId}/read`).then(res => res.data);
   
  
  export const markAllAsRead= () => 
    api.put('/api/notifications/read-all').then(res => res.data);

   export const notificationService = {
    getPaginatedNotifications,
    markAsRead,
    markAllAsRead
   }
