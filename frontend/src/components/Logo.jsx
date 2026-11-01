import React from 'react';

/**
 * Reusable EduMitra AI Logo component
 * Points to the verified project logo asset.
 */
const Logo = ({
  className = "w-11 h-11 rounded-xl shadow-sm object-contain",
  alt = "EduMitra AI Logo"
}) => {
  return (
    <img
      src="/src/logo.jpg"
      alt={alt}
      className={className}
      onError={(e) => {
        // Fallback to /assets/LOGO.jpg if /src/logo.jpg is not found
        e.target.onerror = null;
        e.target.src = '/assets/LOGO.jpg';
      }}
    />
  );
};

export default Logo;

