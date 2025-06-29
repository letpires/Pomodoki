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

export default function Stats({ onHandlePage }) {
  const [selectedTab, setSelectedTab] = useState("Stats");
  const { currentUser, getUserHistory, balance, network } =
    useContext(CurrentUserContext);
  const [overview, setOverview] = useState(overview_default);

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
      <Navbar />

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
        <div className={styles.buyText}>Buy tokens</div>
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
              <span className={styles.value}>{balance}</span>
            </div>
          </div>
        </>
      )}

      {selectedTab === "My battles" && (
        <div className={styles.myBattlesSection}>
          <div className={styles.overview}>
            {mockBattles.length === 0 ? (
              <div style={{ textAlign: "center", color: "#bfa76a", marginTop: 24 }}>
                You haven&apos;t joined any battles yet.
              </div>
            ) : (
              mockBattles.map((battle) => (
                <div key={battle.id} className={styles.battleCardStats}>
                  <div className={styles.battleCardStatsImageWrapper}>
                    <img src={'/images/hackathon.png'} alt={battle.title} className={styles.battleCardStatsImage} />
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
