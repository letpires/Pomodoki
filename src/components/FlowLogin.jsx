import React, { useState, useContext } from "react";  
import { CurrentUserContext } from "../context/currentUserProvider";

export default function FlowLogin() { 
  const { isLoggedIn, handleLogin, handleLogout } = useContext(CurrentUserContext);
  const [isLoading, setIsLoading] = useState(false); 
 

  return (
    <div className="flow-login text-center">
      {!isLoggedIn ? (
        <div>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              backgroundColor: "#c5361b",
              color: "#ffedae", 
              fontFamily: "'VT323', monospace",
              fontSize: "1.25rem",
              padding: "10px 24px",
              border: "2px solid #5c4435",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              boxShadow: "4px 4px #5c4435",
              width: "100%",
              opacity: isLoading ? 0.8 : 1,
            }}
          >
            {isLoading ? "Loading..." : "Connect Wallet"}
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
            Connected as: {user.email}
          </p>
          <button
            onClick={handleLogout}
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
