import React, { useState, useContext } from "react";
import PixelSuccess from "../components/PixelSuccess";
import { CurrentUserContext } from "../context/currentUserProvider";
import * as fcl from "@onflow/fcl"; 
import redeemCode from "../constants/redeem";

const Success = ({ avatar = "bubbiberry", onRestart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const { fetchBalance, magic } = useContext(CurrentUserContext);
  const AUTHORIZATION_FUNCTION = magic?.flow.authorization;

  const handleRedeem = async () => {
    try {
      setIsLoading(true); 
      const transactionId = await fcl.mutate({
        cadence: redeemCode,
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
