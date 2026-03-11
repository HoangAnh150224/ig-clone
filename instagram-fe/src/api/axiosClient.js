import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add interceptor to attach JWT to each request
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Handle response according to ApiResponse Contract
axiosClient.interceptors.response.use(
    (response) => {
        const apiResponse = response.data;

        // If Backend returns "error" status in body (even if HTTP code is 200)
        if (apiResponse.status === "error") {
            const error = new Error(
                apiResponse.message || "An unexpected error occurred",
            );
            error.apiResponse = apiResponse; // Attach the entire response to get the errors[] array if needed
            return Promise.reject(error);
        }

        // If successful, only return the raw data part to the Service
        return apiResponse.data;
    },
    (error) => {
        // Handle HTTP errors (4xx, 5xx)
        if (error.response) {
            const apiResponse = error.response.data;

            // Handle 401 (Unauthorized) errors centrally
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/auth";
            }

            // Throw error with message from Backend (English)
            const err = new Error(
                apiResponse.message || "Server error occurred",
            );
            err.apiResponse = apiResponse;
            return Promise.reject(err);
        }

        // Network connection error
        const networkErr = new Error(
            "Network error. Please check your connection.",
        );
        return Promise.reject(networkErr);
    },
);

export default axiosClient;
