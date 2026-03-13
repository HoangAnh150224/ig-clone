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
     * Logout user - invalidates JWT on backend (Redis blacklist)
     * API: POST /auth/logout
     */
    logout: async () => {
        return axiosClient.post("/auth/logout");
    },

    /**
     * Get current authenticated user based on JWT in localStorage
     * API: GET /auth/me
     */
    getCurrentUser: async () => {
        return axiosClient.get("/auth/me");
    },

    /**
     * Change user password
     * API: POST /auth/change-password
     * @param {Object} data {currentPassword, newPassword}
     */
    changePassword: async (data) => {
        return axiosClient.post("/auth/change-password", data);
    },

    /**
     * Forgot password - Request OTP
     * API: POST /auth/forgot-password
     * @param {String} email
     */
    forgotPassword: async (email) => {
        return axiosClient.post("/auth/forgot-password", { email });
    },

    /**
     * Reset password with OTP
     * API: POST /auth/reset-password
     * @param {Object} data {email, otp, newPassword}
     */
    resetPassword: async (data) => {
        return axiosClient.post("/auth/reset-password", data);
    },
};

export default authService;
