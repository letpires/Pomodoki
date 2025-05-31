import React, { useState } from 'react';
import PixelButton from '../src/components/PixelButton';
import Head from 'next/head';

const Setup = ({ onStart }) => {
  const [selectedTime, setSelectedTime] = useState('25/5');
  const [stake, setStake] = useState(1.0);

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
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="popup-container" style={{ backgroundColor: '#ffedae' }}>
        
        <div className="w-full max-w-3xl text-center mx-auto p-6">
          <h1
            style={{
              fontFamily: "'Press Start 2P', cursive",
              color: '#5c4435',
              fontSize: '1.5rem',
              margin: '32px 0 16px 0',
              textAlign: 'center',
              letterSpacing: '2px',
            }}
          >
            Setup your<br />focus session
          </h1>




          <div className="space-y-6 text-left max-w-md mx-auto">
            <div>
              <label className="block text-sm font-bold mb-2">Pomodoro time</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTime('25/5')}
                  className={`px-3 py-1 text-xs border ${selectedTime === '25/5' ? 'bg-green-500 text-white' : 'bg-white'}`}
                >
                  25/5
                </button>
                <button
                  onClick={() => setSelectedTime('50/10')}
                  className={`px-3 py-1 text-xs border ${selectedTime === '50/10' ? 'bg-green-500 text-white' : 'bg-white'}`}
                >
                  50/10
                </button>
                <button
                  onClick={() => setSelectedTime('1/0.5')}
                  className={`px-3 py-1 text-xs border ${selectedTime === '1/0.5' ? 'bg-green-500 text-white' : 'bg-white'}`}
                >
                  Teste 1/0.5
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Stake</label>
              <div className="flex items-center gap-2">
                <span className="text-xs">Stake:</span>
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(Number(e.target.value))}
                  step="0.1"
                  min="0.1"
                  className="flex-1 px-2 py-1 text-xs border"
                />
                <span className="text-xs">Flow</span>
              </div>
              <div className="text-xs mt-1">Balance: 3.74 Flow</div>
            </div>

            <div className="bg-gray-100 p-3 rounded text-xs">
              Stay focused! If you lose focus, your stake is gone.
            </div>

            <PixelButton
              onClick={() => {
                const { pomodoro, breakTime } = getDurations();
                onStart(pomodoro, breakTime, stake);
              }}
              className="w-full"
            >
              🚀 Start pomodoro
            </PixelButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setup;
