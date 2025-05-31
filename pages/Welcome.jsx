import React from "react";
import FlowLogin from "../components/FlowLogin"; // ajuste o caminho se necessário

const Welcome = ({ onConnectWallet }) => {
  // Supondo que FlowLogin aceite um callback onConnect
  return (
    <div className="popup-container">
      <div className="w-full max-w-3xl text-center">
        <h1 style={{ fontFamily: "'Press Start 2P', cursive', color: '#5c4435'" }}>
          Welcome to<br />
          <span style={{ color: '#5c4435' }}>Pomodoki</span>
        </h1>
        <img
          src="/images/avatar.png"
          alt="Pomodoki Avatar"
          style={{ display: "block", margin: "32px auto", width: "180px" }}
        />
        {/* Aqui está o botão de conectar wallet */}
        <FlowLogin onConnect={onConnectWallet} />
      </div>
    </div>
  );
};

export default Welcome;