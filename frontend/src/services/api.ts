import axios from 'axios';
import { BackendEmail, BackendEmailDetail, Email, mapBackendEmailToEmail, Folder } from '../types/email';

// Usar la URL del backend en producción, o '/api' en desarrollo (que usa el proxy de Vite)
const baseURL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? '/api'
  : 'https://webmail-txvs.onrender.com/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      // Redirigir al login si existe
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const emailService = {
  // Obtener lista de correos
  getEmails: async (folder: Folder = 'inbox'): Promise<Email[]> => {
    try {
      const response = await api.get<BackendEmail[]>('/mail', { 
        params: { folder: folder === 'starred' ? 'starred' : folder } 
      });
      return response.data.map((email) => mapBackendEmailToEmail(email, folder));
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  },

  // Obtener un correo específico (detalle completo)
  getEmailDetail: async (uid: number, folder: Folder = 'inbox'): Promise<BackendEmailDetail> => {
    try {
      const response = await api.get<BackendEmailDetail>(`/mail/message/${uid}`, {
        params: { folder }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching email detail:', error);
      throw error;
    }
  },

  // Enviar correo
  sendEmail: async (data: {
    to: string;
    subject: string;
    body: string;
    attachments?: File[];
  }): Promise<void> => {
    const formData = new FormData();
    formData.append('to', data.to);
    formData.append('subject', data.subject);
    formData.append('body', data.body);
    
    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    await api.post('/mail/send', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Marcar como leído
  markAsRead: async (uid: number): Promise<void> => {
    await api.patch(`/mail/${uid}/read`);
  },

  // Marcar como favorito (toggle)
  toggleStar: async (uid: number): Promise<void> => {
    await api.patch(`/mail/${uid}/star`);
  },

  // Eliminar correo (mover a papelera)
  deleteEmail: async (uid: number): Promise<void> => {
    await api.delete(`/mail/${uid}`);
  },

  // Archivar correo
  archiveEmail: async (uid: number): Promise<void> => {
    await api.patch(`/mail/${uid}/archive`);
  },
};

export default api;

