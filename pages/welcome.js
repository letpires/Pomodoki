
import React from 'react';
import PixelButton from '../src/components/PixelButton';
import PixelLogo from '../src/components/PixelLogo';

const Welcome = ({ onConnectWallet, onCreateAccount }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="pixel-card max-w-md text-center">
        <h1 className="text-lg mb-6">Welcome to<br />Pomodoki</h1>
        
        <div className="mb-8">
          <PixelLogo type="logo" size="large" className="mx-auto" />
        </div>
        
        <div className="space-y-4">
          <PixelButton onClick={onConnectWallet} className="w-full">
            🔗 Connect Wallet
          </PixelButton>
          <PixelButton onClick={onCreateAccount} variant="secondary" className="w-full">
            + Create Account
          </PixelButton>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
