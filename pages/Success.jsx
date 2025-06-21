import React, { useState, useContext } from "react";
import PixelSuccess from "../components/PixelSuccess";
import { CurrentUserContext } from "../context/currentUserProvider";
import * as fcl from "@onflow/fcl";

const Success = ({ avatar = "bubbiberry", onRestart, onBackToHome }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const { fetchBalance, magic } = useContext(CurrentUserContext);
  const AUTHORIZATION_FUNCTION = magic?.flow.authorization;

  const handleRedeem = async () => {
    try {
      setIsLoading(true);

      const transactionId = await fcl.mutate({
        cadence: `
        import FungibleToken from 0xFungibleToken
        import FlowToken from 0xFlowToken
        import StakingContract4 from 0xStakingContract

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
        proposer: AUTHORIZATION_FUNCTION,
        authorizations: [AUTHORIZATION_FUNCTION],
        payer: AUTHORIZATION_FUNCTION,
        limit: 9999,
      });

      await fcl.tx(transactionId).onceSealed();

      setRedeemed(true);
      // Refresh balance after successful redemption
      await fetchBalance();
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
          disabled={isLoading || redeemed}
          style={{
            backgroundColor: isLoading ? "#ffe082" : "#fed35c",
            color: "#5c4435",
            fontFamily: "'VT323', monospace",
            fontSize: "1.25rem",
            padding: "10px 24px",
            border: "2px solid #5c4435",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            boxShadow: "4px 4px #5c4435",
            textTransform: "uppercase",
            marginTop: "40px",
            opacity: isLoading ? 0.7 : 1,
            transition: "background 0.2s, opacity 0.2s",
            display: redeemed ? "none" : "block",
          }}
        >
          {isLoading ? "Loading..." : "Redeem"}
        </button>

        {redeemed && (
          <>
            <div
              style={{
                fontFamily: "'VT323', monospace",
                color: "#5c4435",
                fontSize: "1rem",
                textAlign: "center",
                marginTop: "12px",
                marginBottom: "12px",
                marginLeft: "24px",
                marginRight: "24px",
                fontStyle: "italic",
                lineHeight: "1.4",
                padding: "0 8px",
              }}
            >
              Redeem successful!
              <br />
              Your FLOW is back in your wallet.
            </div>
            <button
              onClick={onRestart}
              style={{
                backgroundColor: "#5aad00",
                color: "#ffedae",
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
              Start new session
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Success;
