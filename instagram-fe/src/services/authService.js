import axiosClient from "../api/axiosClient";

/**
 * AuthService handles all authentication related API calls.
 * All responses are unboxed by axiosClient's interceptor.
 */
const authService = {
    /**
     * Login user
     * API: POST /auth/login
     * @param {Object} credentials {username, password}
     */
    login: async (credentials) => {
        return axiosClient.post("/auth/login", credentials);
    },

    /**
     * Signup user
     * API: POST /auth/signup
     * @param {Object} userData {username, fullName, email, password}
     */
    signup: async (userData) => {
        return axiosClient.post("/auth/register", userData);
    },

    /**
     * Get current authenticated user based on JWT in localStorage
     * API: GET /auth/me
     */
    getCurrentUser: async () => {
        return axiosClient.get("/auth/me");
    },
};

export default authService;
