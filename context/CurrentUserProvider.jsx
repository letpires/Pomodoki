import React, { useState, useEffect, createContext } from "react";
import * as fcl from "@onflow/fcl";
import { Magic } from "magic-sdk";
import { FlowExtension } from "@magic-ext/flow";

export const CurrentUserContext = createContext({});

const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [magic, setMagic] = useState(null);
  const [network, setNetwork] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(true);

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
    await magic.auth.logout();
    setCurrentUser(null);
    setIsLoggedIn(false);
    setBalance(0);
  };

  useEffect(() => {
    if (!network) return; 

    setLoadingWallet(true);
    setCurrentUser(null);
    setBalance(0)
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

    fcl.config({
      "flow.network": network,
      "accessNode.api": `https://rest-${network}.onflow.org`,
      "discovery.wallet": `https://fcl-discovery.onflow.org/${network}/authn`,
      "0xStakingContract": stakingContractAddress,
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
