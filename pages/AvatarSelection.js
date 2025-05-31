import React, { useState } from 'react';
import Head from 'next/head';
import PixelAvatar from '../src/components/PixelAvatar';

const AvatarSelection = ({ onConfirm }) => {
  const [selectedAvatar, setSelectedAvatar] = useState('tomash');

  const avatars = [
    { type: 'tomash', name: 'Tomash' },
    { type: 'bubbiberry', name: 'Bubbiberry' },
    { type: 'batatack', name: 'Batatack' },
  ];

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: '#ffedae' }}
      >
        <div className="flex flex-col items-center text-center pixel-card w-full max-w-lg">
          <h1
            className="text-lg mb-8 text-[#5c4435] text-center w-full"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
          >
            Choose your
            <br />
            Pomodoki!
          </h1>

          {/* Avatares centralizados, pequenos, dois em cima e um abaixo
          <div className="grid grid-cols-2 gap-4 mb-8 place-items-center">
            {avatars.map((avatar, index) => (
              <div
                key={avatar.type}
                className={`p-2 rounded border-2 transition-all bg-[#fdf1d1] ${
                  selectedAvatar === avatar.type
                    ? 'border-green-500'
                    : 'border-gray-400 hover:border-black'
                } ${index === 2 ? 'col-span-2' : ''}`}
              >
                <button onClick={() => setSelectedAvatar(avatar.type)}>
                  <PixelAvatar type={avatar.type} size="small" />
                </button>
              </div>
            ))}
          </div> */}

            <div className="grid grid-cols-2 gap-4 mb-8 place-items-center">
            {avatars.map((avatar, index) => (
                <div
                key={avatar.type}
                className={`p-2 rounded border-2 transition-all bg-[#fdf1d1] ${
                    selectedAvatar === avatar.type
                    ? 'border-green-500'
                    : 'border-gray-400 hover:border-black'
                } ${index === 0 ? 'col-span-2' : ''}`} // o primeiro ocupa a linha inteira
                >
                <button onClick={() => setSelectedAvatar(avatar.type)}>
                    <PixelAvatar type={avatar.type} />
                </button>
                </div>
            ))}
            </div>
      

          {/* Botão de confirmar (opcional) */}
          {/* 
          <button
            onClick={() => onConfirm(selectedAvatar)}
            className="w-full py-3 mt-4 rounded text-white font-bold text-sm flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#4CAF50',
              fontFamily: "'Press Start 2P', cursive",
              boxShadow: '2px 2px #3b873e',
            }}
          >
            ✅ Confirm Avatar
          </button>
          */}
        </div>
      </div>
    </>
  );
};

export default AvatarSelection;
