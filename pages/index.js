import { useState } from "react";
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

  // Simule o login da wallet
  // const handleConnectWallet = () => setPage("avatar");
  const handleConnectWallet = () => setPage("avatar");
  

  // Quando o avatar for confirmado
  const handleConfirmAvatar = (avatar) => {
    setSelectedAvatar(avatar);
    setPage("setup");
  };

  const handleSetup = (pomodoro, breakTime, stake) => {
    setPomodoro(pomodoro);
    setBreakTime(breakTime);
    setStake(stake);
    setPage("timer");
  };

  // Timer completo
  const handleTimerComplete = () => setPage("success");
  // Timer falhou
  const handleTimerFail = () => setPage("failure");

  if (page === "welcome") {
    return (
      <Welcome onConnectWallet={handleConnectWallet} />
    );
  }
  if (page === "avatar") {
    return (
      <AvatarSelection onConfirm={handleConfirmAvatar} />
    );
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
