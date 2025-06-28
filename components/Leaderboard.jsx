import React from "react";
import styles from "../styles/Leaderboard.module.css";

export default function Leaderboard({ leaderboard, onClose }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Leaderboard</h1>
      <div className={styles.list}>
        {leaderboard.map((user) => (
          <div className={styles.card} key={user.rank}>
            <span className={styles.rank}>#{user.rank}</span>
            <img
              src="/images/allset.png"
              alt="Tomato"
              className={styles.avatar}
            />
            <div className={styles.info}>
              <div className={styles.name}>{user.name}</div>
              <div className={styles.focus}>Focus time: {user.focus}</div>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.joinBtn}>I want to join</button>
      <button onClick={onClose} className={styles.closeBtn}>Fechar</button>
    </div>
  );
} 