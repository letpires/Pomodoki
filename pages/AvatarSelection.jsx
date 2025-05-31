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
    <div className=" items-center justify-center p-4" style={{ backgroundColor: '#ffedae' }}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className=" text-center">
        <h1
          className="text-2xl mb-12 text-[#5c4435]"
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          Choose your
          <br />
          Pomodoki!
        </h1>

        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {avatars.map((avatar) => (
            <button
              key={avatar.type}
              onClick={() => setSelectedAvatar(avatar.type)}
              className={`p-2 rounded border-2 transition-all bg-[#fdf1d1] ${selectedAvatar === avatar.type
                  ? 'border-green-500'
                  : 'border-gray-400 hover:border-black'
                }`}
            >
              <PixelAvatar type={avatar.type} />
            </button>
          ))}
        </div>


        <PixelButton onClick={() => onConfirm(selectedAvatar)} className="w-full max-w-xs mx-auto mt-8">
          ✓ Confirm Avatar
        </PixelButton>

        <PixelButton onClick={() => onConfirm(selectedAvatar)} className="w-full max-w-xs mx-auto"></PixelButton>
      </div>
    </div>
  );
};

export default AvatarSelection;
