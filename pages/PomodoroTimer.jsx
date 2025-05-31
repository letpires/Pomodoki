import React, { useState } from 'react';
import Head from 'next/head';
import Timer from '../src/components/Timer';
import Welcome from "./Welcome";
import AvatarSelection from "./AvatarSelection";
import Success from "./Success";
import Failure from "./Failure";

const PomodoroTimer = ({ avatar, pomodoro, breakTime, stake, onComplete, onFail }) => {
  const [isBreak, setIsBreak] = useState(false);

  const handleComplete = () => {
    if (!isBreak) {
      setIsBreak(true); // Vai para o break
    } else {
      if (onComplete) onComplete(); // Finaliza ciclo completo
    }
  };

  const handleCancel = () => {
    if (onFail) onFail();
  };

  const handleLoseFocus = () => {
    if (onFail) onFail();
  };

  const getDurations = () => {
    if (selectedTime === '50/10') {
      return { pomodoro: 50, breakTime: 10 };
    }
    if (selectedTime === '1/0.5') {
      return { pomodoro: 1, breakTime: 0.5 };
    }
    return { pomodoro: 25, breakTime: 5 };
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
          duration={isBreak ? breakTime : pomodoro}
          avatar={avatar}
          onComplete={handleComplete}
          onCancel={handleCancel}
          onLoseFocus={handleLoseFocus}
        />
        <div style={{ textAlign: 'center', marginTop: 12, fontFamily: "'Press Start 2P', cursive", color: '#5c4435' }}>
          {isBreak ? 'Break Time!' : 'Focus!'}
        </div>
      </div>
    </>
  );
};

export default PomodoroTimer; 