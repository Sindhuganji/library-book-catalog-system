import axios from 'axios';

let activeRequests = 0;

const notifyLoading = () => {
  window.dispatchEvent(
    new CustomEvent("api-loading", { detail: { loading: activeRequests > 0 } })
  );
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    activeRequests++;
    notifyLoading();
    return config;
  },
  (error) => {
    activeRequests--;
    notifyLoading();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    activeRequests--;
    notifyLoading();
    return response;
  },
  (error) => {
    activeRequests--;
    notifyLoading();
    return Promise.reject(error);
  }
);

export default api;