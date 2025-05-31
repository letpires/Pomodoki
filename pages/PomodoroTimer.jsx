import React, { useState } from 'react';
import Head from 'next/head';
import Timer from '../src/components/Timer';

const PomodoroTimer = () => {
  // Exemplo: avatar selecionado hardcoded, pode ser "tomash", "bubbiberry" ou "batatack"
  const [avatar] = useState('tomash');

  // Funções de callback para o Timer
  const handleComplete = () => {
    alert('Pomodoro completo!');
  };
  const handleCancel = () => {
    alert('Pomodoro cancelado!');
  };
  const handleLoseFocus = () => {
    alert('Você perdeu o foco!');
  };

  return (
    <>
      <Head>
        <title>Pomodoki - Timer</title>
        <meta name="viewport" content="width=400, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </Head>
      <div className="popup-container">
        <Timer
          duration={25} // 25 minutos
          avatar={avatar}
          onComplete={handleComplete}
          onCancel={handleCancel}
          onLoseFocus={handleLoseFocus}
        />
      </div>
    </>
  );
};

export default PomodoroTimer; 