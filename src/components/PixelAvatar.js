import React from 'react';

const PixelAvatar = ({ type }) => {
  const avatarImages = {
    tomash: '/images/tomash.jpg',
    bubbiberry: '/images/bubbiberry.jpg',
    batatack: '/images/batatack.jpg'
  };

  return (
    <img
      src={avatarImages[type]}
      alt={type}
      style={{
        width: '96px',
        height: '96px',
        objectFit: 'cover',
        imageRendering: 'pixelated',
        borderRadius: '6px'
      }}
    />
  );
};

export default PixelAvatar;
