import React, { useState, useEffect, createContext, useCallback } from "react";
import * as fcl from "@onflow/fcl";
import { Magic } from "magic-sdk";
import { FlowExtension } from "@magic-ext/flow";
import GET_USER_STATS_CADENCE from "../constants/getUserStats";
import GET_BATTLES_CADENCE from "../constants/getBattles";
import CREATE_BATTLE_CADENCE from "../constants/createBattle";
import JOIN_BATTLE_CADENCE from "../constants/joinBattle";
import GET_BATTLE_STATS_CADENCE from "../constants/getBattleStats";
import GET_USER_BATTLES_CADENCE from "../constants/getUserBattles";

export const CurrentUserContext = createContext({});

const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(false);
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [magic, setMagic] = useState(null);
  const [network, setNetwork] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const AUTHORIZATION_FUNCTION = magic?.flow.authorization;

  // Load network from localStorage on component mount
  useEffect(() => {
    const savedNetwork = localStorage.getItem("pomodoki-network");
    if (
      savedNetwork &&
      (savedNetwork === "testnet" || savedNetwork === "mainnet")
    ) {
      setNetwork(savedNetwork);
    } else {
      setNetwork("testnet");
    }
  }, []);

  // Function to fetch Flow balance
  const fetchBalance = async () => {
    try {
      setBalanceLoading(true);
      if (magic && isLoggedIn && currentUser) {
        const accountInfo = await fcl.account(currentUser.publicAddress);

        if (accountInfo && accountInfo.balance) {
          const balanceInFlow = parseFloat(accountInfo.balance) / 100000000;
          setBalance(balanceInFlow);
        } else {
          setBalance(0);
        }
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(0);
    } finally {
      setBalanceLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      if (magic) {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          const data = await magic.user.getInfo();
          console.log("data", data);
          setCurrentUser(data);
          setIsLoggedIn(true);
        }
      }
    };
    checkUser();
  }, [magic]);

  useEffect(() => {
    if (currentUser) {
      fetchBalance();
    }
  }, [currentUser]);

  // Periodically refresh balance when user is logged in
  useEffect(() => {
    let interval;
    if (isLoggedIn) {
      fetchBalance();
      // Refresh balance every 30 seconds
      interval = setInterval(fetchBalance, 60000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoggedIn]);

  // create a function to handle the login
  const handleLogin = async () => {
    try {
      await magic.wallet.connectWithUI();
      const data = await magic.user.getInfo();
      setCurrentUser(data);
      setIsLoggedIn(true);
      // Fetch balance after successful login
      await fetchBalance();
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Failed to log in. Please try again.");
    }
  };

  // create a function to handle the logout
  const handleLogout = async () => {
    await magic.user.logout();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setBalance(0);
  };

  // get user stats
  const getUserHistory = async () => {
    if (!currentUser || !currentUser.publicAddress) {
      console.warn("No current user or public address available");
      return null;
    }

    try {
      const stats = await fcl.query({
        cadence: GET_USER_STATS_CADENCE,
        args: (arg, t) => [arg(currentUser.publicAddress, t.Address)],
      });
      return stats;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return null;
    }
  };

  // get battles
  const getBattles = async () => { 
    const battles = await fcl.query({
      cadence: GET_BATTLES_CADENCE,
      args: (arg, t) => [],
    });
    console.log("battles", battles);
    return battles;
  };
 
  const getBattleStats = async (battleId) => { 
    const battle = await fcl.query({
      cadence: GET_BATTLE_STATS_CADENCE,
      args: (arg, t) => [arg(battleId, t.UInt64)],
    });
    console.log("battle", battle);
    return battle;
  };
 
  const getUserBattles = async (address) => { 
    const battle = await fcl.query({
      cadence: GET_USER_BATTLES_CADENCE,
      args: (arg, t) => [arg(address, t.Address)],
    });
    console.log("battle", battle);
    return battle;
  };

  const createBattle = async (endDate, prize, title, image) => {
    const timestamp = Math.floor(new Date(endDate).getTime() / 1000);
    const battle = await fcl.mutate({
      cadence: CREATE_BATTLE_CADENCE,
      args: (arg, t) => [
        arg(timestamp, t.UInt64),
        arg(prize, t.String),
        arg(title, t.String),
        arg(image, t.String),
      ],
      proposer: AUTHORIZATION_FUNCTION,
      authorizations: [AUTHORIZATION_FUNCTION],
      payer: AUTHORIZATION_FUNCTION,
      limit: 9999,
    });
    return battle;
  };

  const joinBattle = async (battleId) => {
    const battle = await fcl.mutate({
      cadence: JOIN_BATTLE_CADENCE,
      args: (arg, t) => [arg(battleId, t.UInt64)],
      proposer: AUTHORIZATION_FUNCTION,
      authorizations: [AUTHORIZATION_FUNCTION],
      payer: AUTHORIZATION_FUNCTION,
      limit: 9999,
    });
    return battle;
  };

  useEffect(() => {
    if (!network) return;

    setLoadingWallet(true);
    setBalance(0);
    localStorage.setItem("pomodoki-network", network);

    setMagic(
      new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
        extensions: [
          new FlowExtension({
            rpcUrl: `https://rest-${network}.onflow.org`,
            network: network,
          }),
        ],
      })
    );

    const stakingContractAddress =
      network === "testnet"
        ? process.env.NEXT_PUBLIC_TESTNET_STAKING_ADDRESS
        : process.env.NEXT_PUBLIC_MAINNET_STAKING_ADDRESS;
    const fungibleTokenAddress =
      network === "testnet"
        ? process.env.NEXT_PUBLIC_TESTNET_FUNGIBLETOKEN_ADDRESS
        : process.env.NEXT_PUBLIC_MAINNET_FUNGIBLETOKEN_ADDRESS;
    const flowTokenAddress =
      network === "testnet"
        ? process.env.NEXT_PUBLIC_TESTNET_FLOWTOKEN_ADDRESS
        : process.env.NEXT_PUBLIC_MAINNET_FLOWTOKEN_ADDRESS;
    const battlesContractAddress =
      network === "testnet"
        ? process.env.NEXT_PUBLIC_TESTNET_BATTLE_ADDRESS
        : process.env.NEXT_PUBLIC_MAINNET_BATTLE_ADDRESS;

    fcl.config({
      "flow.network": network,
      "accessNode.api": `https://rest-${network}.onflow.org`,
      "discovery.wallet": `https://fcl-discovery.onflow.org/${network}/authn`,
      "0xStakingContract": stakingContractAddress,
      "0xBattleContract": battlesContractAddress,
      "0xFungibleToken": fungibleTokenAddress,
      "0xFlowToken": flowTokenAddress,
    });
    setLoadingWallet(false);
  }, [network]);

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        handleLogin,
        handleLogout,
        balance,
        balanceLoading,
        network,
        setNetwork,
        loadingWallet,
        getUserBattles,
        getBattles,
        createBattle,
        joinBattle,
        getBattleStats,
        getUserHistory,
        magic,
        isLoggedIn,
        fetchBalance, // Expose fetchBalance function for manual refresh
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;
