import React, { useState } from 'react';
import Head from 'next/head';
import PixelButton from '../src/components/PixelButton';
import PixelAvatar from '../src/components/PixelAvatar';

const AvatarSelection = ({ onConfirm }) => {
  const [selectedAvatar, setSelectedAvatar] = useState('tomash');

  const avatars = [
    { type: 'tomash', name: 'Tomash' },
    { type: 'bubbiberry', name: 'Bubbiberry' },
    { type: 'batatack', name: 'Batatack' },
  ];

  return (
    <div
      className="popup-container min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#ffedae" }}
    >
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </Head>

      <div className="w-full max-w-xs text-center">
        {/* Título */}
        <h1
          className="mb-8"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: "#5c4435",
            fontSize: "1.2rem",
            textAlign: 'center',
            lineHeight: "1.8rem",
          }}
        >
          Choose your<br />
          <span>Pomodoki!</span>
        </h1>

        {/* Avatar de cima */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <button
            onClick={() => setSelectedAvatar(avatars[0].type)}
            className={`p-1 rounded transition-all ${selectedAvatar === avatars[0].type ? 'border-2 border-green-500' : ''}`}
            style={{
              imageRendering: 'pixelated',
              background: 'transparent',
              border: selectedAvatar === avatars[0].type ? '3px solid #22c55e' : 'none',
              padding: 0
            }}
          >
            <PixelAvatar type={avatars[0].type} />
          </button>
        </div>

        {/* Linha de baixo */}
        <div style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
          {avatars.slice(1).map((avatar) => (
            <button
              key={avatar.type}
              onClick={() => setSelectedAvatar(avatar.type)}
              className={`p-1 rounded transition-all ${selectedAvatar === avatar.type ? 'border-2 border-green-500' : ''}`}
              style={{
                imageRendering: 'pixelated',
                background: 'transparent',
                border: selectedAvatar === avatar.type ? '3px solid #22c55e' : 'none',
                padding: 0
              }}
            >
              <PixelAvatar type={avatar.type} />
            </button>
          ))}
        </div>

        {/* Botão Confirmar */}
        <button
          onClick={() => onConfirm(selectedAvatar)}
          style={{
            backgroundColor: "#5aad00",
            color: "#ffedae",
            fontFamily: "'VT323', monospace",
            fontSize: "1.25rem",
            padding: "10px 24px",
            border: "2px solid #5c4435",
            borderRadius: "4px",
            cursor: "pointer",
            boxShadow: "4px 4px #5c4435",
            textTransform: "uppercase",
            marginTop: "40px",
          }}
        >
          ✓ Confirm Avatar
        </button>
      </div>
    </div>
  );
};

export default AvatarSelection;
