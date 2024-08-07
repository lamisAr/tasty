import axios from "axios";

// Create an Axios instance with default options
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && error.response.data?.message === "Invalid token.") {
      // Handle unauthorized access
      // eslint-disable-next-line
      alert("Session expired. Please log in again.");
      // Clear token from storage
      localStorage.removeItem("jwt");
      // change setting options
      localStorage.setItem("settings", JSON.stringify(["Login", "Register"]));
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
