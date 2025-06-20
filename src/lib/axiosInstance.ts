import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL + "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token if available
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("userFeudjoToken");
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh or global errors
axiosInstance.interceptors.response.use(
    (response) => {
        // If backend sends a new token, update it
        const authHeader = response.headers["authorization"] || response.headers["Authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const newToken = authHeader.replace("Bearer ", "");
            if (typeof window !== "undefined") {
                localStorage.setItem("userFeudjoToken", newToken);
            }
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login page
            if (typeof window !== "undefined") {
                localStorage.removeItem("userFeudjoToken");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

