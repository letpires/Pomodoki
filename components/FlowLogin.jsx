import React from "react";
import { useEffect, useState } from "react";

export default function FlowLogin({ onConnect }) {
  const [magic, setMagic] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { Magic } = require("magic-sdk");
      setMagic(new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY));
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      if (magic) {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          const data = await magic.user.getInfo();

          setUser(data);
          if (onConnect) {
            onConnect(data.publicAddress);
          }
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [magic, onConnect]);

  const handleLogin = async () => {
    try {
      await magic.wallet.connectWithUI();
      const data = await magic.user.getInfo();
      setUser(data);
      if (onConnect) {
        onConnect(data.publicAddress);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await magic.user.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flow-login text-center">
      {!user ? (
        <div>
          <button
            onClick={handleLogin}
            style={{
              backgroundColor: "#c5361b",
              color: "#ffedae",
              fontFamily: "'VT323', monospace",
              fontSize: "1.25rem",
              padding: "10px 24px",
              border: "2px solid #5c4435",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "4px 4px #5c4435",
              marginTop: "32px",
              marginBottom: "16px",
            }}
          >
            Connect Wallet
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
            Connected as: {user.publicAddress}
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
