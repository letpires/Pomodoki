import React, { useState, useContext, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { CurrentUserContext } from "../src/context/currentUserProvider";
import Navbar from "../src/components/Navbar";

fcl.config({
  "flow.network": "testnet",
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": `https://fcl-discovery.onflow.org/testnet/authn`,
});

const Setup = ({ onStart, selectedAvatar = "tomash" }) => {
  const [selectedTime, setSelectedTime] = useState("25/5");
  const [stake, setStake] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const { balance, balanceLoading, fetchBalance, currentUser, magic } =
    useContext(CurrentUserContext);
  const AUTHORIZATION_FUNCTION = magic?.flow.authorization;

  const handleStart = async () => {
    try {
      setIsLoading(true);
      const { pomodoro, breakTime } = getDurations();
      const transactionId = await fcl.mutate({
        cadence: `
        import FungibleToken from 0x9a0766d93b6608b7
        import FlowToken from 0x7e60df042a9c0868
        import StakingContract4 from 0xacdf784e6e2a83f0

        transaction(amount: UFix64) {
            let stakingRef: &StakingContract4.Staking

            prepare(signer: auth(Storage, Capabilities, FungibleToken.Withdraw) &Account) {
                // Borrow a reference with Withdraw entitlement from storage
                let flowVaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
                    from: /storage/flowTokenVault
                ) ?? panic("Could not borrow Flow token vault reference")

                let flowVault <- flowVaultRef.withdraw(amount: amount)

                let staking <- StakingContract4.createStaking(vault: <- flowVault)
                
                // Check if storage path exists and remove if it does
                if signer.storage.check<@StakingContract4.Staking>(from: /storage/Staking) {
                    let oldStaking <- signer.storage.load<@StakingContract4.Staking>(from: /storage/Staking)
                    destroy oldStaking
                    signer.capabilities.unpublish(/public/Staking)
                }
                
                signer.storage.save(<- staking, to: /storage/Staking)
                signer.capabilities.publish(
                    signer.capabilities.storage.issue<&StakingContract4.Staking>(/storage/Staking),
                    at: /public/Staking
                )

                self.stakingRef = signer.capabilities.borrow<&StakingContract4.Staking>(/public/Staking)
                    ?? panic("Could not borrow Staking reference")
            }

            execute {
                self.stakingRef.stake(amount: amount)
            }
        }
        `,
        args: (arg, t) => [arg(stake.toFixed(1), t.UFix64)],
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
      onStart(pomodoro, breakTime, stake);
    } catch (error) {
      console.error("Error staking tokens:", error);
      alert("Failed to stake tokens. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getDurations = () => {
    if (selectedTime === "50") {
      return { pomodoro: 50, breakTime: 10 };
    }
    if (selectedTime === "1") {
      return { pomodoro: 0.5, breakTime: 0.5 };
    }
    return { pomodoro: 25, breakTime: 5 };
  };

  const handleBuyFlow = () => {
    if (!currentUser?.publicAddress) {
      alert("Please connect your wallet first");
      return;
    }
    magic.wallet.showOnRamp();
  };

  return (
    <>
      <Navbar selectedAvatar={selectedAvatar} />
      <div className="popup-container" style={{ backgroundColor: "#ffedae" }}>
        <div
          className="w-full"
          style={{
            maxWidth: 320,
            margin: "0 auto",
            padding: "24px 12px",
          }}
        >
          <h1
            style={{
              fontFamily: "'Press Start 2P', cursive",
              color: "#5c4435",
              fontSize: "1.2rem",
              textAlign: "center",
              lineHeight: "1.8rem",
            }}
          >
            Setup your
            <br />
            focus session
          </h1>

          <div
            style={{
              border: "2px solid #5c4435",
              borderRadius: "6px",
              padding: "10px 10px 8px 10px",
              marginBottom: "10px",
              background: "#fffbe6",
              fontFamily: "'VT323', monospace",
              fontSize: "1.3rem",
              color: "#5c4435",
            }}
          >
            <div style={{ marginBottom: 12 }}>Pomodoro time</div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setSelectedTime("25")}
                style={{
                  background: selectedTime === "25" ? "#5aad00" : "transparent",
                  color: selectedTime === "25" ? "#fffbe6" : "#5c4435",
                  border: "2px solid #5c4435",
                  borderRadius: 8,
                  fontFamily: "'VT323', monospace",
                  fontSize: "1.25rem",
                  padding: "4px 24px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: selectedTime === "25" ? "2px 2px #5c4435" : "none",
                  transition: "all 0.2s",
                }}
              >
                25
              </button>
              <button
                onClick={() => setSelectedTime("50")}
                style={{
                  background: selectedTime === "50" ? "#5aad00" : "transparent",
                  color: selectedTime === "50" ? "#fffbe6" : "#5c4435",
                  border: "2px solid #5c4435",
                  borderRadius: 8,
                  fontFamily: "'VT323', monospace",
                  fontSize: "1.25rem",
                  padding: "4px 24px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: selectedTime === "50" ? "2px 2px #5c4435" : "none",
                  transition: "all 0.2s",
                }}
              >
                50
              </button>
              <button
                onClick={() => setSelectedTime("1")}
                style={{
                  background: selectedTime === "1" ? "#5aad00" : "transparent",
                  color: selectedTime === "1" ? "#fffbe6" : "#5c4435",
                  border: "2px solid #5c4435",
                  borderRadius: 8,
                  fontFamily: "'VT323', monospace",
                  fontSize: "1.25rem",
                  padding: "4px 24px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  boxShadow: selectedTime === "1" ? "2px 2px #5c4435" : "none",
                  transition: "all 0.2s",
                }}
              >
                1
              </button>
            </div>
          </div>

          <div
            style={{
              border: "2px solid #5c4435",
              borderRadius: "6px",
              padding: "10px 10px 8px 10px",
              marginBottom: "10px",
              background: "#fffbe6",
              fontFamily: "'VT323', monospace",
              fontSize: "1.3rem",
              color: "#5c4435",
            }}
          >
            <div style={{ marginBottom: 12 }}>Stake</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
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
              Balance:{" "}
              {balanceLoading ? "Loading..." : `${balance.toFixed(2)} Flow`}
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

          <div
            style={{
              border: "2px solid #5c4435",
              borderRadius: "6px",
              padding: "10px 10px 8px 10px",
              marginBottom: "10px",
              background: "#fffbe6",
              fontFamily: "'VT323', monospace",
              fontSize: "1.25rem",
              color: "#5c4435",
              textAlign: "center",
            }}
          >
            Stay focused! If you lose focus, your stake is gone.
          </div>

          <button
            onClick={handleStart}
            disabled={isLoading}
            style={{
              background: isLoading ? "#cccccc" : "#5aad00",
              color: "#fffbe6",
              fontFamily: "'VT323', monospace",
              fontSize: "1.25rem",
              border: "2px solid #5c4435",
              borderRadius: "4px",
              boxShadow: isLoading ? "2px 2px #5c4435" : "4px 4px #5c4435",
              padding: "10px 24px",
              marginTop: "40px",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              opacity: isLoading ? 0.8 : 1,
              transition: "all 0.2s ease",
            }}
          >
            {isLoading ? "Loading..." : "Start pomodoro"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Setup;
