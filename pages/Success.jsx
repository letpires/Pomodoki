import React, { useState } from "react";
import Head from "next/head";
import PixelSuccess from "../src/components/PixelSuccess";
import PixelButton from "../src/components/PixelButton";
import { useEffect } from "react";
import * as fcl from "@onflow/fcl";

const Success = ({ avatar = "bubbiberry" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fcl.currentUser().subscribe(async (user) => {
      if (user.loggedIn) {
        const balance = await fcl.account(user.addr);
        setBalance(balance.balance / 100000000); // Convert from UFix64 to decimal
      }
    });
  }, []);

  const handleRedeem = async () => {
    try {
      setIsLoading(true);

      const transactionId = await fcl.mutate({
        cadence: `
          import FungibleToken from 0x9a0766d93b6608b7
          import FlowToken from 0x7e60df042a9c0868
          import StakingContract4 from 0xacdf784e6e2a83f0

          transaction {
              prepare(signer: auth(Storage, Capabilities) &Account) {
                  // Get the staking resource
                  let staking <- signer.storage.load<@StakingContract4.Staking>(from: /storage/Staking)
                      ?? panic("No staking resource found")

                  // Get the vault from staking
                  let vault <- staking.cleanup()
                  
                  // Get the receiver capability
                  let receiver = signer.capabilities.borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
                      ?? panic("Could not borrow Flow token receiver")

                  // Deposit the tokens back to the user's vault
                  receiver.deposit(from: <- vault)

                  // Clean up the staking resource
                  destroy staking
                  signer.capabilities.unpublish(/public/Staking)
              }
          }
        `,
        limit: 9999,
      });

      // Wait for transaction to be sealed
      await fcl.tx(transactionId).onceSealed();

      // Refresh the page or show success message
      window.location.reload();
    } catch (error) {
      console.error("Error redeeming tokens:", error);
      alert("Failed to redeem tokens. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Pomodoki - Success</title>
        <meta name="viewport" content="width=400, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="popup-container" style={{ position: "relative" }}>
        <h1
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: "#5c4435",
            fontSize: "2rem",
            margin: "32px 0 16px 0",
            textAlign: "center",
            letterSpacing: "2px",
          }}
        >
          WELL DONE!
        </h1>
        <div
          style={{
            fontFamily: "VT323, monospace",
            color: "#5c4435",
            fontSize: "1.3rem",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          Your Pomodoki levelep up! 
        </div> 
        <PixelSuccess type={avatar} size="large" className="mx-auto my-6" />

                {/* Botão Confirmar */}
        
        <button
          onClick={handleRedeem}
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#ffe082' : '#fed35c',
            color: '#5c4435',
            fontFamily: "'VT323', monospace",
            fontSize: "1.25rem",
            padding: "10px 24px",
            border: "2px solid #5c4435",
            borderRadius: "4px",
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: "4px 4px #5c4435",
            textTransform: "uppercase",
            marginTop: "40px",
            opacity: isLoading ? 0.7 : 1,
            transition: 'background 0.2s, opacity 0.2s',
          }}
        >
          {isLoading ? 'Loading...' : 'Redeem'}
        </button>
      </div>
    </>
  );
};

export default Success;
