import axios from "axios";
import { store } from "../store";
import { setGlobalError } from "../store/slices/uiSlice";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add interceptor (no longer attaching JWT here as it is handled via httpOnly cookie)
axiosClient.interceptors.request.use(
    (config) => {
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
            error.apiResponse = apiResponse;
            
            // Dispatch error to UI except for Auth errors which are handled by components
            if (!response.config.url.includes("/auth/login") && !response.config.url.includes("/auth/signup")) {
                store.dispatch(setGlobalError(apiResponse.message));
            }
            
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
                localStorage.removeItem("user");
                
                // Do not redirect forcefully if we are already in Auth
                if (!window.location.pathname.includes("/accounts/login")) {
                    window.location.href = "/accounts/login";
                }
            } else if (error.response.status === 429) {
                // Handle 429 (Too Many Requests) centrally
                const message = "Too many requests. Please slow down.";
                store.dispatch(setGlobalError(message));
                return Promise.reject(new Error(message));
            } else {
                // Dispatch global error for non-auth errors
                store.dispatch(setGlobalError(apiResponse.message || "Server error occurred"));
            }

            const err = new Error(apiResponse.message || "Server error occurred");
            err.apiResponse = apiResponse;
            return Promise.reject(err);
        }

        // Network connection error
        const networkErr = new Error("Network error. Please check your connection.");
        store.dispatch(setGlobalError("Network error. Please check your connection."));
        return Promise.reject(networkErr);
    },
);

export default axiosClient;
