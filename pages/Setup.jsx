import React, { useState, useEffect } from 'react';
import PixelButton from '../src/components/PixelButton';
import Head from 'next/head';
import * as fcl from '@onflow/fcl';

const Setup = ({ onStart }) => {
  const [selectedTime, setSelectedTime] = useState('25/5');
  const [stake, setStake] = useState(1.0);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize Flow client
    fcl.config({
      'accessNode.api': 'https://rest-testnet.onflow.org',
      'discovery.wallet': 'https://fcl-discovery.onflow.org/testnet/authn',
    });

    // Get user's Flow balance
    const getBalance = async () => {
      try {
        const user = await fcl.currentUser();
        if (user.loggedIn) {
          const balance = await fcl.account(user.addr);
          setBalance(balance.balance / 100000000); // Convert from UFix64 to decimal
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    getBalance();
  }, []);

  const handleStart = async () => {
    try {
      setIsLoading(true);
      const { pomodoro, breakTime } = getDurations();

      // Create and execute the staking transaction
      const transactionId = await fcl.mutate({
        cadence: `
        import FungibleToken from 0x9a0766d93b6608b7
        import FlowToken from 0x7e60df042a9c0868
        import StakingContract3 from 0xacdf784e6e2a83f0

        transaction(amount: UFix64) {
            let stakingRef: &StakingContract3.Staking

            prepare(signer: auth(Storage, Capabilities, FungibleToken.Withdraw) &Account) {
                // Borrow a reference with Withdraw entitlement from storage
                let flowVaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
                    from: /storage/flowTokenVault
                ) ?? panic("Could not borrow Flow token vault reference")

                let flowVault <- flowVaultRef.withdraw(amount: amount)

                let staking <- StakingContract3.createStaking(vault: <- flowVault)
                
                // Check if storage path exists and remove if it does
                if signer.storage.check<@StakingContract3.Staking>(from: /storage/Staking) {
                    let oldStaking <- signer.storage.load<@StakingContract3.Staking>(from: /storage/Staking)
                    destroy oldStaking
                    signer.capabilities.unpublish(/public/Staking)
                }
                
                signer.storage.save(<- staking, to: /storage/Staking)
                signer.capabilities.publish(
                    signer.capabilities.storage.issue<&StakingContract3.Staking>(/storage/Staking),
                    at: /public/Staking
                )

                self.stakingRef = signer.capabilities.borrow<&StakingContract3.Staking>(/public/Staking)
                    ?? panic("Could not borrow Staking reference")
            }

            execute {
                self.stakingRef.stake(amount: amount)
            }
        }
        `,
        args: (arg, t) => [arg(stake.toFixed(1), t.UFix64)],
        limit: 9999,
      });

      // Wait for transaction to be sealed
      await fcl.tx(transactionId).onceSealed();
      
      // Start the pomodoro session
      onStart(pomodoro, breakTime, stake);
    } catch (error) {
      console.error('Error staking tokens:', error);
      alert('Failed to stake tokens. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
              <div className="text-xs mt-1">Balance: {balance.toFixed(2)} Flow</div>
            </div>

            <div className="bg-gray-100 p-3 rounded text-xs">
              Stay focused! If you lose focus, your stake is gone.
            </div>

            <PixelButton
              onClick={handleStart}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : '🚀 Start pomodoro'}
            </PixelButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setup;
