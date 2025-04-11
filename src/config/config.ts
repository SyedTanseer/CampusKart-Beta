export const config = {
  api: {
    baseURL: process.env.VITE_API_URL || 'http://localhost:5000',
    endpoints: {
      auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        verify: '/api/auth/verify',
      },
      user: {
        profile: '/api/user/profile',
      },
    },
  },
  ports: {
    frontend: 3001,
    backend: 5000,
    database: 3306,
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    name: process.env.DB_NAME || 'campuskart',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
  },
}; 