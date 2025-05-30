import React from 'react';

const PixelLogo = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative pixel-border overflow-hidden bg-gray-100`}>
      <img 
        src="/Users/leticiapires/Desktop/Pomodoki/images/logo.png" 
        alt="Logo"
        className="w-full h-full object-cover pixel-art"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

export default PixelLogo;
