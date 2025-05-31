import React, { useState, useEffect } from 'react';
import PixelButton from './PixelButton';
import PixelAvatar from './PixelAvatar';

const Timer = ({ duration, avatar, onComplete, onCancel, onLoseFocus }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete]);

  // Simulate losing focus randomly for demo
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
        <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs mb-2">200</div>
        <p className="text-sm mb-4">Start growing today!</p>
      </div>
      <div className="mb-6">
        <PixelAvatar type={avatar} size="large" className="mx-auto mb-4" />
        <div className="text-4xl font-bold mb-2" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '3rem', letterSpacing: '2px' }}>{formatTime(timeLeft)}</div>
        <div className="bg-green-500 text-white px-3 py-1 rounded text-xs" style={{ fontFamily: "'Press Start 2P', cursive" }}>Focused</div>
      </div>
      <PixelButton onClick={onCancel} variant="secondary" className="w-full max-w-xs mx-auto mt-8">
        Cancel
      </PixelButton>
    </div>
  );
};

export default Timer;
