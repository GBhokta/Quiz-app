import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/* =======================
   REQUEST INTERCEPTOR
======================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    const authFreeEndpoints = [
      "/auth/login/",
      "/auth/register/",
      "/auth/token/refresh/",
    ];

    const isAuthFree = authFreeEndpoints.some((url) =>
      config.url?.includes(url)
    );

    if (token && !isAuthFree) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =======================
   RESPONSE INTERCEPTOR
======================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
