import { useState } from "react";
import Head from "next/head";
import Welcome from "./Welcome";
import AvatarSelection from "./AvatarSelection";
import PomodoroTimer from "./PomodoroTimer";
import Success from "./Success";
import Failure from "./Failure";

export default function Home() {
  const [page, setPage] = useState("welcome");
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  // Simule o login da wallet
  const handleConnectWallet = () => setPage("avatar");

  // Quando o avatar for confirmado
  const handleConfirmAvatar = (avatar) => {
    setSelectedAvatar(avatar);
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
  if (page === "timer") {
    return (
      <PomodoroTimer
        avatar={selectedAvatar}
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
