// pages/Battles.jsx
import React, { useState } from "react";
import styles from "../styles/Battles.module.css"; // vamos criar esse CSS depois
import Navbar from "../components/Navbar";

const mockBattles = [
  {
    id: 1,
    title: "Hackathon Cannes",
    pool: 2.5,
    players: 3,
    status: "active",
    image: "/images/batatack_session.png",
    entryFee: false,
  },
  {
    id: 2,
    title: "Hackathon Cannes",
    pool: 2.5,
    players: 3,
    status: "cancelled",
    image: "/images/batatack_failure.png",
    entryFee: false,
  },
  {
    id: 3,
    title: "GCP Certification",
    pool: 2.5,
    players: 3,
    status: "active",
    image: "/images/tomash_session.png",
    entryFee: false,
  },
];

const tabs = ["All", "Created", "Joined"];

function BattleCard({ battle }) {
  return (
    <div className={styles.card + " " + styles[battle.status]}>
      <img src={battle.image} alt={battle.title} className={styles.cardImage} />
      {battle.status === "active" && <span className={styles.active}>Active</span>}
      {battle.status === "cancelled" && <span className={styles.cancelled}>Cancelled</span>}
      <div className={styles.cardContent}>
        <div className={styles.entryFee}>
          {battle.entryFee ? `Entry fee: ${battle.entryFee}` : "No entry fee"}
        </div>
        <div className={styles.title}>{battle.title}</div>
        <div className={styles.pool}>🪙 Pool: {battle.pool}</div>
        <div className={styles.players}>Battle {battle.players} players</div>
      </div>
    </div>
  );
}

export default function Battles() {
  const [selectedTab, setSelectedTab] = useState("All");

  return (
    <div className={styles.container} style={{ maxWidth: 380, minWidth: 320, width: '100vw', maxHeight: 600, minHeight: 500, height: '100vh', margin: '0 auto', overflowY: 'auto', paddingTop: 60 }}>
      <Navbar />
      <h1 className={styles.title}>Battles</h1>
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={selectedTab === tab ? styles.activeTab : ""}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        <div className={styles.newBattle}>
          <span>＋</span>
          <div>New Battle</div>
        </div>
        {mockBattles.map(battle => (
          <BattleCard key={battle.id} battle={battle} />
        ))}
      </div>
      <div className={styles.footer}>
        {/* Ícones do menu inferior */}
      </div>
    </div>
  );
}