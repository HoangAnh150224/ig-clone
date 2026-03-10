import axiosClient from '../api/axiosClient';

const authService = {
  login: async (credentials) => {
    // Temporarily simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            token: 'mock_jwt_token_12345',
            user: {
              id: 'u-001',
              username: credentials.username || 'antigravity_dev',
              fullName: 'Antigravity Developer',
              avatar: 'https://bit.ly/dan-abramov',
              bio: 'Senior AI Orchestrator 🚀 | Coding the future.',
            }
          }
        });
      }, 1500);
    });
    // TODO: Replace with → return axiosClient.post('/auth/login', credentials);
  },

  signup: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: 'Signup successful!' } });
      }, 1500);
    });
    // TODO: Replace with → return axiosClient.post('/auth/signup', userData);
  },

  getCurrentUser: async () => {
    return axiosClient.get('/auth/me');
  }
};

export default authService;
