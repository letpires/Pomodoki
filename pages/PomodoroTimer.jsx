import React, { useState, useEffect } from "react";
import Timer from "../components/Timer";

const PomodoroTimer = ({
  avatar,
  pomodoro, 
  onComplete,
  onFail,
}) => {
  const [isBreak, setIsBreak] = useState(false);

  const handleComplete = () => {
    chrome.runtime?.sendMessage({ action: "stopTimer" });

    if (!isBreak) {
      setIsBreak(true); // Vai para o break
    } else {
      if (onComplete) onComplete(); // Finaliza ciclo completo
    }
  };

  const handleCancel = () => {
    chrome.runtime?.sendMessage({ action: "stopTimer" });
    if (onFail) onFail();
  };

  const handleLoseFocus = () => {
    chrome.runtime?.sendMessage({ action: "stopTimer" });
    if (onFail) onFail();
  };

  // Escutar mensagens do background (ex: tentativa de abrir sites bloqueados)
  useEffect(() => {
    const listener = (message) => {
      if (message.action === "triggerFailure") {
        console.warn("⚠️ Site bloqueado acessado:", message.reason);
        handleLoseFocus(); // Gatilho para falha
      }
    };

    chrome.runtime?.onMessage?.addListener(listener);

    return () => {
      chrome.runtime?.onMessage?.removeListener(listener);
    };
  }, []);

  return (
    <>
      <div className="popup-container">
        <Timer
          duration={pomodoro}
          avatar={avatar}
          onComplete={handleComplete}
          onCancel={handleCancel}
          onLoseFocus={handleLoseFocus}
        />
        <div
          style={{
            textAlign: "center",
            marginTop: 12,
            fontFamily: "'Press Start 2P', cursive",
            color: "#5c4435",
          }}
        >
          {"Focus!"}
        </div>
      </div>
    </>
  );
};

export default PomodoroTimer;
