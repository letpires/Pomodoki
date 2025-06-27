import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Battles.module.css";
import Navbar from "../components/Navbar";
import { Plus } from "lucide-react";
import BottomNav from "../components/BottomNav";

// ------------------------------------------------------------
// Mock data ---------------------------------------------------
// ------------------------------------------------------------
const mockBattles = [
  {
    id: 1,
    title: "Hackathon Cannes",
    pool: 2.5,
    players: 3,
    status: "active",
    image: "/lovable-uploads/409d1706-dffe-4c5b-a77a-2f95d5577442.png",
    entryFee: false,
  },
  {
    id: 2,
    title: "Hackathon Cannes",
    pool: 2.5,
    players: 3,
    status: "cancelled",
    image: "/lovable-uploads/409d1706-dffe-4c5b-a77a-2f95d5577442.png",
    entryFee: false,
  },
  {
    id: 3,
    title: "GCP Certification",
    pool: 2.5,
    players: 3,
    status: "active",
    image: "/lovable-uploads/409d1706-dffe-4c5b-a77a-2f95d5577442.png",
    entryFee: false,
  },
];

const tabs = ["all", "created", "joined"];

// ------------------------------------------------------------
// Card components --------------------------------------------
// ------------------------------------------------------------
function BattleCard({ battle }) {
  return (
    <div className={`${styles.card} ${styles[battle.status]}`}>        
      <img
        className={styles.cardImage}
        src={battle.image}
        alt={battle.title}
        onError={(e) => {
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop";
        }}
      />

      {/* Status badge */}
      <span
        className={`${styles.badge} ${
          battle.status === "active" ? styles.badgeActive : styles.badgeCancelled
        }`}
      >
        {battle.status === "active" ? "Active" : "Cancelled"}
      </span>

      {/* Card content */}
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

function NewBattleCard() {
  return (
    <div className={styles.newBattle}>
      <Plus className={styles.plus} />
      <span>New Battle</span>
    </div>
  );
}

// ------------------------------------------------------------
// Page component ---------------------------------------------
// ------------------------------------------------------------
export default function Battles() {
  const [selectedTab, setSelectedTab] = useState("created");
  const router = useRouter();

  // Functions to filter battles by tab -----------------------
  const battlesForTab = (tab) => {
    switch (tab) {
      case "created":
        return mockBattles.filter((b) => b.status === "active");
      case "joined":
        return mockBattles.filter((b) => b.status === "cancelled");
      default:
        return mockBattles;
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />

      <h1 className={styles.pageTitle}>Battles</h1>

      {/* Tabs ------------------------------------------------*/}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={
              selectedTab === tab ? `${styles.tab} ${styles.tabActive}` : styles.tab
            }
            onClick={() => setSelectedTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid ----------------------------------------------*/}
      <div className={styles.grid}>
        {/* New battle is shown on every tab except joined */}
        {selectedTab !== "joined" && <NewBattleCard />}

        {battlesForTab(selectedTab).map((battle) => (
          <BattleCard key={battle.id} battle={battle} />
        ))}
      </div>

      {/* footer fixo — ícones etc. */}
      <BottomNav
        active="battles"
        onNavigate={(route) => {
          if (route === "profile") router.push("/Stats");
          if (route === "timer") router.push("/Setup");
          if (route === "battles") router.push("/Battles");
        }}
      />
    </div>
  );
}
