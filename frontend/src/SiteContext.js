import { createContext, useState, useEffect, useContext } from "react";
import { useLocalStorage } from "./components/useLocalStorage";
import { UserContext } from "./UserContext";

export const SiteContext = createContext(null);

export const SiteProvider = ({ children }) => {
  const { stakeToken, isStakeAuthLoading } = useContext(UserContext);
  const [isStakeChartModalOpen, setIsStakeChartModalOpen] = useState(false);
  const [equityPositions, setEquityPositions] = useLocalStorage("stakeEquityPositions", []);
  const [equityValue, setEquityValue] = useLocalStorage("stakeEquityValue", 0);
  const [isEquityPositionsLoading, setIsEquityPositionsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [transactionHistory, setTransactionHistory] = useLocalStorage("stakeTransactionHistory", []);

  const fetchTransactionHistory = async () => {
    try {
      const res = await fetch("http://localhost:4000/stake/transaction-history", {
        credentials: "include",
      });
      if (res.status !== 200) {
        throw new Error("fetchTransactionHistory error");
      }
      const { data } = await res.json();
      if (data) {
        setTransactionHistory(data);
      } else {
        setTransactionHistory([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEquityPositions = async () => {
    if (isStakeChartModalOpen) {
      console.log("open");
      return;
    }
    // TODO: fetchEquityPositions only when market is open
    // console.log("fetchEquityPositions");
    setIsEquityPositionsLoading(true);
    if (!stakeToken) {
      setEquityPositions([]);
      setEquityValue(null);
      setIsEquityPositionsLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/stake/equity-positions", {
        credentials: "include",
      });
      if (res.status !== 200) {
        throw new Error("fetchEquityPositions error");
      }
      const {
        data: { equityPositions, equityValue },
      } = await res.json();

      const equityPositionsSortedByValue = [...equityPositions].sort((a, b) => {
        if (Number.parseFloat(a.marketValue) >= Number.parseFloat(b.marketValue)) return -1;
        return 1;
      });
      setEquityPositions(equityPositionsSortedByValue);
      setEquityValue(equityValue);
      setIsEquityPositionsLoading(false);
    } catch (error) {
      setIsEquityPositionsLoading(false);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    fetchEquityPositions();
    fetchTransactionHistory();
  }, [stakeToken]);

  return (
    <SiteContext.Provider
      value={{
        isStakeChartModalOpen,
        setIsStakeChartModalOpen,
        equityPositions,
        setEquityPositions,
        equityValue,
        setEquityValue,
        isEquityPositionsLoading,
        setIsEquityPositionsLoading,
        errorMessage,
        setErrorMessage,
        fetchEquityPositions,
        transactionHistory,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
