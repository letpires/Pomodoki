import React from "react";
import styles from "../styles/Leaderboard.module.css";

export default function Leaderboard({ leaderboard, onClose, onJoinBattle }) {
  return (
    <div className={styles.container}>
      <button
        className={styles.closeX}
        onClick={onClose}
        aria-label="Close"
        style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 28, color: '#655f4d', cursor: 'pointer', zIndex: 10 }}
      >
        ×
      </button>
      <h1 className={styles.title}>Leaderboard</h1>
      <div className={styles.subtitle}>🌟 PRIZE: TAMAGOTCHI 🌟</div>
      <div className={styles.list}>
        {leaderboard.map((user) => (
          <div className={styles.card} key={user.rank}>
            <span className={styles.rank}>#{user.rank}</span>
            <img
              src="/images/tomash_profile.png"
              alt="Tomash"
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
      <button className={styles.joinBtn} onClick={onJoinBattle}>I want to join</button>
    </div>
  );
} 