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
        width: "50px",
        height: "50px",
        borderRadius: "50%",
      }}
    />
  );
};

export default PixelAvatar;
