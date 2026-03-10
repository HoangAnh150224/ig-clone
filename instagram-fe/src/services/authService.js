import axiosClient from '../api/axiosClient';
import { currentUser } from '../api/dummyData';

const authService = {
  /**
   * Login user
   * API: POST /api/auth/login
   */
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.password === 'error') {
          const error = new Error('Invalid username or password');
          error.apiResponse = { status: 'error', message: 'Invalid username or password', code: 401 };
          return reject(error);
        }

        resolve({
          token: 'mock_jwt_token_' + Math.random().toString(36).substr(2),
          user: {
            ...currentUser,
            username: credentials.username || currentUser.username,
          }
        });
      }, 1000);
    });
  },

  /**
   * Signup user
   * API: POST /api/auth/signup
   */
  signup: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation errors
        if (userData.username === 'taken') {
          const error = new Error('Validation failed');
          error.apiResponse = { 
            status: 'error', 
            message: 'Validation failed', 
            code: 400,
            errors: [
              { field: 'username', message: 'Username is already taken', code: 'DUPLICATE_ENTRY' }
            ]
          };
          return reject(error);
        }

        resolve({
          token: 'mock_jwt_token_signup_' + Math.random().toString(36).substr(2),
          user: {
            ...currentUser,
            id: 'u-' + Math.floor(Math.random() * 1000),
            username: userData.username,
            fullName: userData.fullName,
            email: userData.email
          }
        });
      }, 1200);
    });
  },

  /**
   * Get current authenticated user
   * API: GET /api/auth/me
   */
  getCurrentUser: async () => {
    // This will use axiosClient which already handles unboxing
    return axiosClient.get('/auth/me');
  }
};

export default authService;
