import React, { useState, useEffect, createContext } from "react";
import magic from "../services/Magic";

export const CurrentUserContext = createContext({});

const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [userStatusLoading, setUserStatusLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      if (magic) {
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          const data = await magic.user.getInfo();
          setCurrentUser(data);
        }
      }
    };
    checkUser();
  }, [magic]);

  // create a function to handle the login
  const handleLogin = async () => {
    try {
      await magic.wallet.connectWithUI();
      const data = await magic.user.getInfo();
      setCurrentUser(data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Failed to log in. Please try again.");
    }
  };

  // create a function to handle the logout
  const handleLogout = async () => {
    await magic.auth.logout();
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userStatusLoading,
        handleLogin,
        handleLogout,
        balance,
        isLoggedIn,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;
