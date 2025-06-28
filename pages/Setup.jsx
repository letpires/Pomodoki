import React, { useState, useContext } from "react";
import * as fcl from "@onflow/fcl";
import { useRouter } from "next/router";
import { CurrentUserContext } from "../context/currentUserProvider";
import Navbar from "../components/Navbar"; 
import stakeCode from "../constants/stake";
import PixelPomo from '../components/PixelPomo';
import BottomNav from "../components/BottomNav";

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${m.toString().padStart(2, '0')}`;
}

const Setup = ({ onStart, selectedAvatar = "tomash", onHandlePage }) => {
  const [selectedTime, setSelectedTime] = useState(25);
  const [stake, setStake] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const { balance, balanceLoading, fetchBalance, currentUser, magic } =
    useContext(CurrentUserContext);
  const AUTHORIZATION_FUNCTION = magic?.flow.authorization;
  const router = useRouter();

  const handleStart = async () => {
    try {
      setIsLoading(true);
      const { pomodoro, breakTime } = getDurations(); 
      const transactionId = await fcl.mutate({
        cadence: stakeCode,
        args: (arg, t) => [arg(stake.toFixed(3), t.UFix64)],
        proposer: AUTHORIZATION_FUNCTION,
        authorizations: [AUTHORIZATION_FUNCTION],
        payer: AUTHORIZATION_FUNCTION,
        limit: 9999,
      });
      await fcl.tx(transactionId).onceSealed();

      localStorage.removeItem("pomodokiStart");

      // Refresh balance after successful staking
      await fetchBalance();

      // Start the pomodoro session
      onStart(selectedTime, breakTime, stake);
    } catch (error) {
      console.error("Error staking tokens:", error);
      alert("Failed to stake tokens. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getDurations = () => {
    return { pomodoro: selectedTime, breakTime: 5 };
  };

  const handleBuyFlow = () => {
    if (!currentUser?.publicAddress) {
      alert("Please connect your wallet first");
      return;
    }
    magic.wallet.showOnRamp();
  };

  const percent = ((selectedTime - 1) / (180 - 1)) * 100;

  return (
    <>
      <Navbar selectedAvatar={selectedAvatar} />
      <div className="popup-container" style={{ backgroundColor: "#ffedae" }}>
        <div
          className="w-full"
          style={{
            maxWidth: 370,
            margin: "0 auto",
            padding: "8px 12px 0 12px",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ margin: "10px 0 8px 0" }}>
            <PixelPomo type={selectedAvatar} style={{ width: 160, height: 160 }} />
          </div>
          <div
            style={{
              border: "2px solid #5c4435",
              borderRadius: "6px",
              padding: "10px 10px 18px 10px",
              marginBottom: "4px",
              marginTop: "-3px",
              background: "none",
              width: 370,
              maxWidth: "100%",
              fontFamily: "'VT323', monospace",
              fontSize: "1.3rem",
              color: "#5c4435",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span>Duration</span>
              <span>{formatDuration(selectedTime)}</span>
            </div>
            <input
              type="range"
              min={1}
              max={180}
              step={1}
              value={selectedTime}
              onChange={e => setSelectedTime(Number(e.target.value))}
              className="custom-slider"
              style={{
                '--percent': `${percent}%`
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: "1.3rem" }}>Stake:</span>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(Number(e.target.value))}
                min={0.1}
                step={0.1}
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: "1.25rem",
                  border: "2px solid #5c4435",
                  borderRadius: 6,
                  padding: "2px 8px",
                  width: 70,
                  background: "#fff",
                  color: "#5c4435",
                  textAlign: "center",
                }}
              />
              <span style={{ fontSize: "1.25rem" }}>Flow</span>
            </div>
            <div style={{ fontSize: "1.25rem" }}>
              Balance: {balanceLoading ? "Loading..." : `${balance.toFixed(2)} Flow`}
              <button
                onClick={fetchBalance}
                disabled={balanceLoading}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: balanceLoading ? "not-allowed" : "pointer",
                  marginLeft: "8px",
                  fontSize: "1rem",
                  color: balanceLoading ? "#cccccc" : "#5c4435",
                  fontFamily: "'VT323', monospace",
                  opacity: balanceLoading ? 0.5 : 1,
                }}
                title="Refresh balance"
              >
                🔄
              </button>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={isLoading}
            style={{
              background: isLoading ? "#cccccc" : "#5aad00",
              color: "#fffbe6",
              fontFamily: "'VT323', monospace",
              fontSize: "1.5rem",
              border: "2px solid #5c4435",
              borderRadius: "4px",
              boxShadow: isLoading ? "2px 2px #5c4435" : "4px 4px #5c4435",
              padding: "10px 24px",
              marginTop: "0px",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              opacity: isLoading ? 0.8 : 1,
              transition: "all 0.2s ease",
            }}
          >
            Focus
          </button>
        </div>
      </div>
      <BottomNav
        active="timer"
        onNavigate={(route) => {
          if (route === "profile") onHandlePage("stats");
          if (route === "timer") onHandlePage("setup");
          if (route === "battles") onHandlePage("battles");
        }}
      />
    </>
  );
};

export default Setup;
