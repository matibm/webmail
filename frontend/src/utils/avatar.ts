// Paleta de colores similar a Gmail
const avatarColors = [
  '#4285F4', // Azul
  '#34A853', // Verde
  '#FBBC05', // Amarillo
  '#EA4335', // Rojo
  '#9C27B0', // Púrpura
  '#FF9800', // Naranja
  '#00BCD4', // Cian
  '#E91E63', // Rosa
  '#795548', // Marrón
  '#607D8B', // Azul gris
  '#FF5722', // Rojo oscuro
  '#673AB7', // Púrpura oscuro
  '#009688', // Verde azulado
  '#3F51B5', // Índigo
];

/**
 * Genera un color consistente basado en una cadena (email o nombre)
 */
export function getAvatarColor(str: string): string {
  if (!str) return avatarColors[0];
  
  // Sumar los valores ASCII de todos los caracteres
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Usar el hash para seleccionar un color de la paleta
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}

/**
 * Obtiene las iniciales de un nombre o email
 */
export function getInitials(name: string, email?: string): string {
  if (!name || name === '(Unknown)') {
    // Si no hay nombre, usar email
    if (email && email !== '(Unknown)') {
      return email.charAt(0).toUpperCase();
    }
    return '?';
  }

  // Limpiar el nombre (remover paréntesis, corchetes, etc.)
  const cleanName = name.trim();
  
  // Dividir por espacios
  const parts = cleanName.split(/\s+/);
  
  if (parts.length === 1) {
    // Un solo nombre: usar la primera letra
    return parts[0].charAt(0).toUpperCase();
  } else {
    // Múltiples palabras: usar la primera letra de la primera y última palabra
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}

