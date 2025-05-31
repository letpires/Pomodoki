import { useState, useEffect } from "react";
import Head from "next/head";
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

  // 🔄 Carrega o estado salvo ao abrir
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

  // 💾 Salva o estado sempre que mudar
  useEffect(() => {
    const state = {
      page,
      selectedAvatar,
      pomodoro,
      breakTime,
      stake,
    };
    localStorage.setItem("pomodokiState", JSON.stringify(state));
  }, [page, selectedAvatar, pomodoro, breakTime, stake]);

  // 👛 Após conectar a carteira
  const handleConnectWallet = () => setPage("avatar");

  // ✅ Após escolher o avatar
  const handleConfirmAvatar = (avatar) => {
    setSelectedAvatar(avatar);
    setPage("setup");
  };

  // ✅ Após configurar stake e tempo
  const handleSetup = (pomodoro, breakTime, stake) => {
    setPomodoro(pomodoro);
    setBreakTime(breakTime);
    setStake(stake);
    setPage("timer");
  };

  // 🟢 Após completar o pomodoro
  const handleTimerComplete = () => setPage("success");

  // 🔴 Se falhar (ex: perder foco)
  const handleTimerFail = () => setPage("failure");

  // 📦 Render das páginas
  if (page === "welcome") {
    return <Welcome onConnectWallet={handleConnectWallet} />;
  }
  if (page === "avatar") {
    return <AvatarSelection onConfirm={handleConfirmAvatar} />;
  }
  if (page === "setup") {
    return <Setup onStart={handleSetup} />;
  }
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
  if (page === "success") {
    return <Success avatar={selectedAvatar} />;
  }
  if (page === "failure") {
    return <Failure avatar={selectedAvatar} />;
  }

  return null;
}
