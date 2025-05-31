import React from 'react';

const PixelPomo = ({ type }) => {
  const avatarImages = {
    tomash: '/images/tomash_failure.png',
    bubbiberry: '/images/bubbi_failure.png',
    batatack: '/images/batatack_failure.png'
  };

  return (
    <img
      src={avatarImages[type]}
      alt={type}
      style={{
        width: '160px',
        height: '160px',
        objectFit: 'cover',
        imageRendering: 'pixelated',
        display: 'block',
        margin: '0 auto 16px auto'
      }}
    />
  );
};

export default PixelPomo;