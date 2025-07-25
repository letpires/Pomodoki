import { useState, useEffect, useContext } from "react";
import Welcome from "./Welcome";
import AvatarSelection from "./AvatarSelection";
import Setup from "./Setup";
import PomodoroTimer from "./PomodoroTimer";
import Success from "./Success";
import Failure from "./Failure";
import { CurrentUserContext } from "../context/CurrentUserProvider";
import AllSet from "./Allset";
import Stats from "./Stats";
import Battles from "./Battles";

export default function Home() {
  const [page, setPage] = useState("welcome");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [pomodoro, setPomodoro] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [stake, setStake] = useState(1);
  const [publicAddress, setPublicAddress] = useState(null);
  const { currentUser, handleLogin } = useContext(CurrentUserContext);

  // Carrega o estado salvo (persistência)
  useEffect(() => {
    const saved = localStorage.getItem("pomodokiState");
    if (saved) {
      const state = JSON.parse(saved);
      if (state.page === "allset") {
        setPage("avatar");
      } else if (state.page) {
        setPage(state.page);
      }
      if (state.selectedAvatar) setSelectedAvatar(state.selectedAvatar);
      if (state.pomodoro) setPomodoro(state.pomodoro);
      if (state.breakTime) setBreakTime(state.breakTime);
      if (state.stake) setStake(state.stake);
      if (state.publicAddress) setPublicAddress(state.publicAddress);

      if (
        page === "welcome" &&
        !state.publicAddress &&
        window.innerWidth <= 400
      ) {
        const extensionUrl = `chrome-extension://${chrome.runtime?.id}/index.html`;
        window.open(extensionUrl);
      }
    } else {
      if (window.innerWidth <= 400) {
        const extensionUrl = `chrome-extension://${chrome.runtime?.id}/index.html`;
        window.open(extensionUrl);
      }
    }
  }, []);

  // Salva o estado sempre que mudar
  useEffect(() => {
    const state = {
      page,
      selectedAvatar,
      pomodoro,
      breakTime,
      stake,
      publicAddress:
        currentUser === false
          ? publicAddress
          : currentUser?.publicAddress || null,
    };
    localStorage.setItem("pomodokiState", JSON.stringify(state));
  }, [
    page,
    selectedAvatar,
    pomodoro,
    breakTime,
    stake,
    currentUser,
    publicAddress,
  ]);

  useEffect(() => {
    const checkFailure = () => {
      chrome.storage?.local.get("pomodokiStatus", (result) => {
        if (result.pomodokiStatus === "failure") {
          console.error("checkFailure");
          chrome.storage.local.remove("pomodokiStatus");
          setPage("failure");
        }
      });
    };

    const interval = setInterval(checkFailure, 500); // checa a cada 1s
    return () => clearInterval(interval); // limpa ao desmontar
  }, []);

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
      duration: pomodoro,
      avatar: selectedAvatar,
    });

    setPage("timer");
  };
 
  const handleConnectWallet = async () => {
    const data = await handleLogin();
    if (data) {
      setPage("allset");
    }
  };
  const handleTimerComplete = () => {
    chrome.runtime?.sendMessage({
      action: "stopTimer",
    });
    setPage("success");
  };
  
  const handleTimerFail = () => {
    chrome.runtime?.sendMessage({
      action: "stopTimer",
    });
    setPage("failure");
  };
  const handleBackToHome = () => setPage("welcome");

  if (page === "welcome")
    return <Welcome onConnectWallet={handleConnectWallet} setPage={setPage} />;

  if (page === "allset") return <AllSet />;

  if (page === "avatar")
    return <AvatarSelection onConfirm={handleConfirmAvatar} />;
  if (page === "setup")
    return <Setup onStart={handleSetup} selectedAvatar={selectedAvatar} onHandlePage={setPage} />;
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
  if (page === "success")
    return (
      <Success
        avatar={selectedAvatar}
        onRestart={() => setPage("setup")}
        onBackToHome={handleBackToHome}
      />
    );
  if (page === "failure")
    return (
      <Failure
        avatar={selectedAvatar}
        onBackToHome={handleBackToHome}
        onTryAgain={() => setPage("setup")}
      />
    );
  if (page === "stats") return <Stats selectedAvatar={selectedAvatar} onHandlePage={setPage} />;
  if (page === "battles") return <Battles selectedAvatar={selectedAvatar} onHandlePage={setPage} />;

  return null;
}
