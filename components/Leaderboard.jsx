import React, { useEffect, useState, useContext } from "react";
import styles from "../styles/Leaderboard.module.css";
import { CurrentUserContext } from "../context/CurrentUserProvider";

export default function Leaderboard({ onClose, onJoinBattle, battle }) {
  // get battle users and their historical focus time
  const { currentUser, getBattleStats } = useContext(CurrentUserContext);

  const [leaderboard, setLeaderboard] = useState([]);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  // Detecta se o usuário já está na batalha
  const isUserInBattle = battle?.users?.includes(currentUser?.publicAddress);

  useEffect(() => {
    const fetchBattleStats = async () => {
      const battleStats = await getBattleStats(battle.id);

      if (!battleStats) return;

      const users = battleStats.users;
      const usersWithHistory = battleStats.usersWithHistory;
      const leaderboard = users.map((user) => {
        const userHistory = usersWithHistory[user];
        const totalTimeCommitted =
          userHistory
            ?.filter((stat) => stat.totalUnstaked > 0)
            .filter((stat) => stat.startDate >= battle.startDate)
            .reduce((acc, stat) => acc + parseInt(stat.timeCommitted), 0) ?? 0;

        return {
          name: user,
          avatar: "/images/tomash_profile.png",
          focus: totalTimeCommitted,
        };
      });

      // it should be sorted by the total focus time
      const sortedLeaderboard = leaderboard
        .filter((user) => user)
        .sort((a, b) => b.focus - a.focus);

      console.log("sortedLeaderboard", sortedLeaderboard);
      setLeaderboard(sortedLeaderboard);
    };
    fetchBattleStats();
  }, [battle, getBattleStats]);

  const handleJoin = async () => {
    setJoining(true);
    await onJoinBattle();
    setJoining(false);
    setJoined(true);
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.closeX}
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute",
          top: 12,
          right: 16,
          background: "none",
          border: "none",
          fontSize: 28,
          color: "#655f4d",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        ×
      </button>
      <h1 className={styles.title}>Leaderboard</h1>
      <div className={styles.subtitle}>🌟 PRIZE: {battle.prize} 🌟</div>
      <div className={styles.list}>
        {leaderboard.map((user, index) => (
          <div className={styles.card} key={user.rank}>
            <span className={styles.rank}>#{index + 1}</span>
            <img
              src={user?.avatar || "/images/tomash_profile.png"}
              alt={user?.avatar || "Tomash"}
              className={styles.avatar}
              style={{ width: 32, height: 32 }}
            />
            <div className={styles.info}>
              <div className={styles.name}>{user.name}</div>
              <div className={styles.focus}>Focus time: {user.focus}</div>
            </div>
          </div>
        ))}
      </div>
      {!isUserInBattle && (
        <button
          className={styles.joinBtn}
          onClick={handleJoin}
          disabled={joining}
        >
          {joining ? "Joining..." : "I want to join"}
        </button>
      )}
    </div>
  );
}
