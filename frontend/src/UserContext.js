import { createContext, useState, useEffect } from "react";
import { CheckUser } from "./CheckUser";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [stakeToken, setStakeToken] = useState(null);
  const [isStakeAuthLoading, setIsStakeAuthLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [watchlistSymbols, setWatchlistSymbols] = useState(null);

  const fetchUserInfo = async () => {
    if (!stakeToken) return;

    try {
      const res = await fetch(`https://global-prd-api.hellostake.com/api/sessions/v2/${stakeToken}`);
      if (!res.ok) {
        throw new Error("fetchUserInfo failed");
      }
      const data = await res.json();
      setUserInfo(data);
    } catch (error) {
      console.log(error);
      setUserInfo(null);
    }
  };

  const fetchWatchlistSymbols = async () => {
    if (!userInfo || !userInfo.userID) return;

    try {
      const res = await fetch(
        `https://global-prd-api.hellostake.com/api/products/productsWatchlist/${userInfo.userID}`
      );
      if (!res.ok) {
        throw new Error("fetchWatchlistSymbols failed");
      }
      const data = await res.json();
      const symbols = [];
      if (!data.instrumentsWatchList) {
        throw new Error("fetchWatchlistSymbols failed: !data.instrumentsWatchList");
      }
      data.instrumentsWatchList.forEach((d) => {
        symbols.push(d.product.symbol);
      });
      // console.log(symbols);
      setWatchlistSymbols(symbols);
    } catch (error) {
      console.log(error);
      setWatchlistSymbols(null);
    }
  };

  useEffect(() => {
    CheckUser(setStakeToken, setIsStakeAuthLoading);
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [stakeToken]);

  useEffect(() => {
    fetchWatchlistSymbols();
  }, [userInfo]);

  return (
    <UserContext.Provider
      value={{
        stakeToken,
        setStakeToken,
        isStakeAuthLoading,
        setIsStakeAuthLoading,
        userInfo,
        watchlistSymbols,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
