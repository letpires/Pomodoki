import React, { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import styles from "../styles/Stats.module.css";
import BottomNav from "../components/BottomNav";

const overview = [
  { icon: "🔥", label: "Streak", value: 0 },
  { icon: "⏳", label: "Focus time", value: "1h" },
  { icon: "🍅", label: "Sessions", value: 2 },
];

const tabs = ["Stats", "My battles", "NFTs"];

export default function Stats({onHandlePage}) {
  const [selectedTab, setSelectedTab] = useState("Stats");
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Navbar />

      <div className={styles.buyTokens}>
        <div className={styles.arrow}>↓</div>
        <div className={styles.buyText}>Buy tokens</div>
      </div>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${selectedTab === tab ? styles.tabActive : ""}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.sectionTitle}>Overview</div>
      <div className={styles.overview}>
        {overview.map((item) => (
          <div className={styles.overviewCard} key={item.label}>
            <div className={styles.icon}>{item.icon}</div>
            <div className={styles.value}>{item.value}</div>
            <div className={styles.label}>{item.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.balance}>Balance : XX tokens</div>

      <div className={styles.footer}>
        {/* Ícones de navegação aqui */}
      </div>
      <BottomNav
        active="profile"
        onNavigate={(route) => {
          if (route === "profile") onHandlePage("stats");
          if (route === "timer") onHandlePage("setup");
          if (route === "battles") onHandlePage("battles");
        }}
      />
    </div>
  );
}
