import React from 'react';
import Head from 'next/head';
import PixelAvatar from '../src/components/PixelAvatar';
import PixelButton from '../src/components/PixelButton';

const Success = ({ avatar = 'bubbiberry', balance = '5.50' }) => {
  return (
    <>
      <Head>
        <title>Pomodoki - Success</title>
        <meta name="viewport" content="width=400, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </Head>
      <div className="popup-container" style={{ position: 'relative' }}>
        <h1
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: '#5c4435',
            fontSize: '2rem',
            margin: '32px 0 16px 0',
            textAlign: 'center',
            letterSpacing: '2px',
          }}
        >
          WELL DONE!
        </h1>
        <div
          style={{
            fontFamily: 'VT323, monospace',
            color: '#5c4435',
            fontSize: '1.3rem',
            textAlign: 'center',
            marginBottom: '16px',
          }}
        >
          Your Pomodoki levelep up!<br />
          Updated Balance: {balance} FLOW
        </div>
        {/* Sparkles (opcional, pode ser melhorado com imagens) */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '8px 0 0 0' }}>
          <span style={{ fontSize: '2rem', color: '#bfae5a', margin: '0 8px' }}>✦</span>
          <span style={{ fontSize: '1.2rem', color: '#bfae5a', margin: '0 8px' }}>✧</span>
          <span style={{ fontSize: '2rem', color: '#bfae5a', margin: '0 8px' }}>✦</span>
        </div>
        <PixelAvatar type={avatar} size="large" className="mx-auto my-6" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '8px 0 24px 0' }}>
          <span style={{ fontSize: '2rem', color: '#bfae5a', margin: '0 8px' }}>✦</span>
          <span style={{ fontSize: '1.2rem', color: '#bfae5a', margin: '0 8px' }}>✧</span>
          <span style={{ fontSize: '2rem', color: '#bfae5a', margin: '0 8px' }}>✦</span>
        </div>
        <PixelButton
          className="w-full max-w-xs mx-auto mt-8"
          style={{
            background: '#ffe082',
            color: '#5c4435',
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '1rem',
            boxShadow: '4px 4px #bfae5a',
            border: '2px solid #bfae5a',
            letterSpacing: '2px',
          }}
        >
          SAVE PROGRESS
        </PixelButton>
      </div>
    </>
  );
};

export default Success; 