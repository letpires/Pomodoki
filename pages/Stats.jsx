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

// Mock battles (pode importar de outro arquivo se quiser)
const mockBattles = [
  {
    id: 1,
    title: "Hackathon Cannes",
    pool: 2.5,
    players: 3,
    status: "joined",
    image: "/lovable-uploads/409d1706-dffe-4c5b-a77a-2f95d5577442.png",
  },
  {
    id: 2,
    title: "GCP Certification",
    pool: 2.5,
    players: 3,
    status: "joined",
    image: "/lovable-uploads/409d1706-dffe-4c5b-a77a-2f95d5577442.png",
  },
];

export default function Stats() {
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

      {selectedTab === "Stats" && (
        <>
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
        </>
      )}

      {selectedTab === "My battles" && (
        <div className={styles.myBattlesSection}>
          <div className={styles.sectionTitle}>My Battles</div>
          {mockBattles.length === 0 ? (
            <div style={{ textAlign: "center", color: "#bfa76a", marginTop: 24 }}>
              You haven't joined any battles yet.
            </div>
          ) : (
            <div className={styles.myBattlesList}>
              {mockBattles.map((battle) => (
                <div key={battle.id} className={styles.myBattleCard}>
                  <img src={battle.image} alt={battle.title} style={{ width: 48, height: 48, borderRadius: 12, marginRight: 12 }} />
                  <div>
                    <div style={{ fontWeight: "bold", color: "#5a4a2c" }}>{battle.title}</div>
                    <div style={{ fontSize: 13, color: "#7c6a4d" }}>Pool: {battle.pool} | Players: {battle.players}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.footer}>
        {/* Ícones de navegação aqui */}
      </div>
      <BottomNav
        active="profile"
        onNavigate={(route) => {
          if (route === "profile") router.push("/Stats");
          if (route === "timer") router.push("/Setup");
          if (route === "battles") router.push("/Battles");
        }}
      />
    </div>
  );
}
