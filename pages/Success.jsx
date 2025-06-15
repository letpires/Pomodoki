import React, { useState, useContext } from "react";
import PixelSuccess from "../src/components/PixelSuccess";
import { CurrentUserContext } from "../src/context/currentUserProvider";
import * as fcl from "@onflow/fcl";

const Success = ({ avatar = "bubbiberry", onRestart, onBackToHome }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const { balance } = useContext(CurrentUserContext);

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

      await fcl.tx(transactionId).onceSealed();

      setRedeemed(true);
    } catch (error) {
      console.error("Error redeeming tokens:", error);
      alert("Failed to redeem tokens. Try a new session.");
      setRedeemed(true);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="popup-container"
        style={{ background: "#5aad00", position: "relative" }}
      >
        <h1
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: "#fffbe6",
            fontSize: "2rem",
            margin: "32px 0 16px 0",
            textAlign: "center",
            letterSpacing: "2px",
          }}
        >
          SUCCESS!
        </h1>
        <div
          style={{
            fontFamily: "VT323, monospace",
            color: "#fffbe6",
            fontSize: "1.3rem",
            textAlign: "center",
            marginBottom: "16px",
            background: "transparent",
            padding: "8px 12px",
            borderRadius: "4px",
            display: "inline-block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          You stayed focused! Your FLOW is safe.
        </div>
        <PixelSuccess type={avatar} size="large" className="mx-auto my-6" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            marginTop: "32px",
          }}
        >
          {!redeemed ? (
            <button
              onClick={handleRedeem}
              disabled={isLoading}
              style={{
                backgroundColor: "transparent",
                color: "#fffbe6",
                fontFamily: "'VT323', monospace",
                fontSize: "1.25rem",
                padding: "10px 24px",
                border: "2px solid #5c4435",
                borderRadius: "4px",
                cursor: isLoading ? "not-allowed" : "pointer",
                boxShadow: "4px 4px #5c4435",
                marginTop: "12px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                opacity: isLoading ? 0.8 : 1,
              }}
            >
              {isLoading ? "Loading..." : "Redeem FLOW"}
            </button>
          ) : (
            <div
              style={{
                fontFamily: "'VT323', monospace",
                color: "#fffbe6",
                fontSize: "1.3rem",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              FLOW redeemed! New balance: {balance.toFixed(2)} FLOW
            </div>
          )}
          <button
            onClick={() => {
              localStorage.removeItem("pomodokiState");
              chrome.storage.local.remove("pomodokiStatus");
              if (onRestart) onRestart();
            }}
            style={{
              backgroundColor: "transparent",
              color: "#fffbe6",
              fontFamily: "'VT323', monospace",
              fontSize: "1.25rem",
              padding: "10px 24px",
              border: "2px solid #5c4435",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "4px 4px #5c4435",
              marginTop: "12px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <span style={{ fontSize: "1.3em", marginRight: "8px" }}>↻</span> TRY
            AGAIN
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("pomodokiState");
              chrome.storage.local.remove("pomodokiStatus");
              if (onBackToHome) onBackToHome();
            }}
            style={{
              backgroundColor: "transparent",
              color: "#fffbe6",
              fontFamily: "'VT323', monospace",
              fontSize: "1.25rem",
              padding: "10px 24px",
              border: "2px solid #5c4435",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "4px 4px #5c4435",
              marginTop: "12px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            ⬅ BACK TO HOME
          </button>
        </div>
      </div>
    </>
  );
};

export default Success;
