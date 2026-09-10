import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
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

    if (error.code === "ECONNABORTED") {
      error.friendlyMessage = "El servidor está tardando demasiado. Inténtelo de nuevo en unos segundos.";
      return Promise.reject(error);
    }
    if (error.code === "ERR_NETWORK") {
      error.friendlyMessage = "Problema de conexión. Compruebe su conexión a internet o si el servidor está caído.";
      return Promise.reject(error);
    }

    const isLoginRequest = error.config?.url?.includes("/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    // Un 403 no siempre significa que la sesión o el rol hayan caducado: el
    // backend también lo usa para reglas de negocio puntuales (p. ej. "no
    // eres el creador de este ticket"), en cuyo caso la sesión sigue siendo
    // válida y solo hay que mostrar el mensaje, no expulsar al usuario.
    // Solo forzamos logout cuando el backend marca explícitamente el 403
    // como de sesión/rol (code: "SESSION_FORBIDDEN").
    if (error.response?.status === 403 && !isLoginRequest && error.response?.data?.code === "SESSION_FORBIDDEN") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login?roleChanged=1";
    }
    return Promise.reject(error);
  },
);