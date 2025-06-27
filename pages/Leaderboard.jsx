import React from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Leaderboard.module.css";

const mockLeaderboard = [
  { rank: 1, name: "XVMDOJFHE98374", focus: "3:30" },
  { rank: 2, name: "XVMDOJFHE98374", focus: "3:30" },
  { rank: 3, name: "XVMDOJFHE98374", focus: "3:30" },
];

export default function Leaderboard() {
  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.title}>Leaderboard</h1>
      <div className={styles.list}>
        {mockLeaderboard.map((user) => (
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
      <div className={styles.footer}>
        {/* Ícones de navegação aqui */}
      </div>
    </div>
  );
}
