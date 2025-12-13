import axios from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  email: string;
}

// Usar la URL del backend en producción, o '/api' en desarrollo (que usa el proxy de Vite)
const baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? '/api'
  : 'https://webmail-txvs.onrender.com/api';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post(`${baseURL}/auth/login`, credentials);
    const { access_token, email } = response.data;
    
    // Guardar token en localStorage
    localStorage.setItem('token', access_token);
    localStorage.setItem('email', email);
    
    return { access_token, email };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};

