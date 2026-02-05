import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo limpiar sesión si es error 401 Y el endpoint NO es /auth/login ni /perfil/contrasena
    const isLoginEndpoint = error.config?.url?.includes("/auth/login");
    const isChangePasswordEndpoint =
      error.config?.url?.includes("/perfil/contrasena");

    if (
      error.response?.status === 401 &&
      !isLoginEndpoint &&
      !isChangePasswordEndpoint
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
