import axios from "axios";
import store from "../redux/store";
import { setAccessToken, logout } from "../redux/slices/authSlice";

const BASE_URL= import.meta.env.VITE_API_BASE_URL + "/api"

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the access token from Redux on every request.
api.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Prevents multiple simultaneous refresh calls when several requests
// 401 at the same time. All of them wait on the same in-flight promise.
let refreshPromise = null;

const refreshAccessToken = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await api.post("/refresh-token"); // PLACEHOLDER PATH. Confirm exact route when built.
      const newAccessToken = res.data.accessToken; // PLACEHOLDER KEY. Confirm exact response shape when built.
      store.dispatch(setAccessToken(newAccessToken));
      return newAccessToken;
    } catch (err) {
      store.dispatch(logout());
      throw err;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // Don't attempt refresh if the failing request was the refresh
    // call itself, or you get an infinite loop.
    const isRefreshCall = originalRequest.url?.includes("/refresh-token");

    if (status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;