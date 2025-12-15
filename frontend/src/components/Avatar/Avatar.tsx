import React from 'react';
import { getAvatarColor, getInitials } from '../../utils/avatar';

interface AvatarProps {
  name: string;
  email?: string;
  size?: number;
  className?: string;
  imageUrl?: string;
  onImageError?: () => void;
}

export default function Avatar({ 
  name, 
  email, 
  size = 40, 
  className = '',
  imageUrl,
  onImageError 
}: AvatarProps) {
  const initials = getInitials(name, email);
  const backgroundColor = getAvatarColor(email || name);
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
    if (onImageError) {
      onImageError();
    }
  };

  // Si hay imagen URL y no hay error, mostrar la imagen
  if (imageUrl && !imageError) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size }}
        onError={handleImageError}
      />
    );
  }

  // Mostrar avatar con iniciales y color
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-medium shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor,
        fontSize: size * 0.4,
      }}
      title={name}
    >
      {initials}
    </div>
  );
}

