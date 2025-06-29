import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Battles.module.css";
import Navbar from "../components/Navbar";
import { Plus } from "lucide-react";
import BottomNav from "../components/BottomNav";
import Leaderboard from "../components/Leaderboard";

// ------------------------------------------------------------
// Mock data ---------------------------------------------------
// ------------------------------------------------------------
const mockLeaderboard = [
  { rank: 1, name: "XVMDOJFHE98374", focus: "3:30" },
  { rank: 2, name: "XVMDOJFHE98374", focus: "3:30" },
  { rank: 3, name: "XVMDOJFHE98374", focus: "3:30" },
];

const mockBattles = [
  {
    id: 1,
    title: "Hackathon Cannes",
    pool: 2.5,
    players: 3,
    status: "active",
    image: "/images/hackathon.png",
    entryFee: false,
    leaderboard: mockLeaderboard,
  },
  {
    id: 2,
    title: "Hackathon Cannes",
    pool: 2.5,
    players: 3,
    status: "cancelled",
    image: "/images/hackathon.png",
    entryFee: false,
    leaderboard: mockLeaderboard,
  },
  {
    id: 3,
    title: "GCP Certification",
    pool: 2.5,
    players: 3,
    status: "active",
    image: "/images/hackathon.png",
    entryFee: false,
    leaderboard: mockLeaderboard,
  },
  {
    id: 3,
    title: "GCP Certification",
    pool: 2.5,
    players: 3,
    status: "active",
    image: "/images/hackathon.png",
    entryFee: false,
    leaderboard: mockLeaderboard,
  },
  {
    id: 3,
    title: "GCP Certification",
    pool: 2.5,
    players: 3,
    status: "active",
    image: "/images/hackathon.png",
    entryFee: false,
    leaderboard: mockLeaderboard,
  },
  {
    id: 4,
    title: "GCP Certification",
    pool: 2.5,
    players: 3,
    status: "active",
    image: "/images/hackathon.png",
    entryFee: false,
    leaderboard: mockLeaderboard,
  },
  {
    id: 5,
    title: "GCP Certification",
    pool: 2.5,
    players: 3,
    status: "active",
    image: "/images/hackathon.png",
    entryFee: false,
    leaderboard: mockLeaderboard,
  },
];

const tabs = ["all", "created", "joined"];

// ------------------------------------------------------------
// Card components --------------------------------------------
// ------------------------------------------------------------
function BattleCard({ battle }) {
  const router = useRouter();
  return (
    <div className={`${styles.card} ${styles[battle.status]}`}>
      <div className={styles.cardImageWrapper}>
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
            battle.status === "active"
              ? styles.badgeActive
              : styles.badgeCancelled
          }`}
        >
          {battle.status === "active" ? "Active" : "Cancelled"}
        </span>
      </div>

      {/* Card content */}
      <div className={styles.cardContent}>
        <div className={styles.title}>{battle.title}</div>
        <div className={styles.deadline}>Deadline: 12/12/2024</div>
        <div className={styles.players}>Battle {battle.players} players</div>
      </div>
    </div>
  );
}

function NewBattleCard() {
  return (
    <div className={styles.newBattle}>
      <Plus className={styles.plus} />
      <span className={styles.newBattleTitle}>New Battle</span>
    </div>
  );
}

// ------------------------------------------------------------
// Page component ---------------------------------------------
// ------------------------------------------------------------
export default function Battles({ onHandlePage }) {
  const [selectedTab, setSelectedTab] = useState("created");
  const [selectedBattle, setSelectedBattle] = useState(null);
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
    <div
      className={styles.container}
      style={{
        backgroundColor: "#ffedae", 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        paddingTop: "60px",
      }}
    >
      <Navbar />

      <h1 className={styles.pageTitle}>Battles</h1>

      {/* Tabs ------------------------------------------------*/}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${selectedTab === tab ? styles.tabActive : ""}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid ----------------------------------------------*/}
      <div className={styles.grid}>
        {/* New battle é mostrado em todos os filtros, sempre como o primeiro card */}
        <NewBattleCard />
        {battlesForTab(selectedTab).map((battle) => (
          <div
            key={battle.id}
            onClick={() => setSelectedBattle(battle)}
            style={{ cursor: "pointer" }}
          >
            <BattleCard
              battle={battle}
            />
          </div>
        ))}
      </div>

      {/* Leaderboard modal */}
      {selectedBattle && (
        <div className={styles.leaderboardOverlay}>
          <Leaderboard
            leaderboard={selectedBattle.leaderboard || mockLeaderboard}
            onClose={() => setSelectedBattle(null)}
          />
        </div>
      )}

      <BottomNav
        active="battles"
        onNavigate={(route) => {
          if (route === "profile") onHandlePage("stats");
          if (route === "timer") onHandlePage("setup");
          if (route === "battles") onHandlePage("battles");
        }}
      />
    </div>
  );
}
