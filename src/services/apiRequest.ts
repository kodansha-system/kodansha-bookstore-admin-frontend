import axios from "axios";

// Tạo một instance của Axios
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${
      import.meta.env.VITE_ACCESS_TOKEN
    }`;
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
    // if (error.response.status === 401) {
    //   logout();
    // }
    return Promise.reject(error);
  }
);

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

export default instance;
