import { useState, useEffect } from "react";
import Welcome from "./Welcome";
import AvatarSelection from "./AvatarSelection";
import Setup from "./Setup";
import PomodoroTimer from "./PomodoroTimer";
import Success from "./Success";
import Failure from "./Failure";

export default function Home() {
  const [page, setPage] = useState("welcome");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [pomodoro, setPomodoro] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [stake, setStake] = useState(1);

  // Carrega o estado salvo (persistência)
  useEffect(() => {
    const saved = localStorage.getItem("pomodokiState");
    if (saved) {
      const state = JSON.parse(saved);
      if (state.page) setPage(state.page);
      if (state.selectedAvatar) setSelectedAvatar(state.selectedAvatar);
      if (state.pomodoro) setPomodoro(state.pomodoro);
      if (state.breakTime) setBreakTime(state.breakTime);
      if (state.stake) setStake(state.stake);
    }
  }, []);

  // Salva o estado sempre que mudar
  useEffect(() => {
    const state = { page, selectedAvatar, pomodoro, breakTime, stake };
    localStorage.setItem("pomodokiState", JSON.stringify(state));
  }, [page, selectedAvatar, pomodoro, breakTime, stake]);

  useEffect(() => {
    const checkFailure = () => {
      chrome.storage?.local.get("pomodokiStatus", (result) => {
        if (result.pomodokiStatus === "failure") {
          chrome.storage.local.remove("pomodokiStatus");
          setPage("failure");
        }
      });
    };
  
    const interval = setInterval(checkFailure, 1000); // checa a cada 1s
    return () => clearInterval(interval); // limpa ao desmontar
  }, []);

  // Funções de navegação do fluxo
  const handleConnectWallet = () => setPage("avatar");

  const handleConfirmAvatar = (avatar) => {
    setSelectedAvatar(avatar);
    setPage("setup");
  };

  const handleSetup = (pomodoro, breakTime, stake) => {
    setPomodoro(pomodoro);
    setBreakTime(breakTime);
    setStake(stake);

    chrome.runtime?.sendMessage({
      action: "startTimer",
      duration: pomodoro * 60,
    });

    setPage("timer");
  };

  const handleTimerComplete = () => setPage("success");
  const handleTimerFail = () => setPage("failure");

  // Renderiza a página correta
  if (page === "welcome") return <Welcome onConnectWallet={handleConnectWallet} />;
  if (page === "avatar") return <AvatarSelection onConfirm={handleConfirmAvatar} />;
  if (page === "setup") return <Setup onStart={handleSetup} />;
  if (page === "timer") {
    return (
      <PomodoroTimer
        avatar={selectedAvatar}
        pomodoro={pomodoro}
        breakTime={breakTime}
        stake={stake}
        onComplete={handleTimerComplete}
        onFail={handleTimerFail}
      />
    );
  }
  if (page === "success") return <Success avatar={selectedAvatar} />;
  if (page === "failure") return <Failure avatar={selectedAvatar} />;

  return null;
}
