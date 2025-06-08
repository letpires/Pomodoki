import React from "react";
import Head from "next/head";
import PixelFailure from "../src/components/PixelFailure";
import PixelButton from "../src/components/PixelButton";

const Failure = ({ avatar = "bubbiberry", onBackToHome, onTryAgain }) => {
  return (
    <>
      <Head>
        <title>Pomodoki - Failure</title>
        <meta name="viewport" content="width=400, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        className="popup-container"
        style={{ background: "#655f4d", position: "relative" }}
      >
        <h1
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: "#ffe082",
            fontSize: "2rem",
            margin: "32px 0 16px 0",
            textAlign: "center",
            letterSpacing: "2px",
          }}
        >
          YOU LOST FOCUS
        </h1>
        <div
          style={{
            fontFamily: "VT323, monospace",
            color: "#ffe082",
            fontSize: "1.3rem",
            textAlign: "center",
            marginBottom: "16px",
            background: "transparent",
            padding: "8px 12px",
            borderRadius: "4px",
            display: "inline-block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Your FLOW went to the pool.
        </div>
        <PixelFailure type={avatar} size="large" className="mx-auto my-6" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginTop: "32px" }}>
          <button
            onClick={() => {
              localStorage.removeItem("pomodokiState");
              chrome.storage.local.remove("pomodokiStatus");
              if (onTryAgain) onTryAgain();
            }}
            style={{
              backgroundColor: "transparent",
              color: "#ffedae",
              fontFamily: "'VT323', monospace",
              fontSize: "1.25rem",
              padding: "10px 24px",
              border: "2px solid #5c4435",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "4px 4px #5c4435",
              marginTop: "12px",
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            <span style={{ fontSize: "1.3em", marginRight: "8px" }}>↻</span> TRY AGAIN
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("pomodokiState");
              chrome.storage.local.remove("pomodokiStatus");
              if (onBackToHome) onBackToHome();
            }}
            style={{
              backgroundColor: "transparent",
              color: "#ffedae",
              fontFamily: "'VT323', monospace",
              fontSize: "1.25rem",
              padding: "10px 24px",
              border: "2px solid #5c4435",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "4px 4px #5c4435",
              marginTop: "12px",
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            ⬅ BACK TO HOME
          </button>
        </div>
      </div>
    </>
  );
};

export default Failure;
