import React, { useState, useEffect } from 'react';
import PixelButton from './PixelButton';
import PixelPomo from './PixelPomo';

const Timer = ({ duration, avatar, onComplete, onCancel, onLoseFocus }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(true);

  // Recupera o tempo restante com base no timestamp salvo
  useEffect(() => {
    const storedStart = localStorage.getItem("pomodokiStart");
    if (storedStart) {
      const elapsed = Math.floor((Date.now() - parseInt(storedStart, 10)) / 1000);
      const remaining = duration * 60 - elapsed;
      if (remaining <= 0) {
        onComplete();
      } else {
        setTimeLeft(remaining);
      }
    } else {
      // Se não havia timestamp salvo, cria um novo
      localStorage.setItem("pomodokiStart", Date.now().toString());
    }
  }, [duration, onComplete]);

  useEffect(() => {
    const handleLoseFocus = (message) => {
      if (message.action === "loseFocus") {
        onLoseFocus();
      }
    };
  
    chrome.runtime?.onMessage.addListener(handleLoseFocus);
  
    return () => {
      chrome.runtime?.onMessage.removeListener(handleLoseFocus);
    };
  }, []);
  
  // Atualiza o cronômetro a cada segundo
  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(interval);
            onComplete();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete]);

  // Simula perda de foco (opcional)
  useEffect(() => {
    const randomLoseFocus = setTimeout(() => {
      if (Math.random() < 0.1) {
        onLoseFocus();
      }
    }, 5000);

    return () => clearTimeout(randomLoseFocus);
  }, [onLoseFocus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center">
      <div className="mb-4">
        <p
          className="mb-4"
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: "1.25rem",
            color: "#5c4435",
            textAlign: "center"
          }}
        >
          Start growing today!
        </p>
      </div>

      <div className="mb-6">
        <PixelPomo type={avatar} size="large" className="mx-auto mb-4" />
        <div
          className="text-4xl font-bold mb-2"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '3rem',
            letterSpacing: '2px',
            color: '#5c4435',
            textAlign: 'center',
            margin: '0 auto',
            width: 'fit-content',
          }}
        >
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Botão Cancelar centralizado e estilizado */}
      <button
        onClick={() => {
          localStorage.removeItem("pomodokiStart"); // limpa ao cancelar
          onCancel();
        }}
        style={{
          background: 'transparent',
          color: '#5c4435',
          fontFamily: "'VT323', monospace",
          fontSize: '1.1rem',
          border: '2px solid #5c4435',
          borderRadius: '4px',
          cursor: 'pointer',
          boxShadow: 'none',
          textTransform: 'uppercase',
          margin: '24px auto 0 auto',
          display: 'block',
          padding: '6px 24px',
          minWidth: '100px',
        }}
      >
        Cancel
      </button>

    </div>

  );
};

export default Timer;
