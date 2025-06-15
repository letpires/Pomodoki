import { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";

// Configuração do Flow
fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "app.detail.title": "Pomodoki App",
  "app.detail.icon": "https://placekitten.com/g/200/200",
});

export default function FlowLogin({ onConnect }) {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fcl.currentUser().subscribe(async (user) => {
      setUser(user && user.addr ? user : null); 

      // if (onConnect && user.addr) {
      //   onConnect();
      // }
      if (user.loggedIn) {
        const balance = await fcl.account(user.addr); 
        setBalance(balance.balance / 100000000); // Convert from UFix64 to decimal
      }
    });
    setLoading(false);
  }, []);

  const handleLogin = async () => {
    try {
      await fcl.logIn();

      const user = await fcl.currentUser().snapshot();
      if (user.loggedIn) {
        const balance = await fcl.account(user.addr); 
        setBalance(balance.balance / 100000000); // Convert from UFix64 to decimal
      }

      setUser(user);
      if (onConnect && user.addr) {
        onConnect();
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fcl.unauthenticate();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flow-login text-center">
      <link
        href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
        rel="stylesheet"
      />
      {!user ? (
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
            marginTop: "32px", // <-- empurra o botão para baixo
          }}
        >
          Connect Flow Wallet
        </button>
      ) : (
        <div
          style={{
            color: "#5c4435",
            fontSize: "0.9rem",
            fontFamily: "'VT323', monospace",
          }}
        >
          <p style={{ textAlign: 'center', fontSize: '1.15rem' }}>Connected as: {user.addr}</p>
          <p style={{ textAlign: 'center', fontSize: '1.15rem' }}>Balance: {balance || "0.0"} FLOW</p>
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

