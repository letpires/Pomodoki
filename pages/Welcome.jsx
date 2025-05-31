import React from "react";
import Head from "next/head";
import FlowLogin from "../components/FlowLogin";

const Welcome = ({ onConnectWallet }) => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        className="popup-container min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#ffedae" }}
      >
        <div className="text-center w-full max-w-md p-4">
          <h1
            className="mb-6"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              color: "#5c4435",
              fontSize: "1.2rem",
              textAlign: 'center',
              lineHeight: "1.8rem",
            }}
          >
            Welcome to<br />
            <span>Pomodoki</span>
          </h1>

          <img
            src="/images/avatar.png"
            alt="Pomodoki Avatar"
            style={{ display: "block", margin: "0 auto", width: "180px" }}
          />

          {/* Botão FlowLogin centralizado */}
          <div className="mt-6 flex justify-center">
            <FlowLogin onConnect={onConnectWallet} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
