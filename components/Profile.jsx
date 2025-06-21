import React from 'react';

const Profile = ({ type }) => {
  const avatarImages = {
    tomash: '/images/tomash_profile.png',
    bubbiberry: '/images/bubbiberry_profile.png',
    batatack: '/images/batatack_profile.png'
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

export default Profile;
