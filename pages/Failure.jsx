import React from "react";
import PixelFailure from "../components/PixelFailure";

const Failure = ({ avatar = "bubbiberry", onTryAgain }) => {
  return (
    <>
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            marginTop: "32px",
          }}
        >
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
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <span style={{ fontSize: "1.3em", marginRight: "8px" }}>↻</span> TRY
            AGAIN
          </button>
        </div>
      </div>
    </>
  );
};

export default Failure;
