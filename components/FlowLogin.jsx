import React, { useContext } from "react";
import { CurrentUserContext } from "../context/CurrentUserProvider";

export default function FlowLogin({ handleConnectWallet }) {
  const { isLoggedIn, handleLogin, handleLogout, currentUser } =
    useContext(CurrentUserContext);

  const handleLogoutFlow = async () => {
    await handleLogout();
    const extensionUrl = `chrome-extension://${chrome.runtime?.id}/index.html`;
    window.open(extensionUrl);
  };

  return (
    <div className="flow-login text-center w-full">
      {!isLoggedIn ? (
        <div>
          <button
            onClick={handleConnectWallet}
            style={{
              backgroundColor: "#c5361b",
              color: "#ffedae",
              fontFamily: "'VT323', monospace",
              fontSize: "1rem",
              padding: "8px 16px",
              border: "2px solid #5c4435",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "4px 4px #5c4435",
              opacity: 1,
              marginTop: "24px",
            }}
          >
            {"Connect Wallet"}
          </button>
        </div>
      ) : (
        <div
          style={{
            color: "#5c4435",
            fontSize: "0.9rem",
            fontFamily: "'VT323', monospace",
          }}
        >
          <p style={{ textAlign: "center", fontSize: "1.15rem" }}>
            Connected as: {currentUser.publicAddress}
          </p>
          <button
            onClick={handleLogoutFlow}
            style={{
              marginTop: "20px",
              backgroundColor: "#fed35c",
              color: "#5c4435",
              fontFamily: "'VT323', monospace",
              fontSize: "1.25rem",
              padding: "10px 24px",
              border: "2px solid #5c4435",
              cursor: "pointer",
              borderRadius: "4px",
              boxShadow: "4px 4px #5c4435",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
