import React, { useState } from 'react';

const Setup = ({ onStart }) => {
  const [selectedTime, setSelectedTime] = useState('25/5');
  const [stake, setStake] = useState(1.0);

  const getDuration = () => {
    switch (selectedTime) {
      case '25/5': return 25;
      case '50/10': return 50;
      default: return 25;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="pixel-card max-w-md">
        <h1 className="text-lg mb-6 text-center">Setup your<br />focus session</h1>
        
        <div className="space-y-6">
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
        </div>
      </div>
    </div>
  );
};

export default Setup;
