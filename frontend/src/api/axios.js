import axios from "axios";

// One shared axios instance so every page talks to the backend the same way.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the saved JWT to every request automatically, if we have one.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ga_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend ever says the token is invalid/expired (401), clear the
// session and send the user back to login instead of showing a broken page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ga_token");
      localStorage.removeItem("ga_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
