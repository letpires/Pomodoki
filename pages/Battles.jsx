import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Battles.module.css";
import Navbar from "../components/Navbar";
import { Plus } from "lucide-react";
import BottomNav from "../components/BottomNav";
import Leaderboard from "../components/Leaderboard";
import { CurrentUserContext } from "../context/CurrentUserProvider";
import CreateBattle from "../components/CreateBattle";

// ------------------------------------------------------------
// Mock data ---------------------------------------------------
// ------------------------------------------------------------
const mockLeaderboard = [
  { rank: 1, name: "XVMDOJFHE98374", focus: "3:30" },
  { rank: 2, name: "XVMDOJFHE98374", focus: "3:30" },
  { rank: 3, name: "XVMDOJFHE98374", focus: "3:30" },
]; 

const tabs = ["all", "created", "joined"];

function BattleCard({ battle }) {
  return (
    <div className={`${styles.card} ${styles[battle.status]}`} key={battle.id}>
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
          {battle.status === "active" ? "Active" : "Finished"}
        </span>
      </div>

      {/* Card content */}
      <div className={styles.cardContent}>
        <div className={styles.title}>{battle.title}</div>
        <div className={styles.deadline}>Deadline: {new Date(battle.deadline * 1000).toLocaleDateString()}</div>
        <div className={styles.players}>Battle {battle.players} players</div>
      </div>
    </div>
  );
}

function NewBattleCard({ onOpenCreateBattle }) {
  return (
    <div className={styles.newBattle} onClick={onOpenCreateBattle}>
      <Plus className={styles.plus} />
      <span className={styles.newBattleTitle}>New Battle</span>
    </div>
  );
}

export default function Battles({ onHandlePage }) {
  const [selectedTab, setSelectedTab] = useState("created");
  const [selectedBattle, setSelectedBattle] = useState(null);
  const { currentUser, getBattles, joinBattle } = useContext(CurrentUserContext);
  const [battles, setBattles] = useState([]);
  const [isCreateBattleOpen, setIsCreateBattleOpen] = useState(false);
 
  const handleJoinBattle = async (battle) => {
    const battleId = parseInt(battle.id);
    const battleResponse = await joinBattle(battleId);
    console.log("battleResponse", battleResponse);
  };

  const fetchBattles = async () => {
    const battles = await getBattles();
    console.log("battles", battles);
    const newBattles = battles.map((battle) => ({
      ...battle,
      title: battle.name,
      deadline: battle.endDate,
      image: battle.image,
      players: battle.users.length,
      status: new Date(battle.endDate * 1000) > Date.now() ? "active" : "finished",
    }));
    setBattles(newBattles);
  };

  useEffect(() => { 
    if (!currentUser) return;
    fetchBattles();
  }, [currentUser]);
 
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
 
  const handleOpenCreateBattle = () => {
    console.log("handleOpenCreateBattle");
    setIsCreateBattleOpen(true);
  };

  const handleCloseCreateBattle = async () => {
    setIsCreateBattleOpen(false);
    await fetchBattles();
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
      {/* <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${selectedTab === tab ? styles.tabActive : ""}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div> */}

      {/* Grid ----------------------------------------------*/}
      <div className={styles.grid}>
        {/* New battle é mostrado em todos os filtros, sempre como o primeiro card */}
        <NewBattleCard onOpenCreateBattle={handleOpenCreateBattle} />
        {battles.map((battle) => (
          <div
            key={battle.id}
            onClick={() => setSelectedBattle(battle)}
            style={{ cursor: "pointer" }}
          >
            <BattleCard battle={battle} />
          </div>
        ))}
      </div>

      {/* Leaderboard modal */}
      {selectedBattle && (
        <div className={styles.leaderboardOverlay}>
          <Leaderboard
            leaderboard={selectedBattle.leaderboard || mockLeaderboard}
            onClose={() => setSelectedBattle(null)}
            onJoinBattle={() => handleJoinBattle(selectedBattle)}
          />
        </div>
      )}

      {isCreateBattleOpen && (
        <div className={styles.createBattleOverlay} style={{ position: "absolute", top: 100, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <CreateBattle onClose={handleCloseCreateBattle} />
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
