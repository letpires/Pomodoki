import React from 'react';
import Head from 'next/head';
import PixelButton from '../src/components/PixelButton';

const Failure = ({ avatar = 'bubbiberry' }) => {
  return (
    <>
      <Head>
        <title>Pomodoki - Failure</title>
        <meta name="viewport" content="width=400, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </Head>
      <div className="popup-container" style={{ background: '#655f4d', position: 'relative' }}>
        <h1
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: '#ffe082',
            fontSize: '2rem',
            margin: '32px 0 16px 0',
            textAlign: 'center',
            letterSpacing: '2px',
          }}
        >
          YOU LOST FOCUS
        </h1>
        <div
          style={{
            fontFamily: 'VT323, monospace',
            color: '#ffe082',
            fontSize: '1.3rem',
            textAlign: 'center',
            marginBottom: '16px',
            background: 'transparent',
            padding: '8px 12px',
            borderRadius: '4px',
            display: 'inline-block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Your FLOW went to the pool.
        </div>
        {/* Avatar triste customizado */}
        <img
          src="/images/failure.png"
          alt="Sad Avatar"
          style={{
            width: '180px',
            height: '180px',
            imageRendering: 'pixelated',
            display: 'block',
            margin: '32px auto',
          }}
        />
        <PixelButton
          onClick={() => {
            localStorage.removeItem("pomodokiState"); // Limpa estado salvo
            localStorage.removeItem("pomodokiStatus"); // Remove status de falha
            window.location.reload(); // Recarrega popup
          }}
          className="w-full max-w-xs mx-auto mt-8 flex items-center justify-center gap-2"
          style={{
            background: '#6d5747',
            color: '#ffe082',
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '1rem',
            boxShadow: '4px 4px #4d3e2a',
            border: '2px solid #4d3e2a',
            letterSpacing: '2px',
          }}
        >
          <span style={{ fontSize: '1.3em', marginRight: '8px' }}>↻</span> TRY AGAIN
        </PixelButton>
      </div>
    </>
  );
};

export default Failure; 