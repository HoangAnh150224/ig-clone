import axiosClient from './axiosClient';

const authService = {
  login: async (credentials) => {
    // Tạm thời giả lập API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            token: 'mock_jwt_token_12345',
            user: {
              id: '1',
              username: credentials.username || 'antigravity_dev',
              fullName: 'Antigravity Developer',
              avatar: 'https://bit.ly/dan-abramov',
              bio: 'Vibe coding my way to the moon 🚀',
            }
          }
        });
      }, 1500);
    });
    // Khi có backend: return axiosClient.post('/auth/login', credentials);
  },

  signup: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: 'Signup successful!' } });
      }, 1500);
    });
    // Khi có backend: return axiosClient.post('/auth/signup', userData);
  },

  getCurrentUser: async () => {
    return axiosClient.get('/auth/me');
  }
};

export default authService;
