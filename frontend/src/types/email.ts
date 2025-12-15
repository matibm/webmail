// Tipos para la respuesta del backend
export interface BackendEmail {
  id: number; // uid del mensaje
  seq: number;
  subject: string;
  from: string;
  date: string;
  preview: string;
  read: boolean;
  starred: boolean;
  folder: string;
  hasAttachments: boolean;
}

export interface BackendEmailDetail {
  subject: string;
  from: string;
  to: string;
  date: Date;
  html?: string;
  text?: string;
  attachments: Array<{
    filename: string;
    contentType: string;
    size: number;
    checksum: string;
  }>;
}

// Tipos para el frontend (compatibles con el store)
export interface Email {
  id: number;
  sender: string;
  email: string;
  avatar: string;
  subject: string;
  preview: string;
  body: string;
  time: Date;
  read: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'starred';
  hasAttachments?: boolean;
}

export type Folder = 'inbox' | 'sent' | 'drafts' | 'trash' | 'starred';

// Helper para convertir BackendEmail a Email
export const mapBackendEmailToEmail = (backendEmail: BackendEmail, folder: Folder): Email => {
  // Extraer email del campo "from" (formato: "Name <email@example.com>" o "email@example.com")
  let email = '';
  let sender = '';
  
  if (backendEmail.from && backendEmail.from !== '(Unknown)') {
    const fromMatch = backendEmail.from.match(/<(.+)>/) || [null, backendEmail.from];
    email = fromMatch[1] || backendEmail.from;
    sender = backendEmail.from.replace(/<.+>/, '').trim() || email.split('@')[0];
  } else {
    sender = '(Unknown)';
    email = '(Unknown)';
  }
  
  // Avatar - dejamos vacío para que el componente Avatar genere uno automáticamente con colores
  const avatar = '';

  // Parsear fecha de forma segura
  let time = new Date();
  if (backendEmail.date) {
    const parsedDate = new Date(backendEmail.date);
    if (!isNaN(parsedDate.getTime())) {
      time = parsedDate;
    }
  }

  return {
    id: backendEmail.id,
    sender,
    email,
    avatar,
    subject: backendEmail.subject || '(No Subject)',
    preview: backendEmail.preview || '(Sin contenido)',
    body: '', // Se cargará cuando se abra el detalle
    time,
    read: backendEmail.read,
    starred: backendEmail.starred,
    folder,
    hasAttachments: backendEmail.hasAttachments || false,
  };
};
