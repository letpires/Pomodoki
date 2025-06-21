import React from "react";

export default function AllSet({ onContinue }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        background: "#ffedae",
        fontFamily: "'VT323', monospace",
        textAlign: "center",
        color: "#5c4435",
        gap: 0, 
      }}
    >
      {/* Imagem do Tamagotchi */}
      <img
        src="/images/allset.png"
        alt="You're all set"
        style={{
          width: 300,
          height: "auto",
        }}
      />

      {/* Texto principal */}
      <h1 style={{ fontSize: "2.5rem", marginBottom: 0, marginTop: 0 }}>
        You&apos;re <span style={{ color: "#c5361b" }}>all</span> set
      </h1>
      <p style={{ fontSize: "1.25rem", marginBottom: 26, marginTop: 2 }}>
        You can start using Pomodoki now!
      </p>

      {/* Box de instruções */}
      <div
        style={{
          border: "2px solid #5c4435",
          borderRadius: 24,
          padding: "2px 10px",
          maxWidth: 350,
          background: "rgba(255,255,255,0.2)",
        }}
      >
        <p style={{ fontSize: "1.1rem", marginBottom: 8, fontWeight: "bold" }}>
          Put your pet within reach!
        </p>
        <p style={{ fontSize: "1.1rem" }}>
          Click Extension 🧩 and Pin 📌 Pomodoki
        </p>
      </div>
    </div>
  );
}
