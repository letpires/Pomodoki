import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Battles.module.css";
import Navbar from "../components/Navbar";
import { Plus } from "lucide-react";
import BottomNav from "../components/BottomNav";
import Leaderboard from "../components/Leaderboard";
import { CurrentUserContext } from "../context/CurrentUserProvider";
import CreateBattle from "../components/CreateBattle";
import { useBattleStore } from "../stores/battleStore";

const tabs = ["all", "created", "joined"];

function BattleCard({ battle }) {
  // Função para calcular o countdown
  function getCountdown(deadline) {
    const now = Date.now();
    const end = deadline * 1000;
    const diff = end - now;
    if (diff <= 0) return "Finished";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let str = "";
    if (days > 0) str += `${days}d `;
    if (hours > 0 || days > 0) str += `${hours}h `;
    str += `${minutes}m`;
    return str.trim();
  }
  // Função para formatar data curta (sem hora)
  function formatDateShort(ts) {
    if (!ts) return "";
    const d = new Date(ts * 1000);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }
  return (
    <div className={`${styles.card} ${styles[battle.status]}`} key={battle.id}>
      <div className={styles.cardImageWrapper} style={{ position: "relative" }}>
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
              : battle.status === "upcoming"
              ? styles.badgeUpcoming
              : styles.badgeCancelled
          }`}
        >
          {battle.status === "active"
            ? "Active"
            : battle.status === "upcoming"
            ? "Upcoming"
            : "Finished"}
        </span>
      </div>
      {/* Card content */}
      <div className={styles.cardContent}>
        <div
          className={styles.title}
          style={{ fontWeight: "bold", fontSize: 18, marginBottom: 4 }}
        >
          {battle.title}
        </div>
        {battle.status === "finished" ? (
          <div className={styles.deadline} style={{ color: "#bfa76a" }}>
            Ended at: {formatDateShort(battle.deadline)}
          </div>
        ) : (
          <div className={styles.deadline}>
            {battle.status === "active" ? "Countdown" : "Start at"}:{" "}
            {getCountdown(battle.deadline)}
          </div>
        )}
        <div
          className={styles.players}
          style={{ fontSize: 13, color: "#655f4d", marginBottom: 2 }}
        >
          {battle.players} players
        </div>
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
  const { currentUser, getBattles, joinBattle } =
    useContext(CurrentUserContext);
  const { battles: storeBattles, setBattles: setStoreBattles } =
    useBattleStore();
  const [isCreateBattleOpen, setIsCreateBattleOpen] = useState(false);

  const handleJoinBattle = async (battle) => {
    const battleId = parseInt(battle.id);
    const battleResponse = await joinBattle(battleId);
    console.log("battleResponse", battleResponse);
  };

  const fetchBattles = async () => {
    const battles = await getBattles();
    // TODO: remove this filter
    const newBattles = battles
      .filter((x) => x.id > 17)
      .map((battle) => ({
        ...battle,
        title: battle.title || battle.name,
        deadline: battle.endDate,
        image: battle.image,
        players: battle.users.length,
        date: new Date(battle.startDate * 1000),
        status:
          new Date(battle.endDate * 1000) > Date.now()
            ? new Date(battle.startDate * 1000) > Date.now()
              ? "upcoming"
              : "active"
            : "finished",
      }));
    console.log("newBattles", newBattles);
    // Ordenar por id decrescente (mais recente primeiro)
    newBattles.sort((a, b) => b.id - a.id);
    setStoreBattles(newBattles);
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
    setTimeout(async () => {
      await fetchBattles();
    }, 5000);
  };

  // Novo handler para redirecionar após criar
  const handleCreatedBattle = async () => {
    setIsCreateBattleOpen(false);
    await fetchBattles();
    setSelectedTab("created");
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: "#ffedae",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "60px",
      }}
    >
      <Navbar setPage={onHandlePage} />

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
        {storeBattles.map((battle) => (
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
            battle={selectedBattle}
            leaderboard={selectedBattle.leaderboard || []}
            onClose={() => setSelectedBattle(null)}
            onJoinBattle={() => handleJoinBattle(selectedBattle)}
          />
        </div>
      )}

      {isCreateBattleOpen && (
        <div
          className={styles.createBattleOverlay}
          style={{
            position: "absolute",
            top: 100,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
          }}
        >
          <CreateBattle
            onClose={handleCloseCreateBattle}
            onCreated={handleCreatedBattle}
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
