import React, { useContext, useState } from "react";
import { CurrentUserContext } from "../context/CurrentUserProvider";
import Profile from "./Profile";

const Navbar = ({ selectedAvatar = "tomash", setPage}) => {
  const { currentUser, network, setNetwork, loadingWallet } = useContext(CurrentUserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "60px",
        backgroundColor: "#655f4d",
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
      <div style={{ position: "relative", zIndex: 2, cursor: "pointer" }} onClick={() => setPage("welcome")}>
        <div style={{ marginRight: "8px", width: "50px", height: "50px", borderRadius: "50%", overflow: "hidden" }}>
          <Profile type={selectedAvatar} />
        </div>
      </div>

      {/* Middle: Wallet Address with Copy Button - Centralizado */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#ffedae"
      }}>
        <div
          style={{
            fontSize: "1.05rem",
            fontWeight: "bold",
            letterSpacing: "1px"
          }}
        >
          {currentUser?.publicAddress && !loadingWallet ? formatAddress(currentUser?.publicAddress) : "Loading..."}
        </div>
        {currentUser?.publicAddress && (
          <button
            onClick={copyToClipboard}
            style={{
              background: "none",
              border: "none",
              padding: "2px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            title="Copy wallet address"
          >
            <img
              src="/icons/copy.svg"
              alt="Copiar"
              style={{
                width: "13px",
                height: "13px",
                display: "block",
                background: "none"
              }}
            />
          </button>
        )}
      </div>

      {/* Right: Network Dropdown Compacto com borda e texto amarelo */}
      <div style={{
        position: "relative",
        zIndex: 2,
        marginLeft: "auto"
      }}>
        <button
          onClick={() => setDropdownOpen((open) => !open)}
          style={{
            border: "1.2px solid #ffedae",
            background: "none",
            color: "#ffedae",
            fontFamily: "'VT323', monospace",
            fontSize: "0.95rem",
            borderRadius: "4px",
            padding: "1px 7px",
            cursor: "pointer",
            minWidth: "0",
            fontWeight: "bold",
            letterSpacing: "1px",
            boxShadow: "none",
            outline: "none",
            display: "inline-flex",
            alignItems: "center"
          }}
        >
          {network === "mainnet" ? "Mainnet" : "Testnet"} <span style={{ marginLeft: 3 }}>{dropdownOpen ? null : "▼"}</span>
        </button>
        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "110%",
              background: "#655f4d",
              border: "1.2px solid #ffedae",
              borderRadius: "4px",
              zIndex: 10,
              minWidth: "0",
              padding: 0
            }}
          >
            <button
              onClick={() => {
                setNetwork(network === "mainnet" ? "testnet" : "mainnet");
                setDropdownOpen(false);
              }}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                color: "#ffedae",
                fontFamily: "'VT323', monospace",
                fontSize: "0.95rem",
                padding: "4px 10px",
                cursor: "pointer",
                textAlign: "center"
              }}
            >
              {network === "mainnet" ? "Testnet" : "Mainnet"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
