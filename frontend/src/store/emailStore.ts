import { create } from 'zustand';
import { Email, Folder } from '../types/email';
import { emailService } from '../services/api';

// Mock data (comentado - no se usa actualmente)
/*
const MOCK_EMAILS: Email[] = [
  {
    id: 1,
    sender: "Maria González",
    email: "maria.g@designstudio.com",
    avatar: "/gen?prompt=portrait+of+a+young+creative+professional+woman+glasses+smiling&aspect=1:1",
    subject: "Propuesta de Diseño UI/UX - Revisión Final",
    preview: "Hola Alex, adjunto encontrarás los mockups finales para la aplicación móvil. He incorporado todos los comentarios de la reunión del martes...",
    body: `<p>Hola Alex,</p><p>Adjunto encontrarás los mockups finales para la aplicación móvil. He incorporado todos los comentarios de la reunión del martes, específicamente:</p><ul class="list-disc ml-5 my-4 space-y-2"><li>Ajuste en la paleta de colores para mayor contraste.</li><li>Simplificación del flujo de registro.</li><li>Nuevos iconos para la barra de navegación.</li></ul><p>Por favor échale un vistazo y confírmame si podemos proceder a la fase de desarrollo.</p><p>Saludos,<br>Maria</p>`,
    time: dayjs().subtract(20, 'minute').toDate(),
    read: false,
    starred: true,
    folder: 'inbox',
    hasAttachments: true
  },
  {
    id: 2,
    sender: "Notificaciones Stripe",
    email: "noreply@stripe.com",
    avatar: "/gen?prompt=minimalist+logo+letter+S+purple+gradient+tech+style&aspect=1:1",
    subject: "Tu factura de Noviembre está lista",
    preview: "El pago de $29.00 USD para tu suscripción Pro ha sido procesado exitosamente. Puedes descargar tu factura en el panel de control.",
    body: `<p>Hola,</p><p>El pago de <strong>$29.00 USD</strong> para tu suscripción Pro ha sido procesado exitosamente.</p><p>Fecha: 12 Nov, 2023<br>Método: Visa terminada en 4242</p><br><button class="bg-indigo-600 text-white px-4 py-2 rounded">Descargar Factura</button>`,
    time: dayjs().subtract(2, 'hour').toDate(),
    read: true,
    starred: false,
    folder: 'inbox',
    hasAttachments: true
  },
  {
    id: 3,
    sender: "Carlos Rodriguez",
    email: "carlos.r@techcorp.com",
    avatar: "/gen?prompt=portrait+photo+of+a+middle+aged+man+business+suit+friendly&aspect=1:1",
    subject: "¿Almuerzo mañana?",
    preview: "¿Qué tal Alex? Hace tiempo que no hablamos. Estaré por el centro mañana y pensaba si tendrías tiempo para un café o almuerzo rápido.",
    body: `<p>¿Qué tal Alex?</p><p>Hace tiempo que no hablamos. Estaré por el centro mañana y pensaba si tendrías tiempo para un café o almuerzo rápido. Hay un nuevo lugar de tacos cerca de tu oficina que me han recomendado.</p><p>Avísame si te viene bien a las 13:00.</p><p>Un abrazo,<br>Carlos</p>`,
    time: dayjs().subtract(1, 'day').toDate(),
    read: true,
    starred: false,
    folder: 'inbox',
    hasAttachments: false
  },
  {
    id: 4,
    sender: "Equipo de Seguridad",
    email: "security@google.com",
    avatar: "/gen?prompt=shield+icon+security+blue+clean+vector+style&aspect=1:1",
    subject: "Alerta de seguridad: Nuevo inicio de sesión",
    preview: "Detectamos un nuevo inicio de sesión en tu cuenta desde un dispositivo desconocido en Madrid, España. Si fuiste tú, puedes ignorar este mensaje.",
    body: `<p>Detectamos un nuevo inicio de sesión en tu cuenta.</p><p><strong>Dispositivo:</strong> Mac OS X<br><strong>Ubicación:</strong> Madrid, España<br><strong>Hora:</strong> Justo ahora</p><p>Si no fuiste tú, por favor cambia tu contraseña inmediatamente.</p>`,
    time: dayjs().subtract(2, 'day').toDate(),
    read: true,
    starred: true,
    folder: 'inbox',
    hasAttachments: false
  },
  {
    id: 5,
    sender: "Newsletter Semanal",
    email: "news@dailytech.com",
    avatar: "/gen?prompt=abstract+geometric+colorful+logo+modern&aspect=1:1",
    subject: "Las 5 tendencias de IA para 2024",
    preview: "En la edición de esta semana exploramos cómo los modelos de lenguaje están transformando el desarrollo de software y qué esperar el próximo año...",
    body: `<p>¡Feliz viernes!</p><p>En la edición de esta semana exploramos cómo los modelos de lenguaje están transformando el desarrollo de software.</p><h3>1. Code Generation</h3><p>Herramientas como Copilot son solo el inicio...</p>`,
    time: dayjs().subtract(3, 'day').toDate(),
    read: true,
    starred: false,
    folder: 'inbox',
    hasAttachments: false
  },
  {
    id: 6,
    sender: "Ana Belén",
    email: "ana.belen@marketing.com",
    avatar: "/gen?prompt=portrait+of+a+woman+with+curly+hair+in+casual+office+wear&aspect=1:1",
    subject: "Re: Actualización de Campaña Q4",
    preview: "Gracias por el informe. Los números se ven prometedores, especialmente el ROI en redes sociales. ¿Podemos agendar una call para revisar el presupuesto?",
    body: "...",
    time: dayjs().subtract(4, 'day').toDate(),
    read: true,
    starred: false,
    folder: 'inbox',
    hasAttachments: false
  },
  {
    id: 7,
    sender: "Soporte Técnico",
    email: "support@hosting.com",
    avatar: "/gen?prompt=headset+icon+support+service+illustration&aspect=1:1",
    subject: "Ticket #9283 - Resuelto",
    preview: "Nos complace informarle que el problema de latencia en su servidor ha sido solucionado. Hemos optimizado la base de datos y actualizado PHP.",
    body: "...",
    time: dayjs().subtract(5, 'day').toDate(),
    read: false,
    starred: false,
    folder: 'inbox',
    hasAttachments: false
  }
];
*/

interface EmailStore {
  emails: Email[];
  currentFolder: Folder;
  selectedEmailId: number | null;
  searchTerm: string;
  sidebarOpen: boolean;
  composeOpen: boolean;
  toastMessage: string | null;
  
  // Paginación
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
  
  // Actions
  loadEmails: (page?: number) => Promise<void>;
  setCurrentFolder: (folder: Folder) => Promise<void>;
  setSelectedEmailId: (id: number | null) => Promise<void>;
  setSearchTerm: (term: string) => void;
  toggleSidebar: () => void;
  toggleCompose: () => void;
  toggleStar: (id: number) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  deleteEmail: (id: number) => Promise<void>;
  archiveEmail: (id: number) => Promise<void>;
  showToast: (message: string) => void;
  getFilteredEmails: () => Email[];
  getUnreadCount: () => number;
  nextPage: () => Promise<void>;
  previousPage: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
}

export const useEmailStore = create<EmailStore>((set, get) => ({
  emails: [], // Empezar vacío, se cargarán del backend
  currentFolder: 'inbox',
  selectedEmailId: null,
  searchTerm: '',
  sidebarOpen: false,
  composeOpen: false,
  toastMessage: null,
  currentPage: 1,
  pageSize: 50,
  hasMore: false,

  loadEmails: async (page: number = 1) => {
    try {
      const { currentFolder, pageSize } = get();
      const offset = (page - 1) * pageSize;
      const emails = await emailService.getEmails(currentFolder, pageSize, offset);
      // Si recibimos menos emails que el pageSize, no hay más páginas
      set({ 
        emails, 
        currentPage: page,
        hasMore: emails.length === pageSize 
      });
    } catch (error) {
      console.error('Error loading emails:', error);
      get().showToast('Error al cargar correos');
    }
  },

  setCurrentFolder: async (folder) => {
    set({ currentFolder: folder, selectedEmailId: null, currentPage: 1 });
    // Cargar emails del nuevo folder desde la primera página
    try {
      const { pageSize } = get();
      const emails = await emailService.getEmails(folder, pageSize, 0);
      set({ 
        emails, 
        currentPage: 1,
        hasMore: emails.length === pageSize 
      });
    } catch (error) {
      console.error('Error loading folder emails:', error);
      get().showToast('Error al cargar correos');
    }
  },

  setSelectedEmailId: async (id) => {
    if (id === null) {
      set({ selectedEmailId: null });
      return;
    }
    
    const email = get().emails.find(e => e.id === id);
    if (email && !email.read) {
      await get().markAsRead(id);
    }
    set({ selectedEmailId: id });
    
    // Cargar detalle del email si no tiene body
    if (email && !email.body) {
      try {
        const { currentFolder } = get();
        const detail = await emailService.getEmailDetail(id, currentFolder);
        
        // Preferir HTML si está disponible, sino usar texto plano
        let bodyContent = '';
        if (detail.html) {
          bodyContent = detail.html;
        } else if (detail.text) {
          // Convertir texto plano a HTML básico preservando saltos de línea
          bodyContent = detail.text
            .replace(/\n/g, '<br>')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        }
        
        // Extraer email del remitente si viene en formato "Name <email>"
        let senderEmail = email.email;
        if (detail.from) {
          const emailMatch = detail.from.match(/<(.+)>/);
          if (emailMatch) {
            senderEmail = emailMatch[1];
          } else if (detail.from.includes('@')) {
            senderEmail = detail.from;
          }
        }
        
        set((state) => ({
          emails: state.emails.map((e) =>
            e.id === id
              ? {
                  ...e,
                  body: bodyContent || e.preview,
                  sender: detail.from?.replace(/<.+>/, '').trim() || e.sender,
                  email: senderEmail,
                }
              : e
          ),
        }));
      } catch (error) {
        console.error('Error loading email detail:', error);
      }
    }
  },

  setSearchTerm: (term) => set({ searchTerm: term }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  toggleCompose: () => set((state) => ({ composeOpen: !state.composeOpen })),

  toggleStar: async (id) => {
    try {
      await emailService.toggleStar(id);
      set((state) => ({
        emails: state.emails.map((email) =>
          email.id === id ? { ...email, starred: !email.starred } : email
        ),
      }));
    } catch (error) {
      console.error('Error toggling star:', error);
      get().showToast('Error al actualizar favorito');
    }
  },

  markAsRead: async (id) => {
    try {
      await emailService.markAsRead(id);
      set((state) => ({
        emails: state.emails.map((email) =>
          email.id === id ? { ...email, read: true } : email
        ),
      }));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  },

  deleteEmail: async (id) => {
    try {
      await emailService.deleteEmail(id);
      set((state) => ({
        emails: state.emails.filter((email) => email.id !== id),
        selectedEmailId: null,
      }));
      get().showToast('Correo movido a papelera');
    } catch (error) {
      console.error('Error deleting email:', error);
      get().showToast('Error al eliminar correo');
    }
  },

  archiveEmail: async (id) => {
    try {
      await emailService.archiveEmail(id);
      set((state) => ({
        emails: state.emails.filter((email) => email.id !== id),
        selectedEmailId: null,
      }));
      get().showToast('Correo archivado');
    } catch (error) {
      console.error('Error archiving email:', error);
      get().showToast('Error al archivar correo');
    }
  },

  showToast: (message) => {
    set({ toastMessage: message });
    setTimeout(() => set({ toastMessage: null }), 3000);
  },

  getFilteredEmails: () => {
    const { emails, currentFolder, searchTerm } = get();
    let filtered = emails;

    // Filter by folder
    if (currentFolder === 'starred') {
      filtered = filtered.filter((e) => e.starred);
    } else if (currentFolder !== 'inbox') {
      filtered = filtered.filter((e) => e.folder === currentFolder);
    } else {
      filtered = filtered.filter((e) => e.folder === 'inbox');
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.subject.toLowerCase().includes(term) ||
          e.sender.toLowerCase().includes(term) ||
          e.body.toLowerCase().includes(term)
      );
    }

    return filtered;
  },

  getUnreadCount: () => {
    return get().emails.filter((e) => !e.read && e.folder === 'inbox').length;
  },

  nextPage: async () => {
    const { currentPage, hasMore } = get();
    if (hasMore) {
      await get().loadEmails(currentPage + 1);
    }
  },

  previousPage: async () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      await get().loadEmails(currentPage - 1);
    }
  },

  goToPage: async (page: number) => {
    if (page >= 1) {
      await get().loadEmails(page);
    }
  },
}));

