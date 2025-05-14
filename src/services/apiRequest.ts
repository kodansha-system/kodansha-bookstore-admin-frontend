import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
const refreshToken = async () => {
  try {
    const response = await instance.get(`/auth/refresh`);
    const newAccessToken = response.data.access_token;

    Cookies.set("access_token", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Refresh token failed:", error);
    throw error;
  }
};

instance.interceptors.request.use(
  (config) => {
    const access_token = Cookies.get("access_token");

    config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response.status === 401) {
      logout();
    }
    return Promise.reject(error?.response?.data);
  }
);

export function logout() {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  window.location.href = "/login";
}

export default instance;
