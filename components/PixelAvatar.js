import React from "react";

const PixelAvatar = ({ type, width, height, borderRadius }) => {
  const avatarImages = {
    tomash: "/images/tomash.jpg",
    bubbiberry: "/images/bubbiberry.jpg",
    batatack: "/images/batatack.jpg",
  };

  return (
    <img
      src={avatarImages[type]}
      alt={type}
      style={{
        width: width || "100px",
        height: height || "100px",
        borderRadius: borderRadius || "0%",
      }}
    />
  );
};

export default PixelAvatar;
