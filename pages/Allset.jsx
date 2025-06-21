import React from 'react';

export default function AllSet({ onContinue }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#ffedae',
      fontFamily: "'VT323', monospace",
      textAlign: 'center',
      color: '#5c4435',
    }}>
      {/* Imagem do Tamagotchi */}
      <img
        src="/images/allset.png"
        alt="You're all set"
        style={{
          width: 250,
          height: 'auto',
          marginBottom: 32,
        }}
      />

      {/* Texto principal */}
      <h1 style={{ fontSize: '2.5rem', marginBottom: 8 }}>
        You're <span style={{ color: '#c5361b' }}>all</span> set
      </h1>
      <p style={{ fontSize: '1.25rem', marginBottom: 32 }}>
        You can start using Pomodoki now!
      </p>

      {/* Box de instruções */}
      <div style={{
        border: '2px solid #5c4435',
        borderRadius: 24,
        padding: '16px 24px',
        maxWidth: 350,
        background: 'rgba(255,255,255,0.2)',
      }}>
        <p style={{ fontSize: '1.1rem', marginBottom: 8, fontWeight: 'bold' }}>
          Put your pet within reach!
        </p>
        <p style={{ fontSize: '1.1rem' }}>
          Click Extension 🧩 and Pin 📌 Pomodoki
        </p>
      </div>

      {/* Botão para continuar (opcional) */}
      <button
        onClick={onContinue}
        style={{
          marginTop: 48,
          background: '#5aad00',
          color: '#fffbe6',
          fontSize: '1.5rem',
          border: '2px solid #5c4435',
          borderRadius: '4px',
          padding: '10px 24px',
          cursor: 'pointer',
          boxShadow: '4px 4px #5c4435',
        }}
      >
        Let's Go!
      </button>
    </div>
  );
}
