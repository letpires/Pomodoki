import React, { useState, useEffect, useContext, useMemo } from "react";
import Navbar from "../components/Navbar";
import styles from "../styles/Stats.module.css";
import BottomNav from "../components/BottomNav";
import { CurrentUserContext } from "../context/CurrentUserProvider";
import { useOverviewStore } from "../stores/overviewStore";
import { useBattleStore } from "../stores/battleStore";

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
  const { overview, setOverview, resetOverview } = useOverviewStore();
  const { battles, setBattles } = useBattleStore();

  const fetchBattles = async () => {
    const battles = await getUserBattles(currentUser.publicAddress);
    console.log("battles", battles);
    const newBattles = battles.map((battle) => ({
      ...battle,
      title: battle.title,
      deadline: battle.endDate,
      image: battle.image,
      players: battle.users.length,
      status:
        new Date(battle.endDate * 1000) > Date.now() ? "active" : "finished",
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
        const stakesPerDay = stats
          .filter((stat) => stat.totalUnstaked > 0)
          .reduce((acc, stat) => {
            const date = new Date(stat.startDate * 1000);
            const dateKey = date.toISOString().split("T")[0];

            if (!acc[dateKey]) {
              acc[dateKey] = 1;
            } else {
              acc[dateKey]++;
            }
            return acc;
          }, {});

        // Calculate streak by looking for consecutive days
        const dates = Object.keys(stakesPerDay).sort();
        let currentStreak = 1;
        let maxStreak = 1;

        for (let i = 1; i < dates.length; i++) {
          const prevDate = new Date(dates[i - 1]);
          const currDate = new Date(dates[i]);
          const diffDays = Math.floor(
            (currDate - prevDate) / (1000 * 60 * 60 * 24)
          );

          if (diffDays === 1) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            currentStreak = 1;
          }
        }

        const totalStakes = maxStreak;

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
      } else {
        resetOverview();
      }
    };
    fetchUserHistory();
  }, [currentUser]);

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
        style={{
          display: "flex",
          gap: "50px",
        }}
      >
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
        <div
          className={styles.buyTokensBlock}
          onClick={() => {
            window.open(
              `https://pomodoki.com?wallet=${currentUser.publicAddress}&email=${currentUser.email}&network=${network}#be-the-first-to-know`,
              "_blank"
            );
          }}
        >
          <div className={styles.buyCircle}>
            <span className={styles.buyArrow}>🎁</span>
          </div>
          <div className={styles.buyText}>AIRDROP MODOKI</div>
        </div>
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    marginBottom: 2,
                  }}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                </div>
                <span className={styles.value}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className={styles.balanceOverview}>
            <div className={styles.overviewCard + " " + styles.balanceCard}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  marginBottom: 2,
                }}
              >
                <span className={styles.label}>Balance</span>
              </div>
              <span className={styles.value}>{balance.toFixed(2)} FLOW</span>
              {balance === 0 && (
                <div style={{fontSize: 12, color: '#666', marginTop: 4}}>
                  Buy FLOW or request an airdrop to get started
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {selectedTab === "My battles" && (
        <div className={styles.myBattlesSection}>
          {battles.length === 0 ? (
            <div className={styles.emptyBattlesMessage}>
              You haven&apos;t joined any battles yet.
            </div>
          ) : (
            <div className={styles.myBattlesGrid}>
              {battles.map((battle) => (
                <div key={battle.id} className={styles.battleCardStats}>
                  <div
                    className={styles.battleCardStatsImageWrapper}
                    style={{ position: "relative" }}
                  >
                    <img
                      src={battle.image}
                      alt={battle.title}
                      className={styles.battleCardStatsImage}
                    />
                    <span
                      className={
                        battle.status === "active"
                          ? styles.badgeActive
                          : styles.badgeFinished
                      }
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        fontSize: 12,
                        padding: "4px 12px",
                        borderRadius: 16,
                        fontFamily: "VT323, monospace",
                        fontWeight: "bold",
                        zIndex: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      }}
                    >
                      {battle.status === "active" ? "Active" : "Finished"}
                    </span>
                  </div>
                  <div className={styles.battleCardStatsContent}>
                    <div className={styles.battleCardStatsTitle}>
                      {battle.name || battle.title}
                    </div>
                    {battle.status === "finished" ? (
                      <div className={styles.battleCardStatsCountdown}>
                        Ended at: {formatDateShort(battle.deadline)}
                      </div>
                    ) : (
                      <div className={styles.battleCardStatsCountdown}>
                        Start at: {getCountdown(battle.deadline)}
                      </div>
                    )}
                    <div className={styles.battleCardStatsPlayers}>
                      {battle.players} players
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

function formatDateShort(ts) {
  if (!ts) return "";
  const d = new Date(ts * 1000);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
