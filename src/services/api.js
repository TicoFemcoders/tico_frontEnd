import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const authHeader = response.headers["authorization"];
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, "");
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return response;
  },
  (error) => {
    const serverMessage = error.response?.data?.mensaje || "Ocurrió un error inesperado";

    error.friendlyMessage = serverMessage;

    const isLoginRequest = error.config?.url?.includes("/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    if (error.response?.status === 403 && !isLoginRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login?roleChanged=1";
    }
    return Promise.reject(error);
  },
);