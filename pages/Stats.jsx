import React, { useState, useEffect, useContext, useMemo } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Stats.module.css";
import BottomNav from "../components/BottomNav";
import { CurrentUserContext } from "../context/CurrentUserProvider";


const overview_default = [
  { key: "streak", icon: "🔥", label: "Streak", value: 0 },
  { key: "focusTime", icon: "⏳", label: "Focus time", value: "0m" },
  { key: "sessions", icon: "🍅", label: "Sessions", value: 0 },
];

const tabs = ["Stats", "My battles"];

// Helper function to format time display
const formatTimeDisplay = (totalMinutes) => {
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}; 

export default function Stats({ onHandlePage }) {
  const [selectedTab, setSelectedTab] = useState("Stats");
  const { currentUser, getUserHistory, balance, network, getUserBattles } =
    useContext(CurrentUserContext);
  const [overview, setOverview] = useState(overview_default);
  const [battles, setBattles] = useState([]);

  const fetchBattles = async () => {
    const battles = await getUserBattles(currentUser.publicAddress);
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
  }, []);

  
  useEffect(() => {
    if (!currentUser) return;
    const fetchUserHistory = async () => {
      const stats = await getUserHistory();
      console.log("stats", stats);
      if (stats && stats.length > 0) {
        const totalTimeCommitted = stats
          .filter((stat) => stat.totalUnstaked > 0)
          .reduce((acc, stat) => acc + parseInt(stat.timeCommitted), 0);
        const totalStakes = stats.reduce((acc, stat, index) => {
          if (index === 0) return 0;
          const prevStat = stats[index - 1];
          const prevDate = new Date(prevStat.timestamp);
          const currDate = new Date(stat.timestamp);
          const diffDays = Math.floor(
            (currDate - prevDate) / (1000 * 60 * 60 * 24)
          );
          return diffDays === 1 ? acc + 1 : 1;
        }, 0);

        const newOverview = overview.map((item) => {
          if (item.key === "focusTime") {
            item.value = formatTimeDisplay(totalTimeCommitted);
          }
          if (item.key === "streak") {
            item.value = totalStakes;
          }
          if (item.key === "sessions") {
            item.value = stats.length;
          }
          return item;
        });
        setOverview(newOverview);
      }
    };
    fetchUserHistory();
  }, [currentUser]);

  const overviewMemo = useMemo(
    () => (
      <>
        {overview.map((item) => (
          <div className={styles.overviewCard} key={item.label}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2}}>
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </div>
            <span className={styles.value}>{item.value}</span>
          </div>
        ))}
      </>
    ),
    [overview]
  );

  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: "#ffedae",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        paddingTop: "50px",
      }}
    >
      <Navbar setPage={onHandlePage} />

      <div
        className={styles.buyTokensBlock}
        onClick={() => {
          if (network === "testnet") {
            window.open("https://faucet.flow.com/fund-account", "_blank");
          } else {
            window.open("https://www.moonpay.com/buy/flow", "_blank");
          }
        }}
      >
        <div className={styles.buyCircle}>
          <span className={styles.buyArrow}>↙</span>
        </div>
        <div className={styles.buyText}>BUY FLOW</div>
      </div>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${
              selectedTab === tab ? styles.tabActive : ""
            }`}
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
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2}}>
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                </div>
                <span className={styles.value}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className={styles.balanceOverview}>
            <div className={styles.overviewCard + ' ' + styles.balanceCard}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2}}>
                <span className={styles.label}>Balance</span>
              </div>
              <span className={styles.value}>{balance.toFixed(2)} FLOW</span>
            </div>
          </div>
        </>
      )}

      {selectedTab === "My battles" && (
        <div className={styles.myBattlesSection}>
          <div className={styles.overview}>
            {battles.length === 0 ? (
              <div style={{ textAlign: "center", color: "#bfa76a", marginTop: 24 }}>
                You haven&apos;t joined any battles yet.
              </div>
            ) : (
              battles.map((battle) => (
                <div key={battle.id} className={styles.battleCardStats}>
                  <div className={styles.battleCardStatsImageWrapper}>
                    <img src={battle.image} alt={battle.title} className={styles.battleCardStatsImage} />
                  </div>
                  <div className={styles.battleCardStatsContent}>
                    <div className={styles.battleCardStatsTitle}>{battle.title}</div>
                    <div className={styles.battleCardStatsPlayers}>Battle {battle.players} players</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className={styles.footer}>{/* Ícones de navegação aqui */}</div>
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
