import React from "react";
import { User, Clock, Swords } from "lucide-react";
import styles from "../styles/BottomNav.module.css";

export default function BottomNav({ active = "profile", onNavigate }) {
  return (
    <nav className={styles.navbar}>
      <button
        className={`${styles.button} ${active === "profile" ? styles.active : ""}`}
        onClick={() => onNavigate && onNavigate("profile")}
        aria-label="Profile"
      >
        <User />
      </button>
      <button
        className={`${styles.button} ${active === "timer" ? styles.active : ""}`}
        onClick={() => onNavigate && onNavigate("timer")}
        aria-label="Timer"
      >
        <Clock />
      </button>
      <button
        className={`${styles.button} ${active === "battles" ? styles.active : ""}`}
        onClick={() => onNavigate && onNavigate("battles")}
        aria-label="Battles"
      >
        <Swords />
      </button>
    </nav>
  );
} 