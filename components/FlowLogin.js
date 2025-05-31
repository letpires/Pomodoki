import { useEffect, useState } from "react";
import * as fcl from "@onflow/fcl";

// Configure Flow Client Library
fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "app.detail.title": "Pomodoki App",
  "app.detail.icon": "https://placekitten.com/g/200/200",
});

export default function FlowLogin({ onConnect }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fcl.currentUser().subscribe((user) => {
      setUser(user && user.addr ? user : null);
    });
    setLoading(false);
  }, []);

  const handleLogin = async () => {
    try {
      await fcl.logIn();
      const user = await fcl.currentUser().snapshot();
      setUser(user);
      if (onConnect && user.addr) {
        onConnect(); // <-- aqui acontece a mudança de tela
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
    <div className="flow-login">
      {!user ? (
        <button onClick={handleLogin} className="flow-button">
          Connect Flow Wallet
        </button>
      ) : (
        <div className="user-info">
          <p>Connected as: {user.addr}</p>
          <p>Balance: {user?.balance || '0.0'} FLOW</p>
          <button onClick={handleLogout} className="flow-button">
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
