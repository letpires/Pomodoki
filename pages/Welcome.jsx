import React, { useContext } from "react"; 
import FlowLogin from "../components/FlowLogin";
import { CurrentUserContext } from "../context/currentUserProvider";

const Welcome = ({ onConnectWallet }) => {
  const { isLoggedIn } = useContext(CurrentUserContext);

  return (
    <>
      <div
        className="popup-container min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#ffedae" }}
      >
        <div className="text-center w-full max-w-md p-4">
          <h1
            className="mb-6"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              color: "#4c301b",
              fontSize: "1.2rem",
              textAlign: "center",
              lineHeight: "1.8rem",
            }}
          >
            Welcome to
            <br />
            <span>Pomodoki</span>
          </h1>

          <img
            src="/images/avatar.png"
            alt="Pomodoki Avatar"
            style={{ display: "block", margin: "0 auto", width: "180px" }}
          />

          {/* Botão FlowLogin centralizado */}
          <div className="mt-6 flex justify-center">
            <FlowLogin />
          </div>

          {/* Botão Continue aparece se já está conectado */}
          {isLoggedIn && (
            <button
              onClick={onConnectWallet}
              style={{
                marginTop: "20px",
                backgroundColor: "#fed35c",
                color: "#5c4435",
                fontFamily: "'VT323', monospace",
                fontSize: "1.25rem",
                padding: "10px 24px",
                border: "2px solid #5c4435",
                borderRadius: "4px",
                cursor: "pointer",
                boxShadow: "4px 4px #5c4435",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Welcome;
