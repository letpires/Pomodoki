import React, { useState } from 'react';
import Head from 'next/head';
import Timer from '../src/components/Timer';
import Welcome from "./Welcome";
import AvatarSelection from "./AvatarSelection";
import Success from "./Success";
import Failure from "./Failure";

const PomodoroTimer = ({ avatar, onComplete, onFail }) => {
  // Funções de callback para o Timer
  const handleComplete = () => {
    if (onComplete) onComplete();
  };
  const handleCancel = () => {
    if (onFail) onFail();
  };
  const handleLoseFocus = () => {
    if (onFail) onFail();
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