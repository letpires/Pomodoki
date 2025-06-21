import React, { useContext } from "react";
import { CurrentUserContext } from "../context/currentUserProvider";
import PixelAvatar from "./PixelAvatar";

const Navbar = ({ selectedAvatar = "tomash" }) => {
  const { currentUser, network, setNetwork, loadingWallet } = useContext(CurrentUserContext);

  const formatAddress = (address) => { 
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async () => {
    if (currentUser?.publicAddress) {
      try {
        await navigator.clipboard.writeText(currentUser.publicAddress);
        // You could add a toast notification here if desired
        console.log("Address copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy address: ", err);
      }
    }
  };

  const toggleNetwork = () => {
    const newNetwork = network === "testnet" ? "mainnet" : "testnet";
    setNetwork(newNetwork);
    console.log(`Switched to ${newNetwork}`);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px",
        backgroundColor: "#fffbe6",
        borderBottom: "2px solid #5c4435",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        zIndex: 1000,
        fontFamily: "'VT323', monospace",
        fontSize: "1rem",
        color: "#5c4435",
      }}
    >
      {/* Left: Avatar */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "8px", width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden" }}>
          <PixelAvatar type={selectedAvatar} />
        </div>
      </div>

      {/* Middle: Wallet Address with Copy Button */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          {currentUser?.publicAddress && !loadingWallet ? formatAddress(currentUser?.publicAddress) : "Loading..."}
        </div>
        {currentUser?.publicAddress && (
          <button
            onClick={copyToClipboard}
            style={{
              background: "none",
              border: "2px solid #5c4435",
              borderRadius: "4px",
              padding: "4px 8px",
              cursor: "pointer",
              fontFamily: "'VT323', monospace",
              fontSize: "0.8rem",
              color: "#5c4435",
              backgroundColor: "#fffbe6",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#fed35c";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#fffbe6";
            }}
            title="Copy wallet address"
          >
            COPY
          </button>
        )}
      </div>

      {/* Right: Network Toggle */}
      <button
        onClick={toggleNetwork}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "4px 8px",
          backgroundColor: network === "testnet" ? "#fed35c" : "#5aad00",
          border: "2px solid #5c4435",
          borderRadius: "4px",
          fontSize: "0.9rem",
          fontWeight: "bold",
          textTransform: "uppercase",
          cursor: "pointer",
          fontFamily: "'VT323', monospace",
          color: "#5c4435",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
        }}
        title={`Click to switch to ${network === "testnet" ? "mainnet" : "testnet"}`}
      >
        {network}
      </button>
    </div>
  );
};

export default Navbar;
