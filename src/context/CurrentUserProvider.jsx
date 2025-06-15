import React, { useState, useEffect, createContext } from "react"; 
import magic from "../services/Magic";

export const CurrentUserContext = createContext({});

const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [userStatusLoading, setUserStatusLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserStatusLoading(true);
        const magicIsLoggedIn = await magic.user.isLoggedIn();
        if (magicIsLoggedIn) {
          const metaData = await magic.user.getMetadata();
          setCurrentUser(metaData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setUserStatusLoading(false);
      }
    };

    if (magic) {
      fetchUserData();
    }
  }, [magic]);

  // create a function to handle the login
  const handleLogin = async () => {
    await magic.auth.loginWithMagicLink({ email: "gjpeixer@gmail.com" });
  };

  // create a function to handle the logout
  const handleLogout = async () => {
    await magic.auth.logout();
  };

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, userStatusLoading, handleLogin, handleLogout, balance, isLoggedIn }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;
