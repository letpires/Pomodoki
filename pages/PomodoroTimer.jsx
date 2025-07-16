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
    console.error("handleCancel");
    chrome.runtime?.sendMessage({ action: "stopTimer" });
    if (onFail) onFail();
  };

  const handleLoseFocus = () => {
    console.error("handleLoseFocus");

    chrome.runtime?.sendMessage({ action: "stopTimer" });
    if (onFail) onFail();
  }; 

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
